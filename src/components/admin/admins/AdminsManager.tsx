"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Shield,
	ShieldCheck,
	UserPlus,
	Search,
	Trash2,
	User,
	Mail,
	Calendar,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
import { DeleteConfirmModal } from "@/components/admin/events/DeleteConfirmModal";
import { updateAdminRole, deleteAdminUser } from "@/app/actions/admins";

interface AdminsManagerProps {
	admins: any[];
	currentAdminId: string;
	isSuperAdmin: boolean;
}

export function AdminsManager({
	admins,
	currentAdminId,
	isSuperAdmin,
}: AdminsManagerProps) {
	const router = useRouter();

	const [modalOpen, setModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [deletingAdmin, setDeletingAdmin] = useState<any | null>(null);

	const filteredAdmins = admins.filter(
		(a) =>
			search === "" ||
			a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
			a.email?.toLowerCase().includes(search.toLowerCase()) ||
			a.role?.toLowerCase().includes(search.toLowerCase()),
	);

	async function handleRoleChange(
		userId: string,
		newRole: "super_admin" | "editor",
	) {
		await updateAdminRole(userId, newRole);
		router.refresh();
	}

	async function handleDelete() {
		if (!deletingAdmin) return;
		await deleteAdminUser(deletingAdmin.id);
		router.refresh();
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
						<ShieldCheck className="w-7 h-7 text-[#EE7929]" />
						Administrator Access & Role Control
					</h1>
					<p className="text-slate-400 text-sm mt-1">
						Manage administrator credentials, RBAC permissions, and access revocation.
					</p>
				</div>

				{isSuperAdmin && (
					<Button
						onClick={() => setModalOpen(true)}
						className="bg-gradient-to-r from-[#EE7929] to-[#d66518] hover:from-[#d66518] hover:to-[#c05510] text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#EE7929]/20 cursor-pointer self-start sm:self-auto"
					>
						<UserPlus className="w-4 h-4" />
						<span>New Administrator</span>
					</Button>
				)}
			</div>

			{/* Search toolbar */}
			<div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
				<div className="relative">
					<Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search administrators by name, email, or role..."
						className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
				<div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
					<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Showing {filteredAdmins.length} registered administrators
					</span>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="bg-slate-950/60 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400">
							<tr>
								<th className="px-6 py-3.5">Administrator</th>
								<th className="px-6 py-3.5">Role</th>
								<th className="px-6 py-3.5">Added Date</th>
								<th className="px-6 py-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60">
							{filteredAdmins.map((admin) => {
								const isSelf = admin.id === currentAdminId;

								return (
									<tr
										key={admin.id}
										className="hover:bg-slate-800/30 transition-colors group"
									>
										{/* Name & Email */}
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EE7929]/20 to-blue-500/20 border border-slate-700 flex items-center justify-center font-bold text-white text-sm shrink-0">
													{admin.full_name
														? admin.full_name
																.split(" ")
																.map((n: string) => n[0])
																.slice(0, 2)
																.join("")
																.toUpperCase()
														: "AD"}
												</div>
												<div>
													<div className="font-semibold text-white flex items-center gap-2">
														<span>{admin.full_name || "Administrator"}</span>
														{isSelf && (
															<span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EE7929]/20 text-[#EE7929] border border-[#EE7929]/40">
																You
															</span>
														)}
													</div>
													<div className="text-xs text-slate-400">
														{admin.email || admin.id}
													</div>
												</div>
											</div>
										</td>

										{/* Role */}
										<td className="px-6 py-4 whitespace-nowrap">
											{isSuperAdmin && !isSelf ? (
												<select
													value={admin.role}
													onChange={(e) =>
														handleRoleChange(
															admin.id,
															e.target.value as any,
														)
													}
													className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 outline-none focus:border-[#EE7929]"
												>
													<option value="editor">Editor</option>
													<option value="super_admin">Super Admin</option>
												</select>
											) : (
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
														admin.role === "super_admin"
															? "bg-[#EE7929]/15 text-[#EE7929] border-[#EE7929]/30"
															: "bg-blue-500/15 text-blue-300 border-blue-500/30"
													}`}
												>
													{admin.role === "super_admin" ? "Super Admin" : "Editor"}
												</span>
											)}
										</td>

										{/* Date */}
										<td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
											<div className="flex items-center gap-1.5">
												<Calendar className="w-3.5 h-3.5 text-slate-500" />
												{admin.created_at
													? new Date(admin.created_at).toLocaleDateString()
													: "N/A"}
											</div>
										</td>

										{/* Action */}
										<td className="px-6 py-4 text-right whitespace-nowrap">
											{isSuperAdmin && !isSelf ? (
												<button
													onClick={() => setDeletingAdmin(admin)}
													title="Revoke Administrator Access"
													className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											) : (
												<span className="text-xs text-slate-600 italic">
													Protected
												</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Provision Modal */}
			<AdminModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onSuccess={() => router.refresh()}
			/>

			{/* Revoke Access Modal */}
			<DeleteConfirmModal
				isOpen={!!deletingAdmin}
				title={deletingAdmin?.full_name || deletingAdmin?.email || ""}
				message="Revoking this administrator's access will immediately invalidate their sessions and remove all permissions."
				onClose={() => setDeletingAdmin(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
