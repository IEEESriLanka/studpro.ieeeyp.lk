import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { TeamManager } from "@/components/admin/team/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		redirect("/admin/login");
	}
	const adminClient = createAdminClient();

	const [teamRes, cyclesRes] = await Promise.all([
		adminClient
			.from("team_members")
			.select("*")
			.order("display_order", { ascending: true }),
		adminClient
			.from("studpro_cycles")
			.select("id, version, year, is_active")
			.order("year", { ascending: false }),
	]);

	return (
		<TeamManager
			teamMembers={teamRes.data || []}
			cycles={cyclesRes.data || []}
		/>
	);
}
