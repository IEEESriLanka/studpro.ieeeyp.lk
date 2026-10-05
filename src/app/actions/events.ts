"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/logger";
import type { SpeakerInput, EventCompanyInput, DeliveryMode } from "@/lib/constants/events";

export type ActionResponse = {
	success?: boolean;
	error?: string | null;
	eventId?: string;
	data?: any;
};

/**
 * Creates a new modular event record with multi-speaker and multi-company support.
 */
export async function createEvent(formData: FormData): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const cycle_id = formData.get("cycle_id") as string;
	const series_id = (formData.get("series_id") as string) || null;
	const rawCategory = (formData.get("category") as string)?.trim();
	const category = rawCategory === "cv-clinics" ? "career-fairs" : rawCategory;
	const title = (formData.get("title") as string)?.trim();
	const topic = (formData.get("topic") as string)?.trim() || null;
	const event_date = formData.get("event_date") as string;
	const time = (formData.get("time") as string)?.trim() || null;
	const description = (formData.get("description") as string)?.trim() || null;
	const imagesRaw = (formData.get("images") as string)?.trim() || "";
	const is_featured = formData.get("is_featured") === "true";

	// Modular fields
	const delivery_mode = ((formData.get("delivery_mode") as string) || "physical") as DeliveryMode;
	let venue = (formData.get("venue") as string)?.trim() || null;
	const online_platform = (formData.get("online_platform") as string)?.trim() || null;
	const map_url = (formData.get("map_url") as string)?.trim() || null;
	const series_stage = (formData.get("series_stage") as string)?.trim() || null;
	const series_order = parseInt((formData.get("series_order") as string) || "1", 10);

	if (!title || !category || !event_date || !cycle_id) {
		return { error: "Please fill in all required fields (Title, Cycle, Category, Date)." };
	}

	// Validation and defaults based on delivery mode
	if (delivery_mode === "online") {
		if (!venue) {
			venue = "Live via Zoom";
		}
	} else if (delivery_mode === "physical" && !venue) {
		return { error: "Please specify a physical venue location for this in-person event." };
	} else if (delivery_mode === "hybrid" && !venue) {
		return { error: "Please specify a physical venue location for this hybrid event." };
	}

	const meeting_url = delivery_mode === "online" ? venue : online_platform;

	const images = imagesRaw
		? imagesRaw.split(",").map((s) => s.trim()).filter(Boolean)
		: [];

	// Parse Speakers JSON (or single legacy fallback)
	let speakers: SpeakerInput[] = [];
	const speakersJson = formData.get("speakers_json") as string;
	if (speakersJson) {
		try {
			speakers = JSON.parse(speakersJson);
		} catch (e) {
			console.error("Failed to parse speakers_json:", e);
		}
	} else {
		const speakerName = (formData.get("speaker_name") as string)?.trim();
		if (speakerName) {
			speakers.push({
				name: speakerName,
				title: (formData.get("speaker_title") as string)?.trim() || null,
				company: (formData.get("speaker_company") as string)?.trim() || null,
			});
		}
	}

	// Parse Companies JSON
	let companies: EventCompanyInput[] = [];
	const companiesJson = formData.get("companies_json") as string;
	if (companiesJson) {
		try {
			companies = JSON.parse(companiesJson);
		} catch (e) {
			console.error("Failed to parse companies_json:", e);
		}
	}

	const adminClient = createAdminClient();

	// Insert Event
	const eventInsertPayload: Record<string, any> = {
		cycle_id,
		series_id: series_id === "none" || !series_id ? null : series_id,
		category,
		title,
		topic,
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
		series_order: isNaN(series_order) ? 1 : series_order,
	};

	let event: { id: string } | null = null;
	const { data: createdEvent, error: eventErr } = await (adminClient as any)
		.from("events")
		.insert(eventInsertPayload as any)
		.select("id")
		.single();

	if (eventErr) {
		// Graceful fallback if migration 04 columns are not yet active
		console.warn("Event insert failed with extended fields, retrying baseline:", eventErr.message);
		delete eventInsertPayload.delivery_mode;
		delete eventInsertPayload.meeting_url;
		delete eventInsertPayload.map_url;
		delete eventInsertPayload.series_stage;
		delete eventInsertPayload.series_order;

		const { data: fallbackEvent, error: fallbackErr } = await (adminClient as any)
			.from("events")
			.insert(eventInsertPayload as any)
			.select("id")
			.single();

		if (fallbackErr || !fallbackEvent) {
			return { error: fallbackErr?.message || "Failed to create event." };
		}
		event = fallbackEvent;
	} else {
		event = createdEvent;
	}

	if (!event?.id) {
		return { error: "Failed to create event." };
	}

	// Insert Speakers (Multi-Speaker support)
	if (speakers.length > 0) {
		const speakerRows = speakers
			.filter((s) => s.name?.trim())
			.map((s, idx) => ({
				event_id: event!.id,
				name: s.name.trim(),
				title: s.title?.trim() || null,
				company: s.company?.trim() || null,
				avatar_url: s.avatar_url?.trim() || null,
				display_order: s.display_order ?? idx + 1,
			}));

		if (speakerRows.length > 0) {
			const { error: spkErr } = await adminClient.from("speakers").insert(speakerRows);
			if (spkErr) {
				console.warn("Error inserting speakers:", spkErr.message);
			}
		}
	}

	// Insert Company associations into event_companies
	if (companies.length > 0) {
		const companyRows = companies.map((c, idx) => ({
			event_id: event!.id,
			company_id: c.company_id,
			role: c.role || "Partner",
			display_order: idx + 1,
		}));

		try {
			await (adminClient as any).from("event_companies").insert(companyRows);
		} catch (compErr) {
			console.warn("Could not insert event_companies (table may need migration):", compErr);
		}
	}

	await logAuditEvent({
		action: "event.created",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: {
			eventId: event.id,
			title,
			category,
			delivery_mode,
			speakerCount: speakers.length,
			companyCount: companies.length,
		},
	});

	revalidatePath("/admin");
	revalidatePath("/admin/events");
	revalidatePath("/events");
	return { success: true, eventId: event.id };
}

