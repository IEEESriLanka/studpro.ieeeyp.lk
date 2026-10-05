"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	User,
	Mail,
	Phone,
	Linkedin,
	ExternalLink,
	Sparkles,
	Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMemberModal } from "./TeamMemberModal";
import { DeleteConfirmModal } from "@/components/admin/events/DeleteConfirmModal";
import { deleteTeamMember } from "@/app/actions/team";
import {
	getRoleCategory,
	isContactLeadershipRole,
} from "@/lib/constants/team-roles";

interface TeamManagerProps {
	teamMembers: any[];
	cycles: Array<{ id: string; version: string; year: number; is_active: boolean }>;
}

const ROLE_CATEGORIES = [
	"ALL",
	"Executive Board",
	"Advisors & Reps",
	"Pillar Leads",
	"Committee",
	"Other",
];

export function TeamManager({ teamMembers, cycles }: TeamManagerProps) {
	const router = useRouter();

	const activeCycle = cycles.find((c) => c.is_active) || cycles[0];
	const [selectedCycleId, setSelectedCycleId] = useState<string>(
		activeCycle ? activeCycle.id : "all",
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
	const [search, setSearch] = useState("");

	// Modals
	const [modalOpen, setModalOpen] = useState(false);
	const [editingMember, setEditingMember] = useState<any | null>(null);
	const [deletingMember, setDeletingMember] = useState<any | null>(null);

	// Cycle lookup map
	const cycleMap = new Map<string, string>();
	cycles.forEach((c) => cycleMap.set(c.id, c.version));

	// Filter team members
	const filteredMembers = teamMembers.filter((m) => {
		const matchSearch =
			search === "" ||
			m.name.toLowerCase().includes(search.toLowerCase()) ||
			m.role.toLowerCase().includes(search.toLowerCase()) ||
			(m.email && m.email.toLowerCase().includes(search.toLowerCase())) ||
			(m.contact_no && m.contact_no.includes(search));

		const matchCycle =
			selectedCycleId === "all" || m.cycle_id === selectedCycleId;

		const memberCategory = getRoleCategory(m.role);
		const matchCategory =
			selectedCategory === "ALL" || memberCategory === selectedCategory;

		return matchSearch && matchCycle && matchCategory;
	});

	function handleOpenCreate() {
		setEditingMember(null);
		setModalOpen(true);
	}

	function handleOpenEdit(member: any) {
		setEditingMember(member);
		setModalOpen(true);
	}

	async function handleDelete() {
		if (!deletingMember) return;
		await deleteTeamMember(deletingMember.id);
		router.refresh();
	}

	const selectedCycleObj = cycles.find((c) => c.id === selectedCycleId);

	return (
		<div className="space-y-6">
			{/* Top Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
						<User className="w-7 h-7 text-purple-400" />
						Executive Team & Organizing Committee
					</h1>
					<p className="text-slate-400 text-sm mt-1">
						Manage IEEE Young Professionals StudPro leadership, committee leads, and member directories.
					</p>
				</div>

				<Button
					onClick={handleOpenCreate}
					className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer self-start sm:self-auto"
				>
					<Plus className="w-4 h-4" />
					<span>Add Team Member</span>
				</Button>
			</div>

			{/* Filter & Search Toolbar */}
			<div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
				<div className="flex flex-col sm:flex-row items-center gap-3">
					{/* Search bar */}
					<div className="relative flex-1 w-full">
						<Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search members by name, role, email, or contact number..."
							className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
						/>
					</div>

					{/* Cycle Filter */}
					<div className="w-full sm:w-64">
						<select
							value={selectedCycleId}
							onChange={(e) => setSelectedCycleId(e.target.value)}
							className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
						>
							<option value="all">All Annual Cycles</option>
							{cycles.map((c) => (
								<option key={c.id} value={c.id}>
									{c.version} ({c.year}) {c.is_active ? "★ Active" : ""}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Category Pills Filter */}
				<div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
					<span className="text-xs text-slate-400 mr-1.5 flex items-center gap-1 font-medium">
						<Layers className="w-3.5 h-3.5 text-purple-400" /> Category:
					</span>
					{ROLE_CATEGORIES.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => setSelectedCategory(cat)}
							className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
								selectedCategory === cat
									? "bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30"
									: "bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
							}`}
						>
							{cat === "ALL" ? "All Categories" : cat}
						</button>
					))}
				</div>
			</div>

			{/* Count display */}
			<div className="flex items-center justify-between text-xs text-slate-400 px-1">
				<span>
					Showing {filteredMembers.length} members{" "}
					{selectedCategory !== "ALL" && (
						<>
							in <strong className="text-purple-300">{selectedCategory}</strong>
						</>
					)}
					{selectedCycleId !== "all" && selectedCycleObj && (
						<>
							{" "}for <strong className="text-white">{selectedCycleObj.version}</strong>
						</>
					)}
				</span>
			</div>

			{/* Members Cards Grid */}
			{filteredMembers.length === 0 ? (
				<div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-500 text-sm">
					No team members found for this cycle, category, or search criteria.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{filteredMembers.map((member) => (
						<div
							key={member.id}
							className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
						>
							{/* Header with Avatar & Details */}
							<div className="space-y-3">
								<div className="flex items-start justify-between">
									<div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-md group-hover:border-purple-500/50 transition-colors">
										<Image
											src={member.image_url || "/images/team/placeholder.png"}
											alt={member.name}
											fill
											className="object-cover"
											unoptimized={
												member.image_url?.startsWith("http") || false
											}
										/>
									</div>

									<span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
										{cycleMap.get(member.cycle_id) || "StudPro"}
									</span>
								</div>

								<div>
									<h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
										{member.name}
									</h3>
									<p className="text-xs text-purple-400 font-medium mt-0.5">
										{member.role}
									</p>
									<div className="flex flex-wrap items-center gap-1.5 mt-2">
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
												getRoleCategory(member.role) === "Executive Board"
													? "bg-amber-500/10 text-amber-300 border-amber-500/30"
													: getRoleCategory(member.role) === "Advisors & Reps"
													? "bg-blue-500/10 text-blue-300 border-blue-500/30"
													: getRoleCategory(member.role) === "Pillar Leads"
													? "bg-purple-500/10 text-purple-300 border-purple-500/30"
													: getRoleCategory(member.role) === "Committee"
													? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
													: "bg-slate-800/60 text-slate-400 border-slate-700"
											}`}
										>
											{getRoleCategory(member.role)}
										</span>

										{isContactLeadershipRole(member.role) && (
											<span
												title="Featured on Homepage Contact Us"
												className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1"
											>
												<Sparkles className="w-2.5 h-2.5 text-amber-400" />
												Contact Lead
											</span>
										)}
									</div>
								</div>

								{/* Contact badges */}
								<div className="space-y-1 pt-1 text-xs text-slate-400">
									{member.email && (
										<div className="flex items-center gap-2 truncate">
											<Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
											<a
												href={`mailto:${member.email}`}
												className="hover:text-white hover:underline truncate"
											>
												{member.email}
											</a>
										</div>
									)}

									{member.contact_no && (
										<div className="flex items-center gap-2 text-slate-400">
											<Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
											<span>{member.contact_no}</span>
										</div>
									)}

									{member.linkedin_url && (
										<div className="flex items-center gap-2">
											<Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
											<a
												href={member.linkedin_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-400 hover:underline flex items-center gap-1 truncate"
											>
												<span>LinkedIn Profile</span>
												<ExternalLink className="w-2.5 h-2.5 shrink-0" />
											</a>
										</div>
									)}
								</div>
							</div>

							{/* Bottom Action Controls */}
							<div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
								<span className="text-[11px] text-slate-500">
									Order: #{member.display_order ?? 0}
								</span>

								<div className="flex items-center gap-1">
									<button
										onClick={() => handleOpenEdit(member)}
										title="Edit Member"
										className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
									>
										<Edit className="w-4 h-4" />
									</button>

									<button
										onClick={() => setDeletingMember(member)}
										title="Delete Member"
										className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Create / Edit Modal */}
			<TeamMemberModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				member={editingMember}
				cycles={cycles}
				defaultCycleId={selectedCycleId !== "all" ? selectedCycleId : undefined}
				onSuccess={() => router.refresh()}
			/>

			{/* Deletion Modal */}
			<DeleteConfirmModal
				isOpen={!!deletingMember}
				title={deletingMember?.name || ""}
				message="Are you sure you want to remove this member from the Organizing Committee directory?"
				onClose={() => setDeletingMember(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
