"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Plus,
	Calendar,
	Sparkles,
	CheckCircle,
	Edit,
	Trash2,
	Clock,
	Layers,
	Users,
	Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CycleModal } from "./CycleModal";
import { DeleteConfirmModal } from "@/components/admin/events/DeleteConfirmModal";
import { setActiveCycle, deleteCycle } from "@/app/actions/cycles";

interface CyclesManagerProps {
	cycles: any[];
	eventCounts: Record<string, number>;
	partnerCounts: Record<string, number>;
	teamCounts: Record<string, number>;
}

export function CyclesManager({
	cycles,
	eventCounts,
	partnerCounts,
	teamCounts,
}: CyclesManagerProps) {
	const router = useRouter();

	const [modalOpen, setModalOpen] = useState(false);
	const [editingCycle, setEditingCycle] = useState<any | null>(null);
	const [deletingCycle, setDeletingCycle] = useState<any | null>(null);
	const [settingActiveId, setSettingActiveId] = useState<string | null>(null);

	function handleOpenCreate() {
		setEditingCycle(null);
		setModalOpen(true);
	}

	function handleOpenEdit(cycle: any) {
		setEditingCycle(cycle);
		setModalOpen(true);
	}

	async function handleSetActive(cycleId: string) {
		setSettingActiveId(cycleId);
		await setActiveCycle(cycleId);
		setSettingActiveId(null);
		router.refresh();
	}

	async function handleDelete() {
		if (!deletingCycle) return;
		await deleteCycle(deletingCycle.id);
		router.refresh();
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
						<Layers className="w-7 h-7 text-blue-400" />
						Annual Cycles & Archives
					</h1>
					<p className="text-slate-400 text-sm mt-1">
						Manage annual StudPro editions, active cycles, and historical archive data.
					</p>
				</div>

				<Button
					onClick={handleOpenCreate}
					className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer self-start sm:self-auto"
				>
					<Plus className="w-4 h-4" />
					<span>New Edition</span>
				</Button>
			</div>

			{/* Cycles Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{cycles.map((cycle) => {
					const eventsCount = eventCounts[cycle.id] || 0;
					const partnersCount = partnerCounts[cycle.id] || 0;
					const membersCount = teamCounts[cycle.id] || 0;

					return (
						<div
							key={cycle.id}
							className={`p-6 rounded-3xl border transition-all shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden ${
								cycle.is_active
									? "bg-slate-900 border-blue-500/60 ring-2 ring-blue-500/20 shadow-blue-500/10"
									: "bg-slate-900/70 border-slate-800 hover:border-slate-700"
							}`}
						>
							{/* Accent glow for active edition */}
							{cycle.is_active && (
								<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
							)}

							<div className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<h3 className="text-xl font-extrabold text-white">
												{cycle.version}
											</h3>
											{cycle.is_active && (
												<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
													<Sparkles className="w-3 h-3 text-blue-400" />
													Active
												</span>
											)}
										</div>
										<span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
											Year {cycle.year}
										</span>
									</div>

									<div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-inner">
										<Calendar className="w-5 h-5" />
									</div>
								</div>

								<p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
									{cycle.description || "No description provided for this edition."}
								</p>

								{/* Metrics for this edition */}
								<div className="grid grid-cols-3 gap-2 pt-2">
									<div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
										<span className="block text-sm font-bold text-white">
											{eventsCount}
										</span>
										<span className="block text-[10px] text-slate-500 uppercase font-medium">
											Events
										</span>
									</div>

									<div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
										<span className="block text-sm font-bold text-white">
											{partnersCount}
										</span>
										<span className="block text-[10px] text-slate-500 uppercase font-medium">
											Partners
										</span>
									</div>

									<div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
										<span className="block text-sm font-bold text-white">
											{membersCount}
										</span>
										<span className="block text-[10px] text-slate-500 uppercase font-medium">
											Team
										</span>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
								{cycle.is_active ? (
									<span className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
										<CheckCircle className="w-4 h-4 text-blue-400" />
										Platform Default
									</span>
								) : (
									<button
										onClick={() => handleSetActive(cycle.id)}
										disabled={settingActiveId === cycle.id}
										className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
									>
										{settingActiveId === cycle.id ? "Activating..." : "Set as Active"}
									</button>
								)}

								<div className="flex items-center gap-1">
									<button
										onClick={() => handleOpenEdit(cycle)}
										title="Edit Cycle"
										className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
									>
										<Edit className="w-4 h-4" />
									</button>

									{!cycle.is_active && (
										<button
											onClick={() => setDeletingCycle(cycle)}
											title="Delete Cycle"
											className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Create/Edit Modal */}
			<CycleModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				cycle={editingCycle}
				onSuccess={() => router.refresh()}
			/>

			{/* Deletion Modal */}
			<DeleteConfirmModal
				isOpen={!!deletingCycle}
				title={deletingCycle?.version || ""}
				message="Are you sure you want to delete this historical edition? It cannot be undone."
				onClose={() => setDeletingCycle(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