/**
 * Updates an existing modular event record with multi-speaker and multi-company synchronization.
 */
export async function updateEvent(
	eventId: string,
	formData: FormData,
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const cycle_id = formData.get("cycle_id") as string;
	const series_id = (formData.get("series_id") as string) || null;
	const rawCategory = (formData.get("category") as string)?.trim();
	const category = rawCategory === "cv-clinics" ? "career-fairs" : rawCategory;
	const title = (formData.get("title") as string)?.trim();
	const topic = (formData.get("topic") as string)?.trim() || null;
	const event_date = formData.get("event_date") as string;
	const time = (formData.get("time") as string)?.trim() || null;
	const description = (formData.get("description") as string)?.trim() || null;
	const imagesRaw = (formData.get("images") as string)?.trim() || "";
	const is_featured = formData.get("is_featured") === "true";

	// Modular fields
	const delivery_mode = ((formData.get("delivery_mode") as string) || "physical") as DeliveryMode;
	let venue = (formData.get("venue") as string)?.trim() || null;
	const online_platform = (formData.get("online_platform") as string)?.trim() || null;
	const map_url = (formData.get("map_url") as string)?.trim() || null;
	const series_stage = (formData.get("series_stage") as string)?.trim() || null;
	const series_order = parseInt((formData.get("series_order") as string) || "1", 10);

	if (!title || !category || !event_date || !cycle_id) {
		return { error: "Please fill in all required fields (Title, Cycle, Category, Date)." };
	}

	// Validation and defaults based on delivery mode
	if (delivery_mode === "online") {
		if (!venue) {
			venue = "Live via Zoom";
		}
	} else if (delivery_mode === "physical" && !venue) {
		return { error: "Please specify a physical venue location for this in-person event." };
	} else if (delivery_mode === "hybrid" && !venue) {
		return { error: "Please specify a physical venue location for this hybrid event." };
	}

	const meeting_url = delivery_mode === "online" ? venue : online_platform;

	const images = imagesRaw
		? imagesRaw.split(",").map((s) => s.trim()).filter(Boolean)
		: [];

	// Parse Speakers JSON
	let speakers: SpeakerInput[] = [];
	const speakersJson = formData.get("speakers_json") as string;
	if (speakersJson) {
		try {
			speakers = JSON.parse(speakersJson);
		} catch (e) {
			console.error("Failed to parse speakers_json:", e);
		}
	} else {
		const speakerName = (formData.get("speaker_name") as string)?.trim();
		if (speakerName) {
			speakers.push({
				name: speakerName,
				title: (formData.get("speaker_title") as string)?.trim() || null,
				company: (formData.get("speaker_company") as string)?.trim() || null,
			});
		}
	}

	// Parse Companies JSON
	let companies: EventCompanyInput[] = [];
	const companiesJson = formData.get("companies_json") as string;
	if (companiesJson) {
		try {
			companies = JSON.parse(companiesJson);
		} catch (e) {
			console.error("Failed to parse companies_json:", e);
		}
	}

	const adminClient = createAdminClient();

	const eventUpdatePayload: Record<string, any> = {
		cycle_id,
		series_id: series_id === "none" || !series_id ? null : series_id,
		category,
		title,
		topic,
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
		series_order: isNaN(series_order) ? 1 : series_order,
	};

	const { error: eventErr } = await (adminClient as any)
		.from("events")
		.update(eventUpdatePayload as any)
		.eq("id", eventId);

	if (eventErr) {
		console.warn("Event update failed with extended fields, retrying baseline:", eventErr.message);
		delete eventUpdatePayload.delivery_mode;
		delete eventUpdatePayload.meeting_url;
		delete eventUpdatePayload.map_url;
		delete eventUpdatePayload.series_stage;
		delete eventUpdatePayload.series_order;

		const { error: fallbackErr } = await (adminClient as any)
			.from("events")
			.update(eventUpdatePayload as any)
			.eq("id", eventId);

		if (fallbackErr) {
			return { error: fallbackErr.message };
		}
	}

	// Synchronize Speakers: atomic wipe and recreate for this event
	await adminClient.from("speakers").delete().eq("event_id", eventId);
	if (speakers.length > 0) {
		const speakerRows = speakers
			.filter((s) => s.name?.trim())
			.map((s, idx) => ({
				event_id: eventId,
				name: s.name.trim(),
				title: s.title?.trim() || null,
				company: s.company?.trim() || null,
				avatar_url: s.avatar_url?.trim() || null,
				display_order: s.display_order ?? idx + 1,
			}));

		if (speakerRows.length > 0) {
			await adminClient.from("speakers").insert(speakerRows);
		}
	}

	// Synchronize Event Companies
	try {
		await (adminClient as any).from("event_companies").delete().eq("event_id", eventId);
		if (companies.length > 0) {
			const companyRows = companies.map((c, idx) => ({
				event_id: eventId,
				company_id: c.company_id,
				role: c.role || "Partner",
				display_order: idx + 1,
			}));
			await (adminClient as any).from("event_companies").insert(companyRows);
		}
	} catch (compErr) {
		console.warn("Could not sync event_companies:", compErr);
	}

	await logAuditEvent({
		action: "event.updated",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: {
			eventId,
			title,
			category,
			delivery_mode,
			speakerCount: speakers.length,
			companyCount: companies.length,
		},
	});

	revalidatePath("/admin");
	revalidatePath("/admin/events");
	revalidatePath("/events");
	return { success: true };
}

