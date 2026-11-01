"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { X, Loader2, Building2, UploadCloud, Globe, AlertCircle, Trash2 } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";
import { createCompany, updateCompany } from "@/app/actions/partners";
import { Button } from "@/components/ui/button";
import { compressImageFiles } from "@/lib/utils/image-compression";

interface CompanyModalProps {
	isOpen: boolean;
	onClose: () => void;
	company?: any | null; // If present, edit mode; else create mode
	onSuccess: () => void;
}

export function CompanyModal({
	isOpen,
	onClose,
	company,
	onSuccess,
}: CompanyModalProps) {
	const isEdit = !!company;
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const [logoUrl, setLogoUrl] = useState<string>(company?.logo_url || "");
	const [showManualUrl, setShowManualUrl] = useState(false);

	useEffect(() => {
		setLogoUrl(company?.logo_url || "");
		setShowManualUrl(false);
		setError(null);
	}, [company, isOpen]);

	if (!isOpen) return null;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		if (logoUrl) {
			formData.set("logo_url", logoUrl);
		}

		startTransition(async () => {
			const res = isEdit
				? await updateCompany(company.id, formData)
				: await createCompany(formData);

			if (res.error) {
				setError(res.error);
			} else {
				onSuccess();
				onClose();
			}
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
			<div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
				{/* Header */}
				<div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
							<Building2 className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">
								{isEdit ? "Edit Partner Company" : "Add Partner Company"}
							</h2>
							<p className="text-xs text-slate-400">
								{isEdit ? "Update company profile and logo" : "Register a new corporate partner"}
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

				{/* Form Body */}
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && (
						<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Company Name */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Company Name *
						</label>
						<input
							name="name"
							type="text"
							required
							defaultValue={company?.name || ""}
							placeholder="e.g. WSO2, Dialog Axiata, IFS"
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
						/>
					</div>

					{/* Custom Slug ID (only for creation) */}
					{!isEdit && (
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Slug ID (Optional)
							</label>
							<input
								name="id"
								type="text"
								placeholder="e.g. dialog_axiata (auto-generated if left empty)"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
							/>
						</div>
					)}

					{/* Website Link */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Website URL
						</label>
						<div className="relative">
							<Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
							<input
								name="web_link"
								type="url"
								defaultValue={company?.web_link || ""}
								placeholder="https://company.com"
								className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
							/>
						</div>
					</div>

					{/* Logo Upload Section */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Company Logo
							</label>
							<button
								type="button"
								onClick={() => setShowManualUrl(!showManualUrl)}
								className="text-xs text-amber-400 hover:underline cursor-pointer"
							>
								{showManualUrl ? "Upload File Instead" : "Enter Image URL"}
							</button>
						</div>

						{/* Preview if logoUrl exists */}
						{logoUrl && (
							<div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-inner">
										<Image
											src={logoUrl}
											alt="Company Logo Preview"
											width={40}
											height={40}
											className="object-contain max-h-full max-w-full"
											unoptimized
										/>
									</div>
									<span className="text-xs text-slate-400 truncate">{logoUrl}</span>
								</div>
								<button
									type="button"
									onClick={() => setLogoUrl("")}
									className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
									title="Remove logo"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						)}

						{showManualUrl ? (
							<input
								type="text"
								value={logoUrl}
								onChange={(e) => setLogoUrl(e.target.value)}
								placeholder="https://... or /images/partners/company_id.png"
								className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-amber-500"
							/>
						) : (
							!logoUrl && (
								<div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-2 hover:border-slate-700 transition-colors">
									<UploadDropzone
										endpoint="singleImageUploader"
										onBeforeUploadBegin={async (files) => {
											try {
												return await compressImageFiles(files, {
													maxWidth: 800,
													maxHeight: 800,
													quality: 0.88,
												});
											} catch (err) {
												console.warn("Client logo compression error:", err);
												return files;
											}
										}}
										onClientUploadComplete={(res) => {
											if (res && res.length > 0) {
												setLogoUrl(res[0].ufsUrl || res[0].url);
											}
										}}
										appearance={{
											container: "border-0 bg-transparent py-4",
											label: "text-xs text-slate-300 font-medium",
											allowedContent: "text-[11px] text-slate-500",
											button: "bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-1.5 rounded-xl",
										}}
									/>
								</div>
							)
						)}
					</div>

					{/* Modal Footer */}
					<div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isPending}
							className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isPending}
							className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold flex items-center gap-2 cursor-pointer"
						>
							{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
							{isEdit ? "Update Company" : "Add Company"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
