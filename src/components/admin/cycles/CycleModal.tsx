"use client";

import { useState, useEffect, useTransition } from "react";
import { X, Loader2, Calendar, AlertCircle } from "lucide-react";
import { createCycle, updateCycle } from "@/app/actions/cycles";
import { Button } from "@/components/ui/button";

interface CycleModalProps {
	isOpen: boolean;
	onClose: () => void;
	cycle?: any | null; // If present, edit mode; else create mode
	onSuccess: () => void;
}

export function CycleModal({
	isOpen,
	onClose,
	cycle,
	onSuccess,
}: CycleModalProps) {
	const isEdit = !!cycle;
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const [isActive, setIsActive] = useState<boolean>(cycle?.is_active || false);

	useEffect(() => {
		setIsActive(cycle?.is_active || false);
		setError(null);
	}, [cycle, isOpen]);

	if (!isOpen) return null;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		formData.set("is_active", String(isActive));

		startTransition(async () => {
			const res = isEdit
				? await updateCycle(cycle.id, formData)
				: await createCycle(formData);

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
						<div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
							<Calendar className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">
								{isEdit ? "Edit Annual Edition" : "Create New Edition"}
							</h2>
							<p className="text-xs text-slate-400">
								{isEdit ? "Update cycle version and details" : "Register a new StudPro cycle"}
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
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Cycle Version Title *
						</label>
						<input
							name="version"
							type="text"
							required
							defaultValue={cycle?.version || ""}
							placeholder="e.g. StudPro 10.0"
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Edition Year *
						</label>
						<input
							name="year"
							type="number"
							min="2018"
							max="2035"
							required
							defaultValue={cycle?.year || 2027}
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Theme / Description
						</label>
						<textarea
							name="description"
							rows={3}
							defaultValue={cycle?.description || ""}
							placeholder="Brief highlight of key focuses or milestones for this edition."
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none"
						/>
					</div>

					{/* Active Checkbox */}
					<label className="flex items-center gap-2.5 pt-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={isActive}
							onChange={(e) => setIsActive(e.target.checked)}
							className="w-4 h-4 rounded border-slate-700 text-blue-500 focus:ring-blue-500"
						/>
						<span>Set as Platform Active Flagship Edition</span>
					</label>

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
							className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 cursor-pointer"
						>
							{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
							{isEdit ? "Update Edition" : "Create Edition"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
