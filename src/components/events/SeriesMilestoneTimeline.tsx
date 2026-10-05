"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Layers, Sparkles } from "lucide-react";
import type { PublicEvent } from "@/lib/data/events";

interface SeriesMilestoneTimelineProps {
	seriesTitle: string;
	currentEventId: string;
	events: PublicEvent[];
}

export function SeriesMilestoneTimeline({
	seriesTitle,
	currentEventId,
	events,
}: SeriesMilestoneTimelineProps) {
	if (!events || events.length <= 1) return null;

	const sortedEvents = [...events].sort((a, b) => {
		if (a.series_order !== b.series_order) {
			return a.series_order - b.series_order;
		}
		return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
	});

	const currentIndex = sortedEvents.findIndex((e) => e.id === currentEventId);

	return (
		<div className="w-full my-8 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-900/30 shadow-xl text-white">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
						<Layers className="w-4 h-4" />
					</div>
					<div>
						<h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
							{seriesTitle} • Milestone Journey
							<Sparkles className="w-3.5 h-3.5 text-amber-400" />
						</h3>
						<p className="text-xs text-slate-400">
							Multi-stage series roadmap. Click any session to explore its agenda and takeaways.
						</p>
					</div>
				</div>

				<span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 self-start sm:self-auto">
					Stage {currentIndex >= 0 ? currentIndex + 1 : 1} of {sortedEvents.length}
				</span>
			</div>

			{/* Timeline Stepper */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
				{sortedEvents.map((ev, idx) => {
					const isCurrent = ev.id === currentEventId;
					const isPast = currentIndex !== -1 && idx < currentIndex;
					const stageLabel = ev.series_stage || `Stage ${idx + 1}`;

					return (
						<Link
							key={`${ev.id || ev.title}-${idx}`}
							href={`/events/${ev.category}/${encodeURIComponent(ev.title)}`}
							className={`group p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
								isCurrent
									? "bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/20 ring-1 ring-purple-500"
									: isPast
									? "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
									: "bg-slate-950/40 border-slate-850 hover:border-purple-500/40"
							}`}
						>
							{isCurrent && (
								<div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full pointer-events-none" />
							)}

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span
										className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
											isCurrent
												? "bg-purple-500 text-white"
												: isPast
												? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
												: "bg-slate-800 text-slate-400"
										}`}
									>
										{stageLabel}
									</span>

									{isPast ? (
										<CheckCircle2 className="w-4 h-4 text-emerald-400" />
									) : isCurrent ? (
										<span className="flex h-2.5 w-2.5 relative">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
											<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500" />
										</span>
									) : (
										<Circle className="w-3.5 h-3.5 text-slate-600" />
									)}
								</div>

								<h4
									className={`text-sm font-semibold transition-colors line-clamp-2 ${
										isCurrent
											? "text-white font-bold"
											: "text-slate-300 group-hover:text-purple-300"
									}`}
								>
									{ev.title}
								</h4>
							</div>

							<div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
								<span>{ev.event_date}</span>
								<span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-purple-400">
									<span>{isCurrent ? "Current Session" : "View"}</span>
									<ArrowRight className="w-3 h-3" />
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
