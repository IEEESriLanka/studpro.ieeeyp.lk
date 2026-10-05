import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { EventsManager } from "@/components/admin/events/EventsManager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		redirect("/admin/login");
	}
	const adminClient = createAdminClient();

	const [eventsRes, cyclesRes, seriesRes, companiesRes] = await Promise.all([
		adminClient
			.from("events")
			.select("*, speakers(*)")
			.order("event_date", { ascending: false }),
		adminClient
			.from("studpro_cycles")
			.select("id, version, year")
			.order("year", { ascending: false }),
		adminClient
			.from("event_series")
			.select("id, cycle_id, title")
			.order("title", { ascending: true }),
		adminClient
			.from("companies")
			.select("id, name, logo_url, web_link")
			.order("name", { ascending: true }),
	]);

	// Defensively fetch linked event_companies
	const eventCompaniesMap: Record<string, any[]> = {};
	try {
		const { data: ecData } = await (adminClient as any)
			.from("event_companies")
			.select("event_id, company_id, role, display_order");
		if (ecData) {
			ecData.forEach((row: any) => {
				if (!eventCompaniesMap[row.event_id]) {
					eventCompaniesMap[row.event_id] = [];
				}
				eventCompaniesMap[row.event_id].push(row);
			});
		}
	} catch (e) {
		console.warn("Could not query event_companies in admin:", e);
	}

	const eventsWithExtras = (eventsRes.data || []).map((ev: any) => ({
		...ev,
		event_companies: eventCompaniesMap[ev.id] || [],
	}));

	return (
		<EventsManager
			initialEvents={eventsWithExtras}
			cycles={cyclesRes.data || []}
			series={seriesRes.data || []}
			companies={companiesRes.data || []}
		/>
	);
}
