import { createAdminClient } from "@/lib/supabase/server";
import { events as staticEvents, type EventWithContext, CATEGORY_CONFIGS } from "@/data/events";
import type { DeliveryMode } from "@/lib/constants/events";

export interface PublicSpeaker {
	id: string;
	name: string;
	title: string | null;
	company: string | null;
	avatar_url: string | null;
	display_order?: number;
}

export interface PublicEventCompany {
	id: string;
	name: string;
	logo_url: string;
	web_link: string | null;
	role?: string;
}

export interface PublicEvent {
	id: string;
	title: string;
	topic: string | null;
	category: string;
	event_date: string;
	time: string | null;
	venue: string | null;
	description: string | null;
	images: string[];
	is_featured: boolean;
	delivery_mode: DeliveryMode;
	meeting_url: string | null;
	map_url: string | null;
	series_stage: string | null;
	series_order: number;
	cycle: {
		id: string;
		version: string;
		year: number;
		is_active: boolean;
	} | null;
	series: {
		id: string;
		title: string;
	} | null;
	speakers: PublicSpeaker[];
	companies: PublicEventCompany[];
}

/**
 * Fetches all public events from Supabase with SSR/ISR support.
 * Maps modular delivery modes, speakers array, and participating companies.
 */
export async function getPublicEvents(): Promise<PublicEvent[]> {
	try {
		const supabase = createAdminClient();

		let eventRows: any[] | null = null;

		// 1. Try full modular query
		const { data, error } = await supabase
			.from("events")
			.select(`
				id,
				title,
				topic,
				category,
				event_date,
				time,
				venue,
				description,
				images,
				is_featured,
				delivery_mode,
				meeting_url,
				map_url,
				series_stage,
				series_order,
				cycle:studpro_cycles(id, version, year, is_active),
				series:event_series(id, title),
				speakers(id, name, title, company, avatar_url, display_order)
			`)
			.order("event_date", { ascending: false });

		if (!error && data && data.length > 0) {
			eventRows = data;
		} else {
			// 2. Defensive fallback if modular columns are not yet in remote DB
			const { data: baseData } = await supabase
				.from("events")
				.select(`
					id,
					title,
					topic,
					category,
					event_date,
					time,
					venue,
					description,
					images,
					is_featured,
					cycle:studpro_cycles(id, version, year, is_active),
					series:event_series(id, title),
					speakers(id, name, title, company, avatar_url)
				`)
				.order("event_date", { ascending: false });

			if (baseData && baseData.length > 0) {
				eventRows = baseData;
			}
		}

		if (eventRows && eventRows.length > 0) {
			// Fetch event companies safely
			const eventCompaniesMap: Record<string, PublicEventCompany[]> = {};
			try {
				const { data: ecData } = await supabase
					.from("event_companies")
					.select(`
						event_id,
						role,
						company:companies(id, name, logo_url, web_link)
					`)
					.order("display_order", { ascending: true });

				if (ecData) {
					ecData.forEach((row: any) => {
						if (!row.event_id || !row.company) return;
						if (!eventCompaniesMap[row.event_id]) {
							eventCompaniesMap[row.event_id] = [];
						}
						eventCompaniesMap[row.event_id].push({
							id: row.company.id,
							name: row.company.name,
							logo_url: row.company.logo_url,
							web_link: row.company.web_link,
							role: row.role || "Partner",
						});
					});
				}
			} catch (ecErr) {
				console.warn("Could not query event_companies (table may be pending migration):", ecErr);
			}

			return eventRows.map((ev: any) => {
				const speakersList: PublicSpeaker[] = (ev.speakers || []).sort(
					(a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0),
				);

				const isOnline =
					ev.delivery_mode === "online" ||
					ev.category === "webinar" ||
					ev.venue?.toLowerCase().includes("zoom") ||
					ev.venue?.toLowerCase().includes("meet") ||
					ev.venue?.toLowerCase().includes("online");

				const deliveryMode: DeliveryMode =
					(ev.delivery_mode as DeliveryMode) || (isOnline ? "online" : "physical");

				const venueDisplay =
					ev.venue || (deliveryMode === "online" ? "Live via Zoom" : null);

				const normalizedCategory =
					ev.category === "cv-clinics" ? "career-fairs" : ev.category;

				return {
					id: ev.id,
					title: ev.title,
					topic: ev.topic || null,
					category: normalizedCategory,
					event_date: ev.event_date,
					time: ev.time || null,
					venue: venueDisplay,
					description: ev.description || null,
					images: ev.images || [],
					is_featured: !!ev.is_featured,
					delivery_mode: deliveryMode,
					meeting_url: ev.meeting_url || (deliveryMode === "online" ? venueDisplay : null),
					map_url: ev.map_url || null,
					series_stage: ev.series_stage || null,
					series_order: ev.series_order ?? 1,
					cycle: ev.cycle || null,
					series: ev.series || null,
					speakers: speakersList,
					companies: eventCompaniesMap[ev.id] || [],
				};
			});
		}
	} catch (e) {
		console.warn("Falling back to static events due to error:", e);
	}

	// Fallback to static data
	const fallbackList: PublicEvent[] = [];
	staticEvents.forEach((version, vIdx) => {
		version.eventSeries.forEach((series, sIdx) => {
			series.events.forEach((ev, idx) => {
				const isOnline =
					ev.category === "webinar" ||
					ev.venue?.toLowerCase().includes("zoom") ||
					ev.venue?.toLowerCase().includes("online");

				const deliveryMode: DeliveryMode = isOnline ? "online" : "physical";
				const venueDisplay = ev.venue || (deliveryMode === "online" ? "Live via Zoom" : null);

				const uniqueId = `${version.version}-${series.title}-${ev.category}-${ev.title.replace(/\s+/g, "_")}-${vIdx}-${sIdx}-${idx}`;
				fallbackList.push({
					id: uniqueId,
					title: ev.title,
					topic: ev.topic || null,
					category: ev.category || "workshops",
					event_date: ev.date,
					time: ev.time || null,
					venue: venueDisplay,
					description: ev.description || null,
					images: ev.images || [],
					is_featured: false,
					delivery_mode: deliveryMode,
					meeting_url: deliveryMode === "online" ? venueDisplay : null,
					map_url: null,
					series_stage: series.title === "Young Protegé" ? `Stage ${idx + 1}` : null,
					series_order: idx + 1,
					cycle: {
						id: version.version,
						version: version.version,
						year: version.year,
						is_active: version.year === 2026,
					},
					series: {
						id: series.title,
						title: series.title,
					},
					speakers: ev.speaker
						? [
								{
									id: "spk-1",
									name: ev.speaker.name,
									title: ev.speaker.title || null,
									company: ev.speaker.company || null,
									avatar_url: null,
									display_order: 1,
								},
							]
						: [],
					companies: [],
				});
			});
		});
	});

	return fallbackList;
}

