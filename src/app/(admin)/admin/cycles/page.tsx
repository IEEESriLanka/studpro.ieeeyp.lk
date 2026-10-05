import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { CyclesManager } from "@/components/admin/cycles/CyclesManager";

export const dynamic = "force-dynamic";

export default async function AdminCyclesPage() {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		redirect("/admin/login");
	}
	const adminClient = createAdminClient();

	const [cyclesRes, eventsRes, partnersRes, teamRes] = await Promise.all([
		adminClient
			.from("studpro_cycles")
			.select("*")
			.order("year", { ascending: false }),
		adminClient.from("events").select("cycle_id"),
		adminClient.from("cycle_partners").select("cycle_id"),
		adminClient.from("team_members").select("cycle_id"),
	]);

	const eventCounts: Record<string, number> = {};
	eventsRes.data?.forEach((e) => {
		if (e.cycle_id) eventCounts[e.cycle_id] = (eventCounts[e.cycle_id] || 0) + 1;
	});

	const partnerCounts: Record<string, number> = {};
	partnersRes.data?.forEach((p) => {
		if (p.cycle_id) partnerCounts[p.cycle_id] = (partnerCounts[p.cycle_id] || 0) + 1;
	});

	const teamCounts: Record<string, number> = {};
	teamRes.data?.forEach((t) => {
		if (t.cycle_id) teamCounts[t.cycle_id] = (teamCounts[t.cycle_id] || 0) + 1;
	});

	return (
		<CyclesManager
			cycles={cyclesRes.data || []}
			eventCounts={eventCounts}
			partnerCounts={partnerCounts}
			teamCounts={teamCounts}
		/>
	);
}
