import Link from "next/link";
import {
	Calendar,
	Building2,
	Users,
	Layers,
	Plus,
	ArrowUpRight,
	Sparkles,
	Clock,
	MapPin,
	ShieldCheck,
	CheckCircle2,
	TrendingUp,
	Activity,
	ShieldAlert,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { getRecentAuditLogs, type StoredAuditLog } from "@/lib/logger";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		redirect("/admin/login");
	}
	const adminClient = createAdminClient();

	// 1. Fetch KPI metrics and recent records in parallel
	let eventsCount = 0;
	let partnersCount = 0;
	let teamCount = 0;
	let cyclesCount = 0;
	let recentEvents: any[] = [];
	let activeCycle: any = null;
	const partnerTiers: Record<string, number> = {
		Platinum: 0,
		Gold: 0,
		Silver: 0,
		Bronze: 0,
		Partner: 0,
	};
	const categoryBreakdown: Record<string, number> = {};
	let recentLogs: StoredAuditLog[] = [];

	try {
		const [
			evCountRes,
			compCountRes,
			teamCountRes,
			cycleCountRes,
			recentEvRes,
			activeCycleRes,
			cyclePartnersRes,
			allEventsCategoryRes,
			auditLogsData,
		] = await Promise.all([
			adminClient.from("events").select("*", { count: "exact", head: true }),
			adminClient.from("companies").select("*", { count: "exact", head: true }),
			adminClient.from("team_members").select("*", { count: "exact", head: true }),
			adminClient.from("studpro_cycles").select("*", { count: "exact", head: true }),
			adminClient
				.from("events")
				.select("id, title, category, event_date, venue, speakers(name, company)")
				.order("event_date", { ascending: false })
				.limit(6),
			adminClient
				.from("studpro_cycles")
				.select("*")
				.eq("is_active", true)
				.single(),
			adminClient.from("cycle_partners").select("tier"),
			adminClient.from("events").select("category"),
			getRecentAuditLogs(6),
		]);

		eventsCount = evCountRes.count ?? 0;
		partnersCount = compCountRes.count ?? 0;
		teamCount = teamCountRes.count ?? 0;
		cyclesCount = cycleCountRes.count ?? 0;
		recentEvents = recentEvRes.data || [];
		activeCycle = activeCycleRes.data || null;
		recentLogs = auditLogsData || [];

		// Calculate partner tiers count
		if (cyclePartnersRes.data) {
			cyclePartnersRes.data.forEach((p) => {
				if (p.tier && partnerTiers[p.tier] !== undefined) {
					partnerTiers[p.tier]++;
				}
			});
		}

		// Calculate category breakdown
		if (allEventsCategoryRes.data) {
			allEventsCategoryRes.data.forEach((e) => {
				categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + 1;
			});
		}
	} catch (e) {
		console.error("Error loading dashboard data:", e);
	}

	const userName = adminSession?.profile?.full_name || "Admin";

	return (
		<div className="space-y-8">
			{/* Welcome Hero Banner */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
				{/* Glowing background accents */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-[#EE7929]/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#065E86]/20 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="space-y-2">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EE7929]/15 text-[#EE7929] border border-[#EE7929]/30">
							<Sparkles className="w-3.5 h-3.5" />
							IEEE Young Professionals Sri Lanka
						</div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
							Welcome back, {userName}!
						</h1>
						<p className="text-slate-400 text-sm max-w-xl">
							Manage the StudPro ecosystem, schedule upcoming sessions, update corporate partners, and maintain executive rosters.
						</p>
					</div>

					{/* Quick Active Cycle badge */}
					<div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-sm flex items-center gap-4 shrink-0 shadow-lg">
						<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#065E86] to-[#EE7929] flex items-center justify-center text-white shadow-md">
							<Layers className="w-6 h-6" />
						</div>
						<div>
							<div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
								Active Cycle
							</div>
							<div className="text-base font-bold text-white">
								{activeCycle?.version || "StudPro 6.0"}
							</div>
							<div className="text-xs text-slate-400">
								Year: {activeCycle?.year || "Current"}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* KPI Statistics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
				{/* Total Events Card */}
				<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Total Events
						</span>
						<div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
							<Calendar className="w-4 h-4" />
						</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-white">{eventsCount}</div>
						<p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
							<TrendingUp className="w-3.5 h-3.5 text-blue-400" />
							Across {cyclesCount} annual cycles
						</p>
					</div>
					<Link
						href="/admin/events"
						className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
					>
						Manage Events <ArrowUpRight className="w-3.5 h-3.5" />
					</Link>
				</div>

				{/* Partner Companies Card */}
				<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Partner Companies
						</span>
						<div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
							<Building2 className="w-4 h-4" />
						</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-white">{partnersCount}</div>
						<p className="text-xs text-slate-400 mt-1">
							{partnerTiers.Platinum} Platinum &bull; {partnerTiers.Gold} Gold partners
						</p>
					</div>
					<Link
						href="/admin/partners"
						className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
					>
						Manage Partners <ArrowUpRight className="w-3.5 h-3.5" />
					</Link>
				</div>

				{/* Team Members Card */}
				<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Team Members
						</span>
						<div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
							<Users className="w-4 h-4" />
						</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-white">{teamCount}</div>
						<p className="text-xs text-slate-400 mt-1">
							Executive & Organizing Committee
						</p>
					</div>
					<Link
						href="/admin/team"
						className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
					>
						Manage Directory <ArrowUpRight className="w-3.5 h-3.5" />
					</Link>
				</div>

				{/* Annual Cycles Card */}
				<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Annual Cycles
						</span>
						<div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
							<Layers className="w-4 h-4" />
						</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-white">{cyclesCount}</div>
						<p className="text-xs text-slate-400 mt-1">
							StudPro 5.0 through 9.0
						</p>
					</div>
					<Link
						href="/admin/cycles"
						className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
					>
						Manage Cycles <ArrowUpRight className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>

			{/* Quick Action Shortcuts */}
			<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
				<div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
					Quick Actions
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
					<Link
						href="/admin/events"
						className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#EE7929]/50 hover:bg-slate-800/80 transition-all group"
					>
						<div className="w-8 h-8 rounded-lg bg-[#EE7929]/10 text-[#EE7929] flex items-center justify-center group-hover:scale-105 transition-transform">
							<Plus className="w-4 h-4" />
						</div>
						<span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
							New Event
						</span>
					</Link>

					<Link
						href="/admin/partners"
						className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all group"
					>
						<div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
							<Plus className="w-4 h-4" />
						</div>
						<span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
							Add Partner
						</span>
					</Link>

					<Link
						href="/admin/team"
						className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all group"
					>
						<div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
							<Plus className="w-4 h-4" />
						</div>
						<span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
							Add Member
						</span>
					</Link>

					<Link
						href="/admin/cycles"
						className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all group"
					>
						<div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
							<Plus className="w-4 h-4" />
						</div>
						<span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
							New Cycle
						</span>
					</Link>
				</div>
			</div>

			{/* Main Overview Split: Recent Events & Category Distribution */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Events Table (2 Cols) */}
				<div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-base font-bold text-white">Recent Events</h3>
							<p className="text-xs text-slate-400">Latest scheduled sessions and workshops</p>
						</div>
						<Link
							href="/admin/events"
							className="text-xs text-[#EE7929] hover:underline font-medium"
						>
							View All ({eventsCount})
						</Link>
					</div>

					<div className="divide-y divide-slate-800/60 overflow-hidden">
						{recentEvents.length === 0 ? (
							<div className="py-8 text-center text-slate-500 text-sm">
								No events found.
							</div>
						) : (
							recentEvents.map((ev) => (
								<div
									key={ev.id}
									className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 -mx-3 px-3 rounded-xl transition-colors"
								>
									<div className="space-y-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 capitalize border border-slate-700/50">
												{ev.category.replace(/-/g, " ")}
											</span>
											<h4 className="text-sm font-semibold text-white truncate">
												{ev.title}
											</h4>
										</div>
										<div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
											<span className="flex items-center gap-1">
												<Clock className="w-3 h-3 text-slate-500" />
												{ev.event_date}
											</span>
											{ev.venue && (
												<span className="flex items-center gap-1">
													<MapPin className="w-3 h-3 text-slate-500" />
													{ev.venue}
												</span>
											)}
										</div>
									</div>

									<Link
										href="/admin/events"
										className="self-start sm:self-center px-3 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-colors shrink-0"
									>
										Manage
									</Link>
								</div>
							))
						)}
					</div>
				</div>

				{/* Event Categories & Partner Tier Breakdown (1 Col) */}
				<div className="space-y-6">
					{/* Category Breakdown Card */}
					<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
						<h3 className="text-base font-bold text-white">Event Tracks</h3>
						<div className="space-y-2.5">
							{Object.entries(categoryBreakdown).map(([cat, count]) => {
								const percentage = eventsCount > 0 ? Math.round((count / eventsCount) * 100) : 0;
								return (
									<div key={cat} className="space-y-1">
										<div className="flex justify-between text-xs font-medium">
											<span className="text-slate-300 capitalize">
												{cat.replace(/-/g, " ")}
											</span>
											<span className="text-slate-400">
												{count} ({percentage}%)
											</span>
										</div>
										<div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-[#065E86] to-[#EE7929] rounded-full"
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Security & System Info */}
					<div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
							<ShieldCheck className="w-4 h-4 text-emerald-400" />
							System Health
						</div>
						<div className="space-y-2 text-xs text-slate-300">
							<div className="flex items-center justify-between">
								<span className="text-slate-400">Database</span>
								<span className="text-emerald-400 flex items-center gap-1 font-medium">
									<CheckCircle2 className="w-3.5 h-3.5" /> Supabase PostgreSQL
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-400">Security</span>
								<span className="text-slate-200">Next.js Edge Proxy RBAC</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-400">Role</span>
								<span className="text-[#EE7929] capitalize font-medium">
									{adminSession?.profile?.role.replace("_", " ")}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Security Monitoring & Audit Logs Section */}
			<div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
							<Activity className="w-4 h-4" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="text-base font-bold text-white">Security & Audit Activity Stream</h3>
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
									Live Monitoring
								</span>
							</div>
							<p className="text-xs text-slate-400">
								Immutable activity trail of administrative actions, authentication, and system events
							</p>
						</div>
					</div>
				</div>

				<div className="divide-y divide-slate-800/60 overflow-hidden">
					{recentLogs.length === 0 ? (
						<div className="py-8 text-center text-slate-500 text-sm">
							No audit events recorded yet. Actions by authorized administrators will appear here in real-time.
						</div>
					) : (
						recentLogs.map((log) => {
							const isCritical = log.severity === "CRITICAL";
							const isWarn = log.severity === "WARN";
							const badgeStyle = isCritical
								? "bg-red-500/10 text-red-400 border-red-500/30"
								: isWarn
								? "bg-amber-500/10 text-amber-400 border-amber-500/30"
								: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

							return (
								<div
									key={log.id}
									className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20 -mx-3 px-3 rounded-xl transition-colors text-xs"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${badgeStyle}`}
										>
											{log.severity}
										</span>
										<span className="font-mono text-xs text-white font-medium">
											{log.action}
										</span>
										<span className="text-slate-400 truncate hidden md:inline">
											{log.actor_email ? `by ${log.actor_email}` : "system"}
										</span>
									</div>

									<div className="flex items-center gap-3 text-slate-400 shrink-0 self-start sm:self-center">
										<span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
											{log.category}
										</span>
										<span className="text-[11px] text-slate-500">
											{new Date(log.created_at).toLocaleString()}
										</span>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
