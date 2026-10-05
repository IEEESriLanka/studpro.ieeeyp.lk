"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
	X,
	Loader2,
	Calendar,
	User,
	Users,
	MapPin,
	Video,
	Globe,
	Building2,
	Plus,
	Trash2,
	Sparkles,
	Layers,
	Link2,
} from "lucide-react";
import { createEvent, updateEvent } from "@/app/actions/events";
import { ImageGalleryUploader } from "@/components/admin/common/ImageGalleryUploader";
import { Button } from "@/components/ui/button";
import { SeriesModal } from "./SeriesModal";
import {
	type DeliveryMode,
	type SpeakerInput,
	type EventCompanyInput,
	EVENT_CATEGORIES,
	SERIES_STAGES_SUGGESTIONS,
} from "@/lib/constants/events";

interface EventModalProps {
	isOpen: boolean;
	onClose: () => void;
	event?: any | null; // If passed, edit mode; else create mode
	cycles: Array<{ id: string; version: string; year: number }>;
	series: Array<{ id: string; cycle_id: string; title: string }>;
	companies?: Array<{ id: string; name: string; logo_url: string; web_link?: string | null }>;
	onSuccess: () => void;
}

export function EventModal({
	isOpen,
	onClose,
	event,
	cycles,
	series,
	companies = [],
	onSuccess,
}: EventModalProps) {
	const isEdit = !!event;
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const [seriesList, setSeriesList] = useState(series);
	const [seriesModalOpen, setSeriesModalOpen] = useState(false);

	const [selectedCycleId, setSelectedCycleId] = useState<string>(
		event?.cycle_id || (cycles.length > 0 ? cycles[0].id : ""),
	);

	// Delivery Mode
	const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("physical");

	// Series & Stage
	const [seriesId, setSeriesId] = useState<string>("none");
	const [seriesStage, setSeriesStage] = useState<string>("");
	const [seriesOrder, setSeriesOrder] = useState<number>(1);

	// Speakers State
	const [hasSpeakers, setHasSpeakers] = useState<boolean>(false);
	const [speakers, setSpeakers] = useState<SpeakerInput[]>([
		{ name: "", title: "", company: "" },
	]);

	// Companies Association State
	const [hasCompanies, setHasCompanies] = useState<boolean>(false);
	const [selectedCompanies, setSelectedCompanies] = useState<EventCompanyInput[]>([]);

	// Initialize on open or event change
	useEffect(() => {
		setError(null);
		if (event) {
			setSelectedCycleId(event.cycle_id || (cycles[0]?.id ?? ""));
			setDeliveryMode((event.delivery_mode as DeliveryMode) || "physical");
			setSeriesId(event.series_id || "none");
			setSeriesStage(event.series_stage || "");
			setSeriesOrder(event.series_order || 1);

			// Populate speakers
			if (event.speakers && event.speakers.length > 0) {
				setHasSpeakers(true);
				setSpeakers(
					event.speakers.map((s: any) => ({
						id: s.id,
						name: s.name || "",
						title: s.title || "",
						company: s.company || "",
						avatar_url: s.avatar_url || "",
						display_order: s.display_order,
					})),
				);
			} else {
				setHasSpeakers(false);
				setSpeakers([{ name: "", title: "", company: "" }]);
			}

			// Populate companies
			if (event.event_companies && event.event_companies.length > 0) {
				setHasCompanies(true);
				setSelectedCompanies(
					event.event_companies.map((ec: any) => ({
						company_id: ec.company_id || ec.company?.id,
						role: ec.role || "Partner",
					})),
				);
			} else {
				setHasCompanies(false);
				setSelectedCompanies([]);
			}
		} else {
			setSelectedCycleId(cycles[0]?.id ?? "");
			setDeliveryMode("physical");
			setSeriesId("none");
			setSeriesStage("");
			setSeriesOrder(1);
			setHasSpeakers(false);
			setSpeakers([{ name: "", title: "", company: "" }]);
			setHasCompanies(false);
			setSelectedCompanies([]);
		}
		setSeriesList(series);
	}, [event, isOpen, cycles, series]);

	if (!isOpen) return null;

	const filteredSeries = seriesList.filter((s) => s.cycle_id === selectedCycleId);

	// Speaker helper actions
	function handleAddSpeaker() {
		setSpeakers((prev) => [...prev, { name: "", title: "", company: "" }]);
	}

	function handleUpdateSpeaker(
		index: number,
		field: keyof SpeakerInput,
		value: string,
	) {
		setSpeakers((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	}

	function handleRemoveSpeaker(index: number) {
		setSpeakers((prev) => {
			if (prev.length <= 1) {
				return [{ name: "", title: "", company: "" }];
			}
			return prev.filter((_, idx) => idx !== index);
		});
	}

	// Company toggle action
	function handleToggleCompany(companyId: string) {
		setSelectedCompanies((prev) => {
			const exists = prev.some((c) => c.company_id === companyId);
			if (exists) {
				return prev.filter((c) => c.company_id !== companyId);
			} else {
				return [...prev, { company_id: companyId, role: "Partner" }];
			}
		});
	}

	function handleCompanyRoleChange(companyId: string, newRole: string) {
		setSelectedCompanies((prev) =>
			prev.map((c) =>
				c.company_id === companyId ? { ...c, role: newRole } : c,
			),
		);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);

		// Modular Form Payload bindings
		formData.set("delivery_mode", deliveryMode);
		formData.set("series_id", seriesId);
		formData.set("series_stage", seriesStage.trim());
		formData.set("series_order", seriesOrder.toString());

		// Speakers payload
		const activeSpeakers = hasSpeakers
			? speakers.filter((s) => s.name?.trim())
			: [];
		formData.set("speakers_json", JSON.stringify(activeSpeakers));

		// Companies payload
		const activeCompanies = hasCompanies ? selectedCompanies : [];
		formData.set("companies_json", JSON.stringify(activeCompanies));

		startTransition(async () => {
			const res = isEdit
				? await updateEvent(event.id, formData)
				: await createEvent(formData);

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
			<div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
				{/* Modal Header */}
				<div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-[#EE7929]/15 text-[#EE7929] flex items-center justify-center">
							<Calendar className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">
								{isEdit ? "Edit Modular Event" : "Create Modular Event"}
							</h2>
							<p className="text-xs text-slate-400">
								Configure in-person/virtual delivery, guest speakers, collaborating companies, and series milestones.
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

				{/* Modal Body */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
					{error && (
						<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
							{error}
						</div>
					)}

					{/* 1. Cycle & Track Series */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								StudPro Cycle *
							</label>
							<select
								name="cycle_id"
								value={selectedCycleId}
								onChange={(e) => setSelectedCycleId(e.target.value)}
								required
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							>
								{cycles.map((c) => (
									<option key={c.id} value={c.id}>
										{c.version} ({c.year})
									</option>
								))}
							</select>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
									Track / Signature Series
								</label>
								<button
									type="button"
									onClick={() => setSeriesModalOpen(true)}
									className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
								>
									<Plus className="w-3.5 h-3.5" />
									<span>New Series</span>
								</button>
							</div>
							<select
								name="series_id"
								value={seriesId}
								onChange={(e) => setSeriesId(e.target.value)}
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							>
								<option value="none">Standalone Event (No Series)</option>
								{filteredSeries.map((s) => (
									<option key={s.id} value={s.id}>
										{s.title}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* 1.1 Series Stage & Sequence (Conditional if Series Selected) */}
					{seriesId !== "none" && (
						<div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-3">
							<div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
								<Layers className="w-4 h-4 text-purple-400" />
								<span>Series Stage Progression & Milestones</span>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div className="sm:col-span-2 space-y-1">
									<label className="block text-[11px] font-medium text-slate-300">
										Stage / Milestone Name (e.g. Awareness, Kickoff, Summit)
									</label>
									<input
										type="text"
										value={seriesStage}
										onChange={(e) => setSeriesStage(e.target.value)}
										placeholder="e.g. Stage 1: Awareness & Registrations"
										className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
									/>
								</div>

								<div className="space-y-1">
									<label className="block text-[11px] font-medium text-slate-300">
										Stage Sequence Order
									</label>
									<input
										type="number"
										min="1"
										value={seriesOrder}
										onChange={(e) => setSeriesOrder(parseInt(e.target.value) || 1)}
										className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
									/>
								</div>
							</div>

							{/* Quick stage presets */}
							<div className="flex flex-wrap items-center gap-1.5 pt-1">
								<span className="text-[10px] text-slate-400">Quick Presets:</span>
								{SERIES_STAGES_SUGGESTIONS.map((preset) => (
									<button
										key={preset}
										type="button"
										onClick={() => setSeriesStage(preset)}
										className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 border border-slate-800 text-purple-300 hover:bg-purple-900/40 cursor-pointer"
									>
										{preset}
									</button>
								))}
							</div>
						</div>
					)}

					{/* 2. Category & Title */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Category *
							</label>
							<select
								name="category"
								defaultValue={event?.category || "workshops"}
								required
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							>
								{EVENT_CATEGORIES.map((cat) => (
									<option key={cat.value} value={cat.value}>
										{cat.label}
									</option>
								))}
							</select>
						</div>

						<div className="sm:col-span-2 space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Event Title *
							</label>
							<input
								name="title"
								type="text"
								required
								defaultValue={event?.title || ""}
								placeholder="e.g. Young Protegé - Awareness Session"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							/>
						</div>
					</div>

					{/* 3. Delivery Format (Physical vs Online vs Hybrid) */}
					<div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Delivery Format / Venue Mode *
						</label>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<button
								type="button"
								onClick={() => setDeliveryMode("physical")}
								className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
									deliveryMode === "physical"
										? "bg-emerald-500/15 border-emerald-500/60 text-white shadow-md shadow-emerald-500/10"
										: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
								}`}
							>
								<MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${deliveryMode === "physical" ? "text-emerald-400" : "text-slate-400"}`} />
								<div>
									<p className="text-xs font-bold text-white">Physical Venue</p>
									<p className="text-[11px] text-slate-400 leading-tight mt-0.5">In-person auditorium or campus</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => setDeliveryMode("online")}
								className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
									deliveryMode === "online"
										? "bg-sky-500/15 border-sky-500/60 text-white shadow-md shadow-sky-500/10"
										: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
								}`}
							>
								<Video className={`w-4 h-4 shrink-0 mt-0.5 ${deliveryMode === "online" ? "text-sky-400" : "text-slate-400"}`} />
								<div>
									<p className="text-xs font-bold text-white">Online Webinar</p>
									<p className="text-[11px] text-slate-400 leading-tight mt-0.5">Zoom, Teams, or Live Stream</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => setDeliveryMode("hybrid")}
								className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
									deliveryMode === "hybrid"
										? "bg-purple-500/15 border-purple-500/60 text-white shadow-md shadow-purple-500/10"
										: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
								}`}
							>
								<Globe className={`w-4 h-4 shrink-0 mt-0.5 ${deliveryMode === "hybrid" ? "text-purple-400" : "text-slate-400"}`} />
								<div>
									<p className="text-xs font-bold text-white">Hybrid Event</p>
									<p className="text-[11px] text-slate-400 leading-tight mt-0.5">Physical hall + live webinar</p>
								</div>
							</button>
						</div>

						{/* Dynamic inputs based on deliveryMode */}
						<div className="space-y-3 pt-2">
							{deliveryMode === "physical" && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="space-y-1">
										<label className="block text-[11px] font-semibold text-slate-300">
											Physical Venue Name / Address *
										</label>
										<div className="relative">
											<MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
											<input
												name="venue"
												type="text"
												required
												defaultValue={event?.venue || ""}
												placeholder="e.g. Royal MAS Arena, Colombo"
												className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-emerald-500"
											/>
										</div>
									</div>

									<div className="space-y-1">
										<label className="block text-[11px] font-semibold text-slate-300">
											Google Maps Directions URL (Optional)
										</label>
										<div className="relative">
											<Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
											<input
												name="map_url"
												type="url"
												defaultValue={event?.map_url || ""}
												placeholder="https://maps.google.com/..."
												className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-emerald-500"
											/>
										</div>
									</div>
								</div>
							)}

							{deliveryMode === "online" && (
								<div className="space-y-1">
									<label className="block text-[11px] font-semibold text-slate-300">
										Online Platform / Virtual Location *
									</label>
									<div className="relative">
										<Video className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
										<input
											name="venue"
											type="text"
											required
											defaultValue={event?.venue || "Live via Zoom"}
											placeholder="e.g. Live via Zoom, Google Meet, Microsoft Teams"
											className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-sky-500"
										/>
									</div>
									<p className="text-[10px] text-slate-400">
										Defaults to &quot;Live via Zoom&quot;. You can change this to Google Meet, Microsoft Teams, etc.
									</p>
								</div>
							)}

							{deliveryMode === "hybrid" && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="space-y-1">
										<label className="block text-[11px] font-semibold text-slate-300">
											Physical Venue Name / Address *
										</label>
										<div className="relative">
											<MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
											<input
												name="venue"
												type="text"
												required
												defaultValue={event?.venue || ""}
												placeholder="e.g. Royal MAS Arena, Colombo"
												className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
											/>
										</div>
									</div>

									<div className="space-y-1">
										<label className="block text-[11px] font-semibold text-slate-300">
											Virtual Platform / Stream Details
										</label>
										<div className="relative">
											<Video className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
											<input
												name="online_platform"
												type="text"
												defaultValue={event?.meeting_url || "Live via Zoom"}
												placeholder="e.g. Live via Zoom, Google Meet"
												className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
											/>
										</div>
									</div>

									<div className="sm:col-span-2 space-y-1">
										<label className="block text-[11px] font-semibold text-slate-300">
											Google Maps Directions URL (Optional)
										</label>
										<div className="relative">
											<Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
											<input
												name="map_url"
												type="url"
												defaultValue={event?.map_url || ""}
												placeholder="https://maps.google.com/..."
												className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
											/>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 4. Topic & Date & Time */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Topic / Theme (Optional)
							</label>
							<input
								name="topic"
								type="text"
								defaultValue={event?.topic || ""}
								placeholder="e.g. CV Writing & Polish"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							/>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Date *
							</label>
							<input
								name="event_date"
								type="date"
								required
								defaultValue={event?.event_date || new Date().toISOString().split("T")[0]}
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							/>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Time (Optional)
							</label>
							<input
								name="time"
								type="text"
								defaultValue={event?.time || ""}
								placeholder="e.g. 6:00 PM Onwards"
								className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							/>
						</div>
					</div>

					{/* 5. Multi-Speaker Repeater Section */}
					<div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-200 cursor-pointer">
								<input
									type="checkbox"
									checked={hasSpeakers}
									onChange={(e) => setHasSpeakers(e.target.checked)}
									className="rounded border-slate-700 text-[#EE7929] focus:ring-[#EE7929] w-4 h-4"
								/>
								<span className="flex items-center gap-1.5 text-[#EE7929]">
									<Users className="w-4 h-4" />
									This event features Guest Speakers / Resource Persons ({hasSpeakers ? speakers.length : 0})
								</span>
							</label>

							{hasSpeakers && (
								<Button
									type="button"
									variant="outline"
									onClick={handleAddSpeaker}
									className="border-slate-800 bg-slate-900 text-slate-200 hover:text-white text-xs px-2.5 py-1 h-auto flex items-center gap-1 cursor-pointer"
								>
									<Plus className="w-3.5 h-3.5 text-[#EE7929]" />
									<span>Add Speaker</span>
								</Button>
							)}
						</div>

						{hasSpeakers && (
							<div className="space-y-3 pt-2">
								{speakers.map((spk, idx) => (
									<div
										key={idx}
										className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col gap-2.5 relative"
									>
										<div className="flex items-center justify-between">
											<span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
												<User className="w-3 h-3 text-[#EE7929]" />
												Speaker #{idx + 1}
											</span>
											{speakers.length > 1 && (
												<button
													type="button"
													onClick={() => handleRemoveSpeaker(idx)}
													className="text-slate-500 hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
													title="Remove speaker"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											)}
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
											<div>
												<label className="block text-[10px] text-slate-400 mb-1">
													Speaker Name *
												</label>
												<input
													type="text"
													required={hasSpeakers}
													value={spk.name}
													onChange={(e) => handleUpdateSpeaker(idx, "name", e.target.value)}
													placeholder="e.g. Kasun Perera"
													className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-[#EE7929]"
												/>
											</div>
											<div>
												<label className="block text-[10px] text-slate-400 mb-1">
													Title / Designation
												</label>
												<input
													type="text"
													value={spk.title || ""}
													onChange={(e) => handleUpdateSpeaker(idx, "title", e.target.value)}
													placeholder="e.g. Senior Software Architect"
													className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-[#EE7929]"
												/>
											</div>
											<div>
												<label className="block text-[10px] text-slate-400 mb-1">
													Company / Affiliation
												</label>
												<input
													type="text"
													value={spk.company || ""}
													onChange={(e) => handleUpdateSpeaker(idx, "company", e.target.value)}
													placeholder="e.g. WSO2 / Dialog"
													className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-[#EE7929]"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* 6. Multi-Company / Corporate Partners Section */}
					<div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-200 cursor-pointer">
								<input
									type="checkbox"
									checked={hasCompanies}
									onChange={(e) => setHasCompanies(e.target.checked)}
									className="rounded border-slate-700 text-[#EE7929] focus:ring-[#EE7929] w-4 h-4"
								/>
								<span className="flex items-center gap-1.5 text-blue-400">
									<Building2 className="w-4 h-4" />
									Collaborating Companies / Partner Organizations ({selectedCompanies.length})
								</span>
							</label>
						</div>

						{hasCompanies && (
							<div className="space-y-3 pt-1">
								{companies.length === 0 ? (
									<p className="text-xs text-slate-500 italic">
										No companies registered in the master catalog. You can add companies under Partners Admin.
									</p>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
										{companies.map((company) => {
											const selectedObj = selectedCompanies.find(
												(c) => c.company_id === company.id,
											);
											const isSelected = !!selectedObj;

											return (
												<div
													key={company.id}
													className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
														isSelected
															? "bg-blue-500/10 border-blue-500/50 text-white"
															: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
													}`}
												>
													<label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
														<input
															type="checkbox"
															checked={isSelected}
															onChange={() => handleToggleCompany(company.id)}
															className="rounded border-slate-700 text-blue-500 focus:ring-blue-500"
														/>
														<span className="truncate font-medium text-slate-200">
															{company.name}
														</span>
													</label>

													{isSelected && (
														<select
															value={selectedObj?.role || "Partner"}
															onChange={(e) =>
																handleCompanyRoleChange(company.id, e.target.value)
															}
															className="bg-slate-950 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 text-blue-300 outline-none"
														>
															<option value="Partner">Partner</option>
															<option value="Host">Host</option>
															<option value="Co-Organizer">Co-Organizer</option>
															<option value="Sponsor">Sponsor</option>
														</select>
													)}
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}
					</div>

					{/* 7. Description */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Event Description
						</label>
						<textarea
							name="description"
							rows={3}
							defaultValue={event?.description || ""}
							placeholder="Provide detailed information regarding the session agenda, takeaways, target audience, registration links, etc."
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none resize-none"
						/>
					</div>

					{/* 8. Image Gallery Uploader */}
					<ImageGalleryUploader
						name="images"
						initialImages={event?.images || []}
						maxImages={6}
					/>

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
							className="bg-gradient-to-r from-[#EE7929] to-[#d66518] hover:from-[#d66518] hover:to-[#c05510] text-white font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#EE7929]/20"
						>
							{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
							{isEdit ? "Update Modular Event" : "Create Modular Event"}
						</Button>
					</div>
				</form>
			</div>

			{/* Inline Quick Series Creation Modal */}
			<SeriesModal
				isOpen={seriesModalOpen}
				onClose={() => setSeriesModalOpen(false)}
				cycles={cycles}
				defaultCycleId={selectedCycleId}
				existingSeries={seriesList}
				onSuccess={(newSeries) => {
					if (newSeries) {
						setSeriesList((prev) => [...prev, newSeries]);
						setSeriesId(newSeries.id);
					}
					onSuccess();
				}}
			/>
		</div>
	);
}
