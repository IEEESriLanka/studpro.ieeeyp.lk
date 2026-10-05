"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Calendar,
	MapPin,
	User,
	Users,
	Video,
	Globe,
	Building2,
	Clock,
	Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventModal } from "./EventModal";
import { SeriesModal } from "./SeriesModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { deleteEvent } from "@/app/actions/events";
import { EVENT_CATEGORIES, type DeliveryMode } from "@/lib/constants/events";

interface EventsManagerProps {
	initialEvents: any[];
	cycles: Array<{ id: string; version: string; year: number }>;
	series: Array<{ id: string; cycle_id: string; title: string }>;
	companies?: Array<{ id: string; name: string; logo_url: string; web_link?: string | null }>;
}

export function EventsManager({
	initialEvents,
	cycles,
	series,
	companies = [],
}: EventsManagerProps) {
	const router = useRouter();

	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedCycle, setSelectedCycle] = useState("all");
	const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<string>("all");

	// Modals state
	const [modalOpen, setModalOpen] = useState(false);
	const [seriesModalOpen, setSeriesModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<any | null>(null);
	const [deletingEvent, setDeletingEvent] = useState<any | null>(null);

	// Lookup maps
	const seriesMap = new Map<string, string>();
	series.forEach((s) => seriesMap.set(s.id, s.title));

	// Filter events based on search, category, cycle, and delivery mode
	const filteredEvents = initialEvents.filter((ev) => {
		const matchSearch =
			search === "" ||
			ev.title.toLowerCase().includes(search.toLowerCase()) ||
			(ev.topic && ev.topic.toLowerCase().includes(search.toLowerCase())) ||
			(ev.venue && ev.venue.toLowerCase().includes(search.toLowerCase())) ||
			(ev.speakers &&
				ev.speakers.some((s: any) =>
					s.name?.toLowerCase().includes(search.toLowerCase()),
				));

		const matchCategory =
			selectedCategory === "all" || ev.category === selectedCategory;

		const matchCycle =
			selectedCycle === "all" || ev.cycle_id === selectedCycle;

		const matchDelivery =
			selectedDeliveryMode === "all" ||
			(ev.delivery_mode || "physical") === selectedDeliveryMode;

		return matchSearch && matchCategory && matchCycle && matchDelivery;
	});

	function handleOpenCreate() {
		setEditingEvent(null);
		setModalOpen(true);
	}

	function handleOpenEdit(event: any) {
		setEditingEvent(event);
		setModalOpen(true);
	}

	async function handleDelete() {
		if (!deletingEvent) return;
		await deleteEvent(deletingEvent.id);
		router.refresh();
	}

	return (
		<div className="space-y-6">
			{/* Top action header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
						<Calendar className="w-7 h-7 text-[#EE7929]" />
						Events & Modular Series Management
					</h1>
					<p className="text-slate-400 text-sm mt-1">
						Manage workshops, webinars, multi-speaker panels, partner companies, and multi-stage series (e.g. Young Protegé).
					</p>
				</div>

				<div className="flex items-center gap-2.5 self-start sm:self-auto">
					<Button
						type="button"
						variant="outline"
						onClick={() => setSeriesModalOpen(true)}
						className="border-slate-800 bg-slate-900 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer shadow-sm text-sm"
					>
						<Layers className="w-4 h-4 text-purple-400" />
						<span>Manage Series</span>
					</Button>

					<Button
						onClick={handleOpenCreate}
						className="bg-gradient-to-r from-[#EE7929] to-[#d66518] hover:from-[#d66518] hover:to-[#c05510] text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#EE7929]/20 cursor-pointer text-sm"
					>
						<Plus className="w-4 h-4" />
						<span>Add Modular Event</span>
					</Button>
				</div>
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
							placeholder="Search events by title, topic, speaker, or venue..."
							className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
						/>
					</div>

					{/* Category dropdown filter */}
					<div className="w-full sm:w-44">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
						>
							<option value="all">All Categories</option>
							{EVENT_CATEGORIES.map((c) => (
								<option key={c.value} value={c.value}>
									{c.label}
								</option>
							))}
						</select>
					</div>

					{/* Cycle filter */}
					<div className="w-full sm:w-44">
						<select
							value={selectedCycle}
							onChange={(e) => setSelectedCycle(e.target.value)}
							className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
						>
							<option value="all">All Annual Cycles</option>
							{cycles.map((c) => (
								<option key={c.id} value={c.id}>
									{c.version} ({c.year})
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Delivery Mode Pills Filter */}
				<div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
					<span className="text-xs text-slate-400 mr-1.5 flex items-center gap-1 font-medium">
						Format:
					</span>
					{[
						{ value: "all", label: "All Formats" },
						{ value: "physical", label: "📍 Physical", color: "emerald" },
						{ value: "online", label: "💻 Online Webinar", color: "sky" },
						{ value: "hybrid", label: "🌐 Hybrid", color: "purple" },
					].map((tab) => (
						<button
							key={tab.value}
							type="button"
							onClick={() => setSelectedDeliveryMode(tab.value)}
							className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
								selectedDeliveryMode === tab.value
									? "bg-[#EE7929] text-white font-semibold shadow-md shadow-[#EE7929]/20"
									: "bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Events Data Table */}
			<div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
				<div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
					<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Showing {filteredEvents.length} of {initialEvents.length} events
					</span>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="bg-slate-950/60 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400">
							<tr>
								<th className="px-6 py-3.5">Event Title & Series</th>
								<th className="px-6 py-3.5">Format & Location</th>
								<th className="px-6 py-3.5">Date & Time</th>
								<th className="px-6 py-3.5">Speakers & Partners</th>
								<th className="px-6 py-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60">
							{filteredEvents.length === 0 ? (
								<tr>
									<td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
										No matching events found. Try adjusting your search or filters.
									</td>
								</tr>
							) : (
								filteredEvents.map((ev) => {
									const deliveryMode: DeliveryMode = ev.delivery_mode || "physical";
									const speakersList = ev.speakers || [];
									const companiesList = ev.event_companies || [];
									const seriesTitle = ev.series_id ? seriesMap.get(ev.series_id) : null;

									return (
										<tr
											key={ev.id}
											className="hover:bg-slate-800/30 transition-colors group"
										>
											{/* Title & Series Info */}
											<td className="px-6 py-4 max-w-xs sm:max-w-md">
												<div className="font-semibold text-white truncate">
													{ev.title}
												</div>
												<div className="flex flex-wrap items-center gap-1.5 mt-1">
													<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 capitalize border border-slate-700/50">
														{ev.category?.replace(/-/g, " ")}
													</span>

													{seriesTitle && (
														<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
															<Layers className="w-2.5 h-2.5 text-purple-400" />
															{seriesTitle}
															{ev.series_stage ? ` • ${ev.series_stage}` : ""}
														</span>
													)}
												</div>
											</td>

											{/* Format & Location */}
											<td className="px-6 py-4 whitespace-nowrap text-xs space-y-1">
												<div>
													{deliveryMode === "physical" ? (
														<span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
															<MapPin className="w-3 h-3 text-emerald-400" />
															Physical Venue
														</span>
													) : deliveryMode === "online" ? (
														<span className="px-2 py-0.5 rounded-full font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 inline-flex items-center gap-1">
															<Video className="w-3 h-3 text-sky-400" />
															Online Webinar
														</span>
													) : (
														<span className="px-2 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1">
															<Globe className="w-3 h-3 text-purple-400" />
															Hybrid Session
														</span>
													)}
												</div>

												{ev.venue && (
													<div className="text-slate-400 truncate max-w-xs text-[11px]">
														{ev.venue}
													</div>
												)}
												{ev.meeting_url && deliveryMode !== "physical" && (
													<div className="text-sky-400/80 truncate max-w-xs text-[11px]">
														🔗 Virtual Link Configured
													</div>
												)}
											</td>

											{/* Date & Time */}
											<td className="px-6 py-4 whitespace-nowrap text-slate-300 text-xs space-y-0.5">
												<div className="flex items-center gap-1.5 font-medium text-white">
													<Calendar className="w-3.5 h-3.5 text-[#EE7929]" />
													{ev.event_date}
												</div>
												{ev.time && (
													<div className="flex items-center gap-1 text-slate-400">
														<Clock className="w-3 h-3 text-slate-500" />
														{ev.time}
													</div>
												)}
											</td>

											{/* Speakers & Partners */}
											<td className="px-6 py-4 max-w-xs text-xs space-y-1">
												{speakersList.length > 0 ? (
													<div className="flex items-center gap-1.5 text-slate-200 truncate">
														<Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
														<span className="truncate font-medium">
															{speakersList.length === 1
																? speakersList[0].name
																: `${speakersList.length} Speakers (${speakersList[0].name}, ...)`}
														</span>
													</div>
												) : (
													<div className="text-slate-500 text-[11px] italic">
														No speakers
													</div>
												)}

												{companiesList.length > 0 && (
													<div className="flex items-center gap-1.5 text-amber-300/90 text-[11px]">
														<Building2 className="w-3 h-3 text-amber-400 shrink-0" />
														<span>{companiesList.length} Partner Company/ies</span>
													</div>
												)}
											</td>

											{/* Actions */}
											<td className="px-6 py-4 text-right whitespace-nowrap">
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={() => handleOpenEdit(ev)}
														title="Edit Event"
														className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
													>
														<Edit className="w-4 h-4" />
													</button>

													<button
														onClick={() => setDeletingEvent(ev)}
														title="Delete Event"
														className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors cursor-pointer"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Create / Edit Modal */}
			<EventModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				event={editingEvent}
				cycles={cycles}
				series={series}
				companies={companies}
				onSuccess={() => router.refresh()}
			/>

			{/* Series Management Modal */}
			<SeriesModal
				isOpen={seriesModalOpen}
				onClose={() => setSeriesModalOpen(false)}
				cycles={cycles}
				defaultCycleId={selectedCycle !== "all" ? selectedCycle : undefined}
				existingSeries={series}
				onSuccess={() => router.refresh()}
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmModal
				isOpen={!!deletingEvent}
				title={deletingEvent?.title || ""}
				message="Deleting this event will remove its associated speakers, partners, and series timeline records."
				onClose={() => setDeletingEvent(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