/**
 * Fetches an event by its category and title (case-insensitive slug match).
 */
export async function getPublicEventBySlug(
	category: string,
	title: string,
): Promise<PublicEvent | null> {
	const allEvents = await getPublicEvents();
	const cleanTitle = decodeURIComponent(title).trim().toLowerCase();
	const cleanCategory = category.trim().toLowerCase();
	const targetCategory = cleanCategory === "cv-clinics" ? "career-fairs" : cleanCategory;

	const found = allEvents.find(
		(e) => {
			const cat = e.category.toLowerCase() === "cv-clinics" ? "career-fairs" : e.category.toLowerCase();
			return cat === targetCategory && e.title.trim().toLowerCase() === cleanTitle;
		},
	);

	return found || null;
}

/**
 * Fetches sibling events belonging to the same series, ordered by stage/sequence.
 * Powers the Series Milestone Timeline / Stepper on the public event page.
 */
export async function getSeriesEvents(
	seriesIdOrTitle: string,
): Promise<PublicEvent[]> {
	const allEvents = await getPublicEvents();
	const cleanTarget = seriesIdOrTitle.trim().toLowerCase();

	return allEvents
		.filter(
			(e) =>
				e.series?.id?.toLowerCase() === cleanTarget ||
				e.series?.title?.toLowerCase() === cleanTarget,
		)
		.sort((a, b) => {
			if (a.series_order !== b.series_order) {
				return a.series_order - b.series_order;
			}
			return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
		});
}
