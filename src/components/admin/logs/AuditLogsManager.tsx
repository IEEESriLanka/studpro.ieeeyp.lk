"use client";

import { useState, useMemo } from "react";
import {
	ShieldAlert,
	ShieldCheck,
	AlertTriangle,
	Info,
	Search,
	Download,
	Calendar,
	User,
	Terminal,
	RefreshCw,
	X,
	Copy,
	Check,
	Globe,
	Laptop,
} from "lucide-react";
import type { StoredAuditLog, LogCategory, LogSeverity } from "@/lib/logger";

interface AuditLogsManagerProps {
	initialLogs: StoredAuditLog[];
}

export function AuditLogsManager({ initialLogs }: AuditLogsManagerProps) {
	const [logs, setLogs] = useState<StoredAuditLog[]>(initialLogs);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
	const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
	const [selectedLog, setSelectedLog] = useState<StoredAuditLog | null>(null);
	const [copied, setCopied] = useState(false);

	// Filtered logs
	const filteredLogs = useMemo(() => {
		return logs.filter((log) => {
			const matchesCategory =
				selectedCategory === "ALL" || log.category === selectedCategory;
			const matchesSeverity =
				selectedSeverity === "ALL" || log.severity === selectedSeverity;

			const q = searchQuery.toLowerCase();
			const matchesSearch =
				!q ||
				log.action.toLowerCase().includes(q) ||
				(log.actor_email && log.actor_email.toLowerCase().includes(q)) ||
				(log.ip_address && log.ip_address.toLowerCase().includes(q)) ||
				JSON.stringify(log.details).toLowerCase().includes(q);

			return matchesCategory && matchesSeverity && matchesSearch;
		});
	}, [logs, searchQuery, selectedCategory, selectedSeverity]);

	// Security KPIs
	const kpis = useMemo(() => {
		const total = logs.length;
		const authCount = logs.filter((l) => l.category === "AUTH").length;
		const securityAlerts = logs.filter(
			(l) => l.severity === "WARN" || l.severity === "CRITICAL",
		).length;
		const mutations = logs.filter((l) => l.category === "DATA_MUTATION").length;
		return { total, authCount, securityAlerts, mutations };
	}, [logs]);

	function handleCopyDetails(details: any) {
		navigator.clipboard.writeText(JSON.stringify(details, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	function handleExportCSV() {
		const headers = [
			"ID",
			"Timestamp",
			"Severity",
			"Category",
			"Action",
			"Actor Email",
			"Actor Role",
			"IP Address",
			"Details",
		];

		const rows = filteredLogs.map((l) => [
			l.id,
			l.created_at,
			l.severity,
			l.category,
			`"${l.action}"`,
			`"${l.actor_email || "anonymous"}"`,
			`"${l.actor_role || "none"}"`,
			`"${l.ip_address || "unknown"}"`,
			`"${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`,
		]);

		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute(
			"download",
			`studpro_audit_logs_${new Date().toISOString().split("T")[0]}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	return (
		<div className="space-y-6">
			{/* KPI Summary Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-xs font-medium uppercase tracking-wider">Total Events</span>
						<Terminal className="w-4 h-4 text-blue-400" />
					</div>
					<div className="text-2xl font-bold text-white">{kpis.total}</div>
					<p className="text-xs text-slate-400 mt-1">Recorded audit entries</p>
				</div>

				<div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-xs font-medium uppercase tracking-wider">Security Alerts</span>
						<ShieldAlert className="w-4 h-4 text-amber-400" />
					</div>
					<div className="text-2xl font-bold text-amber-400">{kpis.securityAlerts}</div>
					<p className="text-xs text-slate-400 mt-1">Warnings & lockouts</p>
				</div>

				<div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-xs font-medium uppercase tracking-wider">Auth Events</span>
						<ShieldCheck className="w-4 h-4 text-emerald-400" />
					</div>
					<div className="text-2xl font-bold text-white">{kpis.authCount}</div>
					<p className="text-xs text-slate-400 mt-1">Logins and session events</p>
				</div>

				<div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-xs font-medium uppercase tracking-wider">Data Mutations</span>
						<Info className="w-4 h-4 text-purple-400" />
					</div>
					<div className="text-2xl font-bold text-white">{kpis.mutations}</div>
					<p className="text-xs text-slate-400 mt-1">Admin CRUD operations</p>
				</div>
			</div>

			{/* Search & Filter Toolbar */}
			<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
				<div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
					{/* Search input */}
					<div className="relative flex-1">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search by action, email, IP, or details..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
						/>
					</div>

					{/* Severity dropdown & CSV Export */}
					<div className="flex items-center gap-2">
						<select
							value={selectedSeverity}
							onChange={(e) => setSelectedSeverity(e.target.value)}
							className="px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-blue-500"
						>
							<option value="ALL">All Severities</option>
							<option value="INFO">INFO only</option>
							<option value="WARN">WARN only</option>
							<option value="CRITICAL">CRITICAL only</option>
						</select>

						<button
							onClick={handleExportCSV}
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors border border-slate-700 cursor-pointer"
						>
							<Download className="w-4 h-4 text-blue-400" />
							Export CSV
						</button>
					</div>
				</div>

				{/* Category Pill Filters */}
				<div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/60">
					{["ALL", "AUTH", "SECURITY", "DATA_MUTATION", "SYSTEM"].map((cat) => (
						<button
							key={cat}
							onClick={() => setSelectedCategory(cat)}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
								selectedCategory === cat
									? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
									: "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
							}`}
						>
							{cat === "ALL" ? "All Categories" : cat.replace("_", " ")}
						</button>
					))}
					<span className="ml-auto text-xs text-slate-400 flex items-center">
						Showing {filteredLogs.length} of {logs.length} logs
					</span>
				</div>
			</div>

			{/* Logs Table */}
			<div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs sm:text-sm text-slate-300">
						<thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
							<tr>
								<th className="py-3.5 px-4 font-semibold">Severity</th>
								<th className="py-3.5 px-4 font-semibold">Action</th>
								<th className="py-3.5 px-4 font-semibold">Category</th>
								<th className="py-3.5 px-4 font-semibold">Actor</th>
								<th className="py-3.5 px-4 font-semibold">Client IP</th>
								<th className="py-3.5 px-4 font-semibold">Timestamp</th>
								<th className="py-3.5 px-4 font-semibold text-right">Details</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60 font-mono text-xs">
							{filteredLogs.length === 0 ? (
								<tr>
									<td colSpan={7} className="py-12 text-center text-slate-500 font-sans">
										No audit logs matching current filter criteria.
									</td>
								</tr>
							) : (
								filteredLogs.map((log) => {
									const isCritical = log.severity === "CRITICAL";
									const isWarn = log.severity === "WARN";

									return (
										<tr
											key={log.id}
											className="hover:bg-slate-800/40 transition-colors"
										>
											<td className="py-3 px-4 whitespace-nowrap">
												<span
													className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
														isCritical
															? "bg-red-950/80 border border-red-800 text-red-400"
															: isWarn
																? "bg-amber-950/80 border border-amber-800 text-amber-400"
																: "bg-blue-950/60 border border-blue-850 text-blue-400"
													}`}
												>
													{isCritical ? (
														<AlertTriangle className="w-3 h-3 text-red-400" />
													) : isWarn ? (
														<AlertTriangle className="w-3 h-3 text-amber-400" />
													) : (
														<Info className="w-3 h-3 text-blue-400" />
													)}
													{log.severity}
												</span>
											</td>
											<td className="py-3 px-4 font-medium text-white whitespace-nowrap">
												{log.action}
											</td>
											<td className="py-3 px-4 whitespace-nowrap">
												<span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-sans">
													{log.category}
												</span>
											</td>
											<td className="py-3 px-4 whitespace-nowrap font-sans text-slate-300">
												{log.actor_email ? (
													<span title={log.actor_role || "admin"}>
														{log.actor_email}
													</span>
												) : (
													<span className="text-slate-500 italic">anonymous</span>
												)}
											</td>
											<td className="py-3 px-4 whitespace-nowrap text-slate-400">
												{log.ip_address || "unknown"}
											</td>
											<td className="py-3 px-4 whitespace-nowrap text-slate-400 font-sans">
												{new Date(log.created_at).toLocaleString("en-US", {
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												})}
											</td>
											<td className="py-3 px-4 text-right whitespace-nowrap">
												<button
													onClick={() => setSelectedLog(log)}
													className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-sans transition-colors cursor-pointer"
												>
													Inspect
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Detail Inspection Modal */}
			{selectedLog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
					<div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
						{/* Header */}
						<div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
							<div className="flex items-center gap-2.5">
								<Terminal className="w-5 h-5 text-blue-400" />
								<div>
									<h3 className="text-base font-bold text-white font-mono">
										{selectedLog.action}
									</h3>
									<p className="text-xs text-slate-400 font-sans">
										Audit Event ID: {selectedLog.id}
									</p>
								</div>
							</div>
							<button
								onClick={() => setSelectedLog(null)}
								className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Body */}
						<div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
							{/* Quick meta grid */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 text-xs">
								<div>
									<span className="text-slate-500 block">Severity</span>
									<span className="font-semibold text-white font-mono">
										{selectedLog.severity}
									</span>
								</div>
								<div>
									<span className="text-slate-500 block">Category</span>
									<span className="font-semibold text-white font-mono">
										{selectedLog.category}
									</span>
								</div>
								<div>
									<span className="text-slate-500 block">Client IP</span>
									<span className="font-semibold text-white font-mono">
										{selectedLog.ip_address || "unknown"}
									</span>
								</div>
								<div>
									<span className="text-slate-500 block">Timestamp</span>
									<span className="font-semibold text-white font-mono">
										{new Date(selectedLog.created_at).toLocaleTimeString()}
									</span>
								</div>
							</div>

							{/* Actor Details */}
							<div className="space-y-1.5 text-xs">
								<span className="text-slate-400 font-semibold uppercase tracking-wider block">
									Actor Identity
								</span>
								<div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-slate-300 space-y-1 font-sans">
									<div className="flex justify-between">
										<span className="text-slate-500">Email:</span>
										<span className="font-medium text-white">
											{selectedLog.actor_email || "anonymous"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Role:</span>
										<span className="font-medium text-slate-300">
											{selectedLog.actor_role || "unauthenticated"}
										</span>
									</div>
									{selectedLog.actor_id && (
										<div className="flex justify-between">
											<span className="text-slate-500">User ID:</span>
											<span className="font-mono text-slate-400 text-[11px]">
												{selectedLog.actor_id}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Payload JSON */}
							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
										Event Payload Details
									</span>
									<button
										onClick={() => handleCopyDetails(selectedLog.details)}
										className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
									>
										{copied ? (
											<>
												<Check className="w-3.5 h-3.5 text-emerald-400" />
												<span className="text-emerald-400">Copied!</span>
											</>
										) : (
											<>
												<Copy className="w-3.5 h-3.5" />
												<span>Copy JSON</span>
											</>
										)}
									</button>
								</div>
								<pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
									{JSON.stringify(selectedLog.details, null, 2)}
								</pre>
							</div>
						</div>

						{/* Footer */}
						<div className="px-6 py-3.5 border-t border-slate-800 flex justify-end bg-slate-950/60">
							<button
								onClick={() => setSelectedLog(null)}
								className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
