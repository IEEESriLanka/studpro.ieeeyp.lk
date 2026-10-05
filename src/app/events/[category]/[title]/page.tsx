import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublicEventBySlug, getSeriesEvents, type PublicSpeaker } from "@/lib/data/events";
import { CATEGORY_CONFIGS } from "@/data/events";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { SeriesMilestoneTimeline } from "@/components/events/SeriesMilestoneTimeline";
import {
	MapPin,
	Video,
	Globe,
	ExternalLink,
	User,
	Users,
	Building2,
	Calendar,
	Clock,
	Layers,
} from "lucide-react";

export const revalidate = 3600; // 1-hour ISR revalidation

export default async function EventPage(props: {
	params: Promise<{ category: string; title: string }>;
}) {
	const params = await props.params;
	const decodedTitle = decodeURIComponent(params.title);

	const found = await getPublicEventBySlug(params.category, decodedTitle);

	if (!found) {
		return notFound();
	}

	const categoryConfig = CATEGORY_CONFIGS.find(
		(c) => c.id === params.category,
	);

	const speakers: PublicSpeaker[] = found.speakers || [];
	const companies = found.companies || [];
	const dateDisplay = found.event_date || (found as any).date || "";
	const versionName = found.cycle?.version || (found as any).versionName || "StudPro";
	const deliveryMode = found.delivery_mode || "physical";

	// Sibling events for series milestone roadmap
	const seriesIdentifier = found.series?.id || found.series?.title;
	const siblingSeriesEvents = seriesIdentifier
		? await getSeriesEvents(seriesIdentifier)
		: [];

	return (
		<div className="min-h-screen py-32 bg-white">
			<div className="max-w-5xl mx-auto px-4">
				{/* Back button */}
				<div className="mb-8">
					<BackButton />
				</div>

				{/* Event Header */}
				<div className="mb-8">
					<div className="flex flex-wrap items-center gap-2 text-sm text-secondary/80 mb-3">
						<span className="font-semibold text-slate-800">
							{categoryConfig?.label || params.category}
						</span>
						<span>•</span>
						<span>{versionName}</span>
						<span>•</span>
						<span className="flex items-center gap-1 font-medium text-primary">
							<Calendar className="w-3.5 h-3.5 text-[#EE7929]" />
							{dateDisplay}
						</span>

						{/* Format badge */}
						{deliveryMode === "online" ? (
							<span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
								<Video className="w-3 h-3 text-sky-600" />
								Online Webinar
							</span>
						) : deliveryMode === "hybrid" ? (
							<span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
								<Globe className="w-3 h-3 text-purple-600" />
								Hybrid Session
							</span>
						) : (
							<span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
								<MapPin className="w-3 h-3 text-emerald-600" />
								In-Person Physical Venue
							</span>
						)}
					</div>

					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight mb-4">
						{found.title}
					</h1>

					{/* Time & Series stage subheading */}
					<div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
						{found.time && (
							<div className="flex items-center gap-1.5 font-medium">
								<Clock className="w-4 h-4 text-slate-500" />
								<span>{found.time}</span>
							</div>
						)}

						{found.series_stage && (
							<div className="flex items-center gap-1.5 font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
								<Layers className="w-3.5 h-3.5 text-purple-600" />
								<span>{found.series_stage}</span>
							</div>
						)}
					</div>
				</div>

				{/* Series Milestone Stepper (if part of multi-event series) */}
				{siblingSeriesEvents.length > 1 && found.series && (
					<SeriesMilestoneTimeline
						seriesTitle={found.series.title}
						currentEventId={found.id}
						events={siblingSeriesEvents}
					/>
				)}

				{/* Event Hero Images */}
				{found.images && found.images.length > 0 && (
					<div className="mb-10">
						<div className="relative w-full h-[320px] md:h-[480px] overflow-hidden rounded-3xl shadow-xl bg-slate-100 border border-slate-100">
							<Image
								src={found.images[0]}
								alt={found.title}
								width={1200}
								height={600}
								className="object-cover w-full h-full"
								priority
								unoptimized={found.images[0].startsWith("http")}
							/>
						</div>

						{/* Additional photos gallery */}
						{found.images.length > 1 && (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
								{found.images.slice(1).map((image, idx) => (
									<div
										key={idx}
										className="relative h-[130px] overflow-hidden rounded-2xl bg-slate-100 shadow border border-slate-200"
									>
										<Image
											src={image}
											alt={`${found.title} - photo ${idx + 2}`}
											width={400}
											height={300}
											className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
											unoptimized={image.startsWith("http")}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Main Content Layout */}
				<div className="grid md:grid-cols-3 gap-8">
					{/* Left Column: About & Multi-Speaker Showcase */}
					<div className="md:col-span-2 space-y-8">
						{/* About Event */}
						<Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-6">
							<h2 className="text-xl font-bold text-black border-b border-slate-100 pb-3">
								About this Session
							</h2>

							{found.topic && (
								<div className="space-y-1">
									<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
										Session Topic / Focus
									</h3>
									<p className="text-base font-medium text-slate-800">
										{found.topic}
									</p>
								</div>
							)}

							{found.description && (
								<div className="space-y-2">
									<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
										Detailed Overview
									</h3>
									<p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
										{found.description}
									</p>
								</div>
							)}
						</Card>

						{/* Multi-Speaker Showcase (Conditional on speakers > 0) */}
						{speakers.length > 0 && (
							<Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-6">
								<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
									<Users className="w-5 h-5 text-blue-600" />
									<h2 className="text-xl font-bold text-black">
										{speakers.length === 1 ? "Resource Person" : "Guest Speakers & Facilitators"}
									</h2>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{speakers.map((spk, idx) => (
										<div
											key={`${spk.id || spk.name}-${idx}`}
											className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
										>
											<div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 overflow-hidden relative font-bold text-base">
												{spk.avatar_url ? (
													<Image
														src={spk.avatar_url}
														alt={spk.name}
														fill
														className="object-cover"
													/>
												) : (
													spk.name.charAt(0)
												)}
											</div>

											<div className="space-y-0.5 min-w-0">
												<h4 className="font-bold text-slate-900 text-sm truncate">
													{spk.name}
												</h4>
												{spk.title && (
													<p className="text-xs text-slate-500 truncate">
														{spk.title}
													</p>
												)}
												{spk.company && (
													<p className="text-xs font-semibold text-[#EE7929] truncate">
														{spk.company}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</Card>
						)}
					</div>

					{/* Right Sidebar: Location, Virtual Meeting & Partners */}
					<div className="space-y-6">
						{/* Delivery Format & Location Cards */}
						{(deliveryMode === "online" || deliveryMode === "hybrid") && (
							<Card className="p-6 bg-gradient-to-br from-sky-50 to-white border border-sky-200 shadow-sm rounded-3xl space-y-3">
								<div className="flex items-center gap-2 text-sky-800 font-bold text-base">
									<Video className="w-5 h-5 text-sky-600" />
									<span>Virtual Platform</span>
								</div>
								<p className="text-sm font-semibold text-slate-800">
									{found.venue || "Live via Zoom"}
								</p>
								<p className="text-xs text-slate-500 leading-relaxed">
									This session is conducted online. Platform access details and instructions are shared directly with registered participants.
								</p>
								{found.meeting_url &&
									(found.meeting_url.startsWith("http://") ||
										found.meeting_url.startsWith("https://")) && (
										<a
											href={found.meeting_url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-md shadow-sky-600/20"
										>
											<span>Join Webinar Stream</span>
											<ExternalLink className="w-3.5 h-3.5" />
										</a>
									)}
							</Card>
						)}

						{(deliveryMode === "physical" || deliveryMode === "hybrid") && found.venue && (
							<Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-3">
								<div className="flex items-center gap-2 text-slate-900 font-bold text-base">
									<MapPin className="w-5 h-5 text-emerald-600" />
									<span>Physical Venue</span>
								</div>
								<p className="text-sm text-slate-700 font-medium">
									{found.venue}
								</p>
								{found.map_url && (
									<a
										href={found.map_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
									>
										<span>View on Google Maps</span>
										<ExternalLink className="w-3 h-3" />
									</a>
								)}
							</Card>
						)}

						{/* Collaborating Corporate Partners (Conditional on companies > 0) */}
						{companies.length > 0 && (
							<Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-4">
								<div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
									<Building2 className="w-5 h-5 text-[#EE7929]" />
									<span>Collaborating Partners</span>
								</div>

								<div className="space-y-3">
									{companies.map((comp, cIdx) => (
										<div
											key={`${comp.id || comp.name}-${cIdx}`}
											className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
										>
											<div className="flex items-center gap-3 min-w-0">
												<div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
													{comp.logo_url ? (
														<Image
															src={comp.logo_url}
															alt={comp.name}
															width={36}
															height={36}
															className="object-contain"
															unoptimized={comp.logo_url.startsWith("http")}
														/>
													) : (
														<Building2 className="w-5 h-5 text-slate-400" />
													)}
												</div>
												<div className="truncate">
													<p className="text-xs font-bold text-slate-900 truncate">
														{comp.name}
													</p>
													{comp.role && (
														<span className="text-[10px] text-slate-500 font-medium">
															{comp.role}
														</span>
													)}
												</div>
											</div>

											{comp.web_link && (
												<a
													href={comp.web_link}
													target="_blank"
													rel="noopener noreferrer"
													className="text-slate-400 hover:text-blue-600 p-1 rounded-lg transition-colors shrink-0"
													title={`Visit ${comp.name}`}
												>
													<ExternalLink className="w-3.5 h-3.5" />
												</a>
											)}
										</div>
									))}
								</div>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
