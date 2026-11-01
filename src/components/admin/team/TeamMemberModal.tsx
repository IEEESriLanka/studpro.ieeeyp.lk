"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
	X,
	Loader2,
	User,
	Mail,
	Phone,
	Linkedin,
	UploadCloud,
	AlertCircle,
	Trash2,
	Sparkles,
	Star,
} from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";
import { createTeamMember, updateTeamMember } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { compressImageFiles } from "@/lib/utils/image-compression";
import {
	TEAM_ROLE_GROUPS,
	ALL_PRESET_ROLES,
	getRoleCategory,
	isContactLeadershipRole,
	getDefaultRoleOrder,
} from "@/lib/constants/team-roles";

interface TeamMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
	member?: any | null; // If present, edit mode; else create mode
	cycles: Array<{ id: string; version: string; year: number }>;
	defaultCycleId?: string;
	onSuccess: () => void;
}

export function TeamMemberModal({
	isOpen,
	onClose,
	member,
	cycles,
	defaultCycleId,
	onSuccess,
}: TeamMemberModalProps) {
	const isEdit = !!member;
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const [selectedRolePreset, setSelectedRolePreset] = useState<string>("");
	const [customRoleText, setCustomRoleText] = useState<string>("");
	const [displayOrder, setDisplayOrder] = useState<number>(member?.display_order || 0);

	const [imageUrl, setImageUrl] = useState<string>(
		member?.image_url || "/images/team/avatar.png",
	);
	const [showManualUrl, setShowManualUrl] = useState(false);

	useEffect(() => {
		setImageUrl(member?.image_url || "/images/team/avatar.png");
		setShowManualUrl(false);
		setError(null);

		if (member?.role) {
			const isPreset = ALL_PRESET_ROLES.some(
				(r) => r.value.toLowerCase() === member.role.toLowerCase(),
			);
			if (isPreset) {
				const matched = ALL_PRESET_ROLES.find(
					(r) => r.value.toLowerCase() === member.role.toLowerCase(),
				);
				setSelectedRolePreset(matched ? matched.value : member.role);
				setCustomRoleText("");
			} else {
				setSelectedRolePreset("CUSTOM");
				setCustomRoleText(member.role);
			}
			setDisplayOrder(member.display_order ?? 0);
		} else {
			setSelectedRolePreset("Chairperson");
			setCustomRoleText("");
			setDisplayOrder(1);
		}
	}, [member, isOpen]);

	if (!isOpen) return null;

	const activeEffectiveRole =
		selectedRolePreset === "CUSTOM" ? customRoleText : selectedRolePreset;
	const isContactLead = isContactLeadershipRole(activeEffectiveRole);
	const roleCategory = getRoleCategory(activeEffectiveRole);

	function handleRoleChange(newRoleValue: string) {
		setSelectedRolePreset(newRoleValue);
		if (newRoleValue !== "CUSTOM") {
			// Auto suggest default display order if not already custom edited
			setDisplayOrder(getDefaultRoleOrder(newRoleValue));
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const finalRole =
			selectedRolePreset === "CUSTOM"
				? customRoleText.trim()
				: selectedRolePreset.trim();

		if (!finalRole) {
			setError("Please choose or specify a role / designation.");
			return;
		}

		const formData = new FormData(e.currentTarget);
		formData.set("role", finalRole);
		formData.set("display_order", displayOrder.toString());
		if (imageUrl) {
			formData.set("image_url", imageUrl);
		}

		startTransition(async () => {
			const res = isEdit
				? await updateTeamMember(member.id, formData)
				: await createTeamMember(formData);

			if (res.error) {
				setError(res.error);
			} else {
				onSuccess();
				onClose();
			}
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
			<div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
							<User className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">
								{isEdit ? "Edit Team Member" : "Add Team Member"}
							</h2>
							<p className="text-xs text-slate-400">
								{isEdit ? "Update profile and role details" : "Add a new Organizing Committee member"}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
					<div className="p-6 space-y-5 overflow-y-auto flex-1">
						{error && (
							<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
								<AlertCircle className="w-4 h-4 shrink-0" />
								<span>{error}</span>
							</div>
						)}

					{/* Full Name & StudPro Cycle */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Full Name *
							</label>
							<input
								name="name"
								type="text"
								required
								defaultValue={member?.name || ""}
								placeholder="e.g. Kasun Perera"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
							/>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								StudPro Cycle *
							</label>
							<select
								name="cycle_id"
								defaultValue={member?.cycle_id || defaultCycleId || (cycles[0]?.id || "")}
								required
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
							>
								{cycles.map((c) => (
									<option key={c.id} value={c.id}>
										{c.version} ({c.year})
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Role Selection & Display Order */}
					<div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="sm:col-span-2 space-y-1.5">
								<div className="flex items-center gap-2">
									<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
										Role / Designation *
									</label>
									{roleCategory && (
										<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
											{roleCategory}
										</span>
									)}
								</div>
								<select
									value={selectedRolePreset}
									onChange={(e) => handleRoleChange(e.target.value)}
									className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
								>
									{TEAM_ROLE_GROUPS.map((group) => (
										<optgroup key={group.groupName} label={group.groupName}>
											{group.roles.map((r) => (
												<option key={r.value} value={r.value}>
													{r.label}
												</option>
											))}
										</optgroup>
									))}
									<optgroup label="Other / Specialized">
										<option value="CUSTOM">Custom Role / Other...</option>
									</optgroup>
								</select>
							</div>

							<div className="space-y-1.5">
								<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
									Display Order
								</label>
								<input
									name="display_order"
									type="number"
									min="0"
									value={displayOrder}
									onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
									className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
								/>
							</div>
						</div>

						{/* Custom Role Input if CUSTOM selected */}
						{selectedRolePreset === "CUSTOM" && (
							<div className="space-y-1.5 pt-1">
								<label className="block text-xs font-medium text-slate-400">
									Enter Custom Role Title *
								</label>
								<input
									type="text"
									required
									value={customRoleText}
									onChange={(e) => setCustomRoleText(e.target.value)}
									placeholder="e.g. Special Initiatives Lead, Tech Associate"
									className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
								/>
							</div>
						)}

						{/* Contact Lead Notice */}
						{isContactLead ? (
							<div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
								<Sparkles className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
								<span>
									<strong>Executive Lead:</strong> Automatically featured on the public website{" "}
									<em>Contact Us</em> leadership directory!
								</span>
							</div>
						) : (
							<p className="text-[11px] text-slate-500">
								Preset roles provide recommended display ordering (1-5 for Exec Board, 10-15 for Reps, 20-30 for Leads).
							</p>
						)}
					</div>

					{/* Email & Contact Phone */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Email Address
							</label>
							<div className="relative">
								<Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
								<input
									name="email"
									type="email"
									defaultValue={member?.email || ""}
									placeholder="member@ieee.org"
									className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Contact Number / WhatsApp
							</label>
							<div className="relative">
								<Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
								<input
									name="contact_no"
									type="tel"
									defaultValue={member?.contact_no || ""}
									placeholder="+94 77 123 4567"
									className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
								/>
							</div>
						</div>
					</div>

					{/* LinkedIn URL */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							LinkedIn Profile URL
						</label>
						<div className="relative">
							<Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
							<input
								name="linkedin_url"
								type="url"
								defaultValue={member?.linkedin_url || ""}
								placeholder="https://linkedin.com/in/username"
								className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
							/>
						</div>
					</div>

					{/* Photo Upload Section */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Member Photo / Avatar
							</label>
							<button
								type="button"
								onClick={() => setShowManualUrl(!showManualUrl)}
								className="text-xs text-purple-400 hover:underline cursor-pointer"
							>
								{showManualUrl ? "Upload File Instead" : "Enter Image URL"}
							</button>
						</div>

						{/* Show uploaded preview card ONLY when custom image exists */}
						{imageUrl && imageUrl !== "/images/team/avatar.png" && (
							<div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between gap-3 shadow-inner">
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 relative shrink-0 border-2 border-purple-500/50 shadow-md">
										<Image
											src={imageUrl}
											alt="Member Avatar Preview"
											fill
											className="object-cover"
											unoptimized={imageUrl.startsWith("http")}
										/>
									</div>
									<div className="min-w-0">
										<p className="text-xs font-semibold text-white">Custom Photo Uploaded</p>
										<p className="text-[11px] text-slate-400 truncate">{imageUrl}</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setImageUrl("/images/team/avatar.png")}
									className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
									title="Remove custom photo and reset to default avatar"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						)}

						{showManualUrl ? (
							<input
								type="text"
								value={imageUrl === "/images/team/avatar.png" ? "" : imageUrl}
								onChange={(e) => setImageUrl(e.target.value.trim() || "/images/team/avatar.png")}
								placeholder="https://... or /images/team/photo.png"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
							/>
						) : (
							imageUrl === "/images/team/avatar.png" && (
								<div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-3 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-center gap-4">
									<div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 relative shrink-0 border-2 border-slate-700 flex items-center justify-center shadow-md">
										<Image
											src="/images/team/avatar.png"
											alt="Default Avatar"
											fill
											className="object-cover"
										/>
									</div>
									<div className="flex-1 w-full min-w-0">
										<UploadDropzone
											endpoint="singleImageUploader"
											onBeforeUploadBegin={async (files) => {
												try {
													return await compressImageFiles(files, {
														maxWidth: 1200,
														maxHeight: 1200,
														quality: 0.85,
													});
												} catch (err) {
													console.warn("Client image compression error:", err);
													return files;
												}
											}}
											onClientUploadComplete={(res) => {
												if (res && res.length > 0) {
													setImageUrl(res[0].ufsUrl || res[0].url);
												}
											}}
											appearance={{
												container: "border-0 bg-transparent py-2 px-0 justify-center items-center sm:items-start",
												label: "text-xs text-slate-300 font-medium",
												allowedContent: "text-[10px] text-slate-500",
												button: "bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-1.5 rounded-xl cursor-pointer mt-1",
											}}
										/>
									</div>
								</div>
							)
						)}
					</div>
					</div>

					{/* Sticky Modal Footer */}
					<div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/60 shrink-0">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isPending}
							className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isPending}
							className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20"
						>
							{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
							{isEdit ? "Update Member" : "Add Member"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