/**
 * Deletes an event and cascades to its speakers and associated companies.
 */
export async function deleteEvent(eventId: string): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	// Clean associations defensively
	try {
		await (adminClient as any).from("event_companies").delete().eq("event_id", eventId);
	} catch {}
	await adminClient.from("speakers").delete().eq("event_id", eventId);

	const { error } = await adminClient.from("events").delete().eq("id", eventId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "event.deleted",
		category: "DATA_MUTATION",
		severity: "WARN",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { eventId },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/events");
	revalidatePath("/events");
	return { success: true };
}

/**
 * Creates a new event series / track.
 */
export async function createEventSeries(formData: FormData): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const cycle_id = formData.get("cycle_id") as string;
	const title = (formData.get("title") as string)?.trim();
	const description = (formData.get("description") as string)?.trim() || null;

	if (!cycle_id || !title) {
		return { error: "Please provide both Cycle and Series Title." };
	}

	const adminClient = createAdminClient();
	const { data: createdSeries, error } = await adminClient
		.from("event_series")
		.insert({
			cycle_id,
			title,
			description,
		})
		.select("id, cycle_id, title")
		.single();

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/admin/events");
	return { success: true, data: createdSeries };
}

/**
 * Deletes an event series / track.
 */
export async function deleteEventSeries(seriesId: string): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();
	const { error } = await adminClient.from("event_series").delete().eq("id", seriesId);

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/admin/events");
	return { success: true };
}
