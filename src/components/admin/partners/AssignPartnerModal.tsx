"use client";

import { useState, useTransition } from "react";
import { X, Loader2, Award, Building2, AlertCircle } from "lucide-react";
import { assignCyclePartner } from "@/app/actions/partners";
import { Button } from "@/components/ui/button";

interface AssignPartnerModalProps {
	isOpen: boolean;
	onClose: () => void;
	companies: Array<{ id: string; name: string }>;
	cycles: Array<{ id: string; version: string; year: number }>;
	defaultCycleId?: string;
	onSuccess: () => void;
}

const TIERS = [
	{ value: "Platinum", label: "Platinum Partner" },
	{ value: "Gold", label: "Gold Partner" },
	{ value: "Silver", label: "Silver Partner" },
	{ value: "Bronze", label: "Bronze Partner" },
	{ value: "Partner", label: "Official Partner" },
];

export function AssignPartnerModal({
	isOpen,
	onClose,
	companies,
	cycles,
	defaultCycleId,
	onSuccess,
}: AssignPartnerModalProps) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);

		startTransition(async () => {
			const res = await assignCyclePartner(formData);
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
			<div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
				{/* Header */}
				<div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
							<Award className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">Assign Partner to Cycle</h2>
							<p className="text-xs text-slate-400">Allocate a company to an annual StudPro edition</p>
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
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Cycle */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							StudPro Cycle *
						</label>
						<select
							name="cycle_id"
							defaultValue={defaultCycleId || (cycles[0]?.id || "")}
							required
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
						>
							{cycles.map((c) => (
								<option key={c.id} value={c.id}>
									{c.version} ({c.year})
								</option>
							))}
						</select>
					</div>

					{/* Company */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Company *
						</label>
						<select
							name="company_id"
							required
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
						>
							<option value="">Select a company...</option>
							{companies.map((comp) => (
								<option key={comp.id} value={comp.id}>
									{comp.name}
								</option>
							))}
						</select>
					</div>

					{/* Tier */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Partnership Tier *
						</label>
						<select
							name="tier"
							defaultValue="Partner"
							required
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
						>
							{TIERS.map((t) => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
					</div>

					{/* Footer */}
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
							Assign Partner
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
