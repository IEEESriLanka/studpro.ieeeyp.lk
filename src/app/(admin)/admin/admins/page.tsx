import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/app/actions/auth";
import { AdminsManager } from "@/components/admin/admins/AdminsManager";

export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
	const currentAdmin = await getCurrentAdmin();
	if (!currentAdmin) {
		redirect("/admin/login");
	}
	const adminClient = createAdminClient();

	const [profilesRes, usersRes] = await Promise.all([
		adminClient
			.from("admin_profiles")
			.select("*")
			.order("created_at", { ascending: false }),
		adminClient.auth.admin.listUsers(),
	]);

	const emailMap = new Map<string, string>();
	usersRes.data?.users?.forEach((u) => {
		if (u.email) emailMap.set(u.id, u.email);
	});

	const adminsList = (profilesRes.data || []).map((p) => ({
		...p,
		email: emailMap.get(p.id) || "N/A",
	}));

	return (
		<AdminsManager
			admins={adminsList}
			currentAdminId={currentAdmin?.user?.id || ""}
			isSuperAdmin={currentAdmin?.profile?.role === "super_admin"}
		/>
	);
}
