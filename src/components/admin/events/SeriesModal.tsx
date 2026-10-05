"use client";

import { useState, useTransition } from "react";
import {
	X,
	Loader2,
	Layers,
	Plus,
	Trash2,
	AlertCircle,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createEventSeries, deleteEventSeries } from "@/app/actions/events";
import { POPULAR_SERIES_SUGGESTIONS } from "@/lib/constants/events";

interface SeriesModalProps {
	isOpen: boolean;
	onClose: () => void;
	cycles: Array<{ id: string; version: string; year: number }>;
	defaultCycleId?: string;
	existingSeries?: Array<{ id: string; cycle_id: string; title: string }>;
	onSuccess: (newSeries?: { id: string; cycle_id: string; title: string }) => void;
}

export function SeriesModal({
	isOpen,
	onClose,
	cycles,
	defaultCycleId,
	existingSeries = [],
	onSuccess,
}: SeriesModalProps) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const [cycleId, setCycleId] = useState<string>(
		defaultCycleId || (cycles[0]?.id ?? ""),
	);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	if (!isOpen) return null;

	const filteredSeries = existingSeries.filter((s) => s.cycle_id === cycleId);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		if (!title.trim() || !cycleId) {
			setError("Series title and cycle are required.");
			return;
		}

		const formData = new FormData();
		formData.set("cycle_id", cycleId);
		formData.set("title", title.trim());
		if (description.trim()) {
			formData.set("description", description.trim());
		}

		startTransition(async () => {
			const res = await createEventSeries(formData);
			if (res.error) {
				setError(res.error);
			} else {
				setTitle("");
				setDescription("");
				onSuccess(res.data);
				onClose();
			}
		});
	}

	async function handleDeleteSeries(id: string) {
		startTransition(async () => {
			const res = await deleteEventSeries(id);
			if (res.error) {
				setError(res.error);
			} else {
				onSuccess();
			}
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
			<div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
							<Layers className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">Event Series & Tracks</h2>
							<p className="text-xs text-slate-400">
								Create multi-session initiatives (e.g. Young Protegé)
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

				{/* Scrollable Body */}
				<div className="p-6 space-y-6 overflow-y-auto flex-1">
					{error && (
						<div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Create Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								StudPro Cycle *
							</label>
							<select
								value={cycleId}
								onChange={(e) => setCycleId(e.target.value)}
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
							>
								{cycles.map((c) => (
									<option key={c.id} value={c.id}>
										{c.version} ({c.year})
									</option>
								))}
							</select>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Series Title *
							</label>
							<input
								type="text"
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. Young Protegé, TechNova Bootcamp"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
							/>
						</div>

						{/* Quick chips */}
						<div className="flex flex-wrap items-center gap-1.5">
							<span className="text-[10px] text-slate-400 flex items-center gap-1">
								<Sparkles className="w-2.5 h-2.5 text-purple-400" /> Presets:
							</span>
							{POPULAR_SERIES_SUGGESTIONS.map((preset) => (
								<button
									key={preset}
									type="button"
									onClick={() => setTitle(preset)}
									className="px-2 py-0.5 rounded-md text-[10px] bg-slate-950 text-purple-300 border border-slate-800 hover:border-purple-500/50 cursor-pointer"
								>
									{preset}
								</button>
							))}
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Description (Optional)
							</label>
							<textarea
								rows={2}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Brief theme or target audience for this track..."
								className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500 resize-none"
							/>
						</div>

						<Button
							type="submit"
							disabled={isPending}
							className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20"
						>
							{isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Plus className="w-4 h-4" />
							)}
							<span>Create Series</span>
						</Button>
					</form>

					{/* Existing Series in this cycle */}
					<div className="pt-4 border-t border-slate-800 space-y-2.5">
						<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Existing Series for Selected Cycle ({filteredSeries.length})
						</h3>

						{filteredSeries.length === 0 ? (
							<p className="text-xs text-slate-500 italic">
								No event series created for this cycle yet.
							</p>
						) : (
							<div className="space-y-2">
								{filteredSeries.map((s) => (
									<div
										key={s.id}
										className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
									>
										<div className="flex items-center gap-2 truncate">
											<Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
											<span className="font-semibold text-white truncate">
												{s.title}
											</span>
										</div>

										<button
											type="button"
											disabled={isPending}
											onClick={() => handleDeleteSeries(s.id)}
											className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
											title="Delete series"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end bg-slate-950/60 shrink-0">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs cursor-pointer"
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	);
}
