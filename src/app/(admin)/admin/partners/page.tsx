import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { PartnersManager } from "@/components/admin/partners/PartnersManager";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		redirect("/admin/login");
	}
	const adminClient = createAdminClient();

	const [companiesRes, cyclePartnersRes, cyclesRes] = await Promise.all([
		adminClient
			.from("companies")
			.select("*")
			.order("name", { ascending: true }),
		adminClient.from("cycle_partners").select("*").order("display_order", { ascending: true }),
		adminClient
			.from("studpro_cycles")
			.select("id, version, year, is_active")
			.order("year", { ascending: false }),
	]);

	return (
		<PartnersManager
			companies={companiesRes.data || []}
			cyclePartners={cyclePartnersRes.data || []}
			cycles={cyclesRes.data || []}
		/>
	);
}
