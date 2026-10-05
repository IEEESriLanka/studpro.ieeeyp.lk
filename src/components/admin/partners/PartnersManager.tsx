"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Building2,
	Globe,
	Award,
	Link as LinkIcon,
	ExternalLink,
	Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyModal } from "./CompanyModal";
import { AssignPartnerModal } from "./AssignPartnerModal";
import { DeleteConfirmModal } from "@/components/admin/events/DeleteConfirmModal";
import {
	deleteCompany,
	updatePartnerTier,
	removeCyclePartner,
} from "@/app/actions/partners";

interface PartnersManagerProps {
	companies: any[];
	cyclePartners: any[];
	cycles: Array<{ id: string; version: string; year: number; is_active: boolean }>;
}

const TIERS = ["Platinum", "Gold", "Silver", "Bronze", "Partner"];

export function PartnersManager({
	companies,
	cyclePartners,
	cycles,
}: PartnersManagerProps) {
	const router = useRouter();

	const activeCycle = cycles.find((c) => c.is_active) || cycles[0];
	const [selectedCycleId, setSelectedCycleId] = useState<string>(
		activeCycle ? activeCycle.id : "all",
	);
	const [selectedTier, setSelectedTier] = useState<string>("all");
	const [search, setSearch] = useState("");

	// Modals
	const [companyModalOpen, setCompanyModalOpen] = useState(false);
	const [editingCompany, setEditingCompany] = useState<any | null>(null);
	const [assignModalOpen, setAssignModalOpen] = useState(false);
	const [deletingCompany, setDeletingCompany] = useState<any | null>(null);
	const [unlinkingPartner, setUnlinkingPartner] = useState<{
		cycleId: string;
		companyId: string;
		name: string;
	} | null>(null);

	// Get cycle partner mapping if a specific cycle is selected
	const cyclePartnerMap = new Map<string, string>(); // company_id -> tier
	if (selectedCycleId !== "all") {
		cyclePartners
			.filter((cp) => cp.cycle_id === selectedCycleId)
			.forEach((cp) => {
				cyclePartnerMap.set(cp.company_id, cp.tier);
			});
	}

	// Filter companies
	const filteredCompanies = companies.filter((comp) => {
		const matchSearch =
			search === "" ||
			comp.name.toLowerCase().includes(search.toLowerCase()) ||
			comp.id.toLowerCase().includes(search.toLowerCase());

		if (selectedCycleId !== "all") {
			const tier = cyclePartnerMap.get(comp.id);
			if (!tier) return false;
			if (selectedTier !== "all" && tier !== selectedTier) return false;
		}

		return matchSearch;
	});

	function handleOpenCreate() {
		setEditingCompany(null);
		setCompanyModalOpen(true);
	}

	function handleOpenEdit(comp: any) {
		setEditingCompany(comp);
		setCompanyModalOpen(true);
	}

	async function handleDeleteCompany() {
		if (!deletingCompany) return;
		await deleteCompany(deletingCompany.id);
		router.refresh();
	}

	async function handleUnlinkPartner() {
		if (!unlinkingPartner) return;
		await removeCyclePartner(
			unlinkingPartner.cycleId,
			unlinkingPartner.companyId,
		);
		router.refresh();
	}

	async function handleTierChange(
		cycleId: string,
		companyId: string,
		newTier: any,
	) {
		await updatePartnerTier(cycleId, companyId, newTier);
		router.refresh();
	}

	const selectedCycleObj = cycles.find((c) => c.id === selectedCycleId);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
						<Building2 className="w-7 h-7 text-amber-400" />
						Corporate Partner Management
					</h1>
					<p className="text-slate-400 text-sm mt-1">
						Manage corporate sponsors, master registry ({companies.length} companies), and annual cycle tier allocations.
					</p>
				</div>

				<div className="flex items-center gap-2.5 flex-wrap">
					<Button
						onClick={() => setAssignModalOpen(true)}
						variant="outline"
						className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
					>
						<Award className="w-4 h-4 text-amber-400" />
						<span>Assign to Cycle</span>
					</Button>

					<Button
						onClick={handleOpenCreate}
						className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer text-xs sm:text-sm"
					>
						<Plus className="w-4 h-4" />
						<span>Add Partner Company</span>
					</Button>
				</div>
			</div>

			{/* Filter & Toolbar */}
			<div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
				<div className="flex flex-col sm:flex-row items-center gap-3">
					{/* Search */}
					<div className="relative flex-1 w-full">
						<Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search companies by name or slug ID..."
							className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
						/>
					</div>

					{/* Cycle switcher */}
					<div className="w-full sm:w-60">
						<select
							value={selectedCycleId}
							onChange={(e) => setSelectedCycleId(e.target.value)}
							className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
						>
							<option value="all">Master Registry (All Companies)</option>
							{cycles.map((c) => (
								<option key={c.id} value={c.id}>
									{c.version} ({c.year}) {c.is_active ? "★ Active" : ""}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Tier filter tabs when viewing a specific cycle */}
				{selectedCycleId !== "all" && (
					<div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
						<span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">
							Filter Tier:
						</span>
						<button
							onClick={() => setSelectedTier("all")}
							className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
								selectedTier === "all"
									? "bg-amber-500 text-white shadow"
									: "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
							}`}
						>
							All Tiers
						</button>
						{TIERS.map((t) => (
							<button
								key={t}
								onClick={() => setSelectedTier(t)}
								className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
									selectedTier === t
										? "bg-amber-500 text-white shadow"
										: "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
								}`}
							>
								{t}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Status counter */}
			<div className="flex items-center justify-between text-xs text-slate-400 px-1">
				<span>
					Showing {filteredCompanies.length} companies{" "}
					{selectedCycleId !== "all" && selectedCycleObj && (
						<>
							in <strong className="text-white">{selectedCycleObj.version}</strong>
						</>
					)}
				</span>
			</div>

			{/* Companies Grid */}
			{filteredCompanies.length === 0 ? (
				<div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-500 text-sm">
					No companies found for the selected cycle or search criteria.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{filteredCompanies.map((comp) => {
						const tier = cyclePartnerMap.get(comp.id);

						return (
							<div
								key={comp.id}
								className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
							>
								{/* Top Section with Logo and Name */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<div className="w-14 h-14 rounded-xl bg-white p-2 flex items-center justify-center shadow-md shrink-0">
											<Image
												src={comp.logo_url}
												alt={comp.name}
												width={48}
												height={48}
												className="object-contain max-h-full max-w-full"
												unoptimized
											/>
										</div>

										{tier && (
											<span
												className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
													tier === "Platinum"
														? "bg-slate-200/10 text-slate-200 border-slate-300/40"
														: tier === "Gold"
															? "bg-amber-400/15 text-amber-300 border-amber-400/40"
															: tier === "Silver"
																? "bg-slate-300/10 text-slate-300 border-slate-400/40"
																: tier === "Bronze"
																	? "bg-amber-600/15 text-amber-500 border-amber-600/40"
																	: "bg-blue-500/10 text-blue-400 border-blue-500/30"
												}`}
											>
												{tier}
											</span>
										)}
									</div>

									<div>
										<h3 className="font-bold text-white text-base truncate group-hover:text-amber-400 transition-colors">
											{comp.name}
										</h3>
										<p className="text-xs text-slate-500 truncate">ID: {comp.id}</p>
									</div>

									{comp.web_link && (
										<a
											href={comp.web_link}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline truncate"
										>
											<Globe className="w-3 h-3" />
											<span className="truncate">{comp.web_link.replace(/^https?:\/\//, "")}</span>
											<ExternalLink className="w-2.5 h-2.5 shrink-0" />
										</a>
									)}
								</div>

								{/* Bottom Actions */}
								<div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
									{/* Quick tier changer if in cycle view */}
									{selectedCycleId !== "all" && tier && (
										<select
											value={tier}
											onChange={(e) =>
												handleTierChange(
													selectedCycleId,
													comp.id,
													e.target.value,
												)
											}
											className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 outline-none focus:border-amber-500"
										>
											{TIERS.map((t) => (
												<option key={t} value={t}>
													{t}
												</option>
											))}
										</select>
									)}

									<div className="flex items-center gap-1.5 ml-auto">
										{/* Unlink button if in cycle view */}
										{selectedCycleId !== "all" && tier ? (
											<button
												onClick={() =>
													setUnlinkingPartner({
														cycleId: selectedCycleId,
														companyId: comp.id,
														name: comp.name,
													})
												}
												title="Unlink from cycle"
												className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
											>
												<Unlink className="w-4 h-4" />
											</button>
										) : null}

										<button
											onClick={() => handleOpenEdit(comp)}
											title="Edit Company"
											className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
										>
											<Edit className="w-4 h-4" />
										</button>

										<button
											onClick={() => setDeletingCompany(comp)}
											title="Delete Company"
											className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Create / Edit Company Modal */}
			<CompanyModal
				isOpen={companyModalOpen}
				onClose={() => setCompanyModalOpen(false)}
				company={editingCompany}
				onSuccess={() => router.refresh()}
			/>

			{/* Assign Partner to Cycle Modal */}
			<AssignPartnerModal
				isOpen={assignModalOpen}
				onClose={() => setAssignModalOpen(false)}
				companies={companies}
				cycles={cycles}
				defaultCycleId={selectedCycleId !== "all" ? selectedCycleId : undefined}
				onSuccess={() => router.refresh()}
			/>

			{/* Master Company Deletion Modal */}
			<DeleteConfirmModal
				isOpen={!!deletingCompany}
				title={deletingCompany?.name || ""}
				message="Deleting this company will remove it from the master registry and unlink all associated annual cycle partner records."
				onClose={() => setDeletingCompany(null)}
				onConfirm={handleDeleteCompany}
			/>

			{/* Unlink Cycle Partner Modal */}
			<DeleteConfirmModal
				isOpen={!!unlinkingPartner}
				title={unlinkingPartner?.name || ""}
				message={`Unlink ${unlinkingPartner?.name} from this StudPro cycle? The company will remain in the master registry.`}
				onClose={() => setUnlinkingPartner(null)}
				onConfirm={handleUnlinkPartner}
			/>
		</div>
	);
}
