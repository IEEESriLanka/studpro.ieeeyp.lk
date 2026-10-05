import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { AuditLogsManager } from "@/components/admin/logs/AuditLogsManager";
import { Activity, Shield } from "lucide-react";
import type { StoredAuditLog } from "@/lib/logger";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Security & Audit Logs | StudPro Admin",
};

export default async function AdminLogsPage() {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		redirect("/admin/login");
	}

	const adminClient = createAdminClient();

	// Query up to 200 most recent audit logs
	const { data, error } = await adminClient
		.from("audit_logs")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(200);

	if (error) {
		console.error("Failed to query audit_logs for admin panel:", error.message);
	}

	const logs: StoredAuditLog[] = (data || []).map((row) => ({
		id: row.id,
		actor_id: row.actor_id,
		actor_email: row.actor_email,
		actor_role: row.actor_role,
		action: row.action,
		category: row.category as any,
		severity: row.severity as any,
		details: (row.details as any) || {},
		ip_address: row.ip_address,
		created_at: row.created_at,
	}));

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
						<Shield className="w-3.5 h-3.5" />
						Enterprise Security & Compliance
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
						<Activity className="w-7 h-7 text-blue-500" />
						Security & Audit Logs
					</h1>
					<p className="text-sm text-slate-400 mt-1">
						Real-time audit trailing, brute-force monitoring, and administrative mutation logs.
					</p>
				</div>
			</div>

			{/* Main Manager */}
			<AuditLogsManager initialLogs={logs} />
		</div>
	);
}
