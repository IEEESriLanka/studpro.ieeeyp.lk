"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsCalendar } from "react-icons/bs";
import { MapPin, Video, Globe, Users, Layers } from "lucide-react";
import type { DeliveryMode } from "@/lib/constants/events";
import { shouldBeUnoptimized } from "@/lib/utils/image";

interface EventCardProps {
	session: any;
}

export function EventCard({ session }: EventCardProps) {
	const router = useRouter();

	const handleCardClick = () => {
		const category = session.category || "workshops";
		const encodedTitle = encodeURIComponent(session.title);
		router.push(`/events/${category}/${encodedTitle}`);
	};

	const dateDisplay = session.event_date || session.date || "";
	const speakers = session.speakers || (session.speaker ? [session.speaker] : []);
	const firstImage = session.images && session.images.length > 0 ? session.images[0] : null;
	const deliveryMode: DeliveryMode = session.delivery_mode || "physical";
	const seriesTitle = session.series?.title || session.seriesTitle;

	return (
		<Card
			className="h-full w-full max-w-[350px] transition-all duration-200 hover:shadow-xl hover:scale-[1.02] bg-white cursor-pointer overflow-hidden pt-0 mx-auto flex flex-col justify-between group"
			onClick={handleCardClick}
		>
			<div className="relative">
				{firstImage ? (
					<div className="w-full aspect-[4/5] relative overflow-hidden bg-slate-100">
						<Image
							src={firstImage}
							alt={session.title}
							width={350}
							height={200}
							className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
							sizes="(max-width: 768px) 100vw, 350px"
							unoptimized={shouldBeUnoptimized(firstImage)}
						/>
						{/* Delivery badge overlay */}
						<div className="absolute top-3 left-3 flex flex-col gap-1.5">
							{deliveryMode === "online" ? (
								<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-950/80 backdrop-blur-md text-sky-300 border border-sky-500/40 flex items-center gap-1 shadow-md">
									<Video className="w-3 h-3 text-sky-400" />
									Webinar
								</span>
							) : deliveryMode === "hybrid" ? (
								<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950/80 backdrop-blur-md text-purple-300 border border-purple-500/40 flex items-center gap-1 shadow-md">
									<Globe className="w-3 h-3 text-purple-400" />
									Hybrid
								</span>
							) : (
								<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-md">
									<MapPin className="w-3 h-3 text-emerald-400" />
									In-Person
								</span>
							)}
						</div>
					</div>
				) : (
					<div className="p-4 bg-slate-50 border-b flex items-center justify-between">
						{deliveryMode === "online" ? (
							<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-700 flex items-center gap-1">
								<Video className="w-3 h-3" />
								Online Webinar
							</span>
						) : deliveryMode === "hybrid" ? (
							<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
								<Globe className="w-3 h-3" />
								Hybrid
							</span>
						) : (
							<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
								<MapPin className="w-3 h-3" />
								Physical Venue
							</span>
						)}
					</div>
				)}
			</div>

			<CardContent className="px-6 py-5 flex-1 flex flex-col justify-between">
				<div className="space-y-3 flex flex-col items-center text-center">
					<div className="flex flex-col items-center w-full">
						{/* Series stage tag if applicable */}
						{(seriesTitle || session.series_stage) && (
							<div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 mb-1">
								<Layers className="w-3 h-3" />
								<span>
									{seriesTitle || "Series"}
									{session.series_stage ? ` • ${session.series_stage}` : ""}
								</span>
							</div>
						)}

						<h3 className="text-xl uppercase tracking-wider font-semibold text-black mb-1 line-clamp-2">
							{session.title}
						</h3>

						{session.topic && (
							<p className="text-sm text-secondary leading-relaxed line-clamp-1">
								{session.topic}
							</p>
						)}

						{dateDisplay && (
							<div className="flex items-center mt-2 text-xs text-primary font-medium">
								<BsCalendar className="h-3.5 w-3.5 mr-1.5" />
								<span>{dateDisplay}</span>
							</div>
						)}

						{deliveryMode === "online" ? (
							<div className="flex items-center gap-1 text-xs text-sky-700 mt-1 truncate max-w-full">
								<Video className="w-3 h-3 shrink-0 text-sky-500" />
								<span className="truncate">{session.venue || "Live via Zoom"}</span>
							</div>
						) : session.venue ? (
							<div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate max-w-full">
								<MapPin className="w-3 h-3 shrink-0 text-slate-400" />
								<span className="truncate">{session.venue}</span>
							</div>
						) : null}

						{session.description && (
							<p className="text-xs text-black/80 mt-2 leading-relaxed line-clamp-3">
								{session.description}
							</p>
						)}
					</div>
				</div>

				{/* Speakers Footer */}
				{speakers.length > 0 && (
					<div className="pt-3 mt-4 border-t border-slate-100 w-full flex flex-col items-center text-center">
						<div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
							<Users className="w-3.5 h-3.5 text-blue-600" />
							<span>
								{speakers.length === 1
									? speakers[0].name
									: `${speakers[0].name} +${speakers.length - 1} more`}
							</span>
						</div>
						{speakers[0].company && (
							<span className="text-[11px] text-[#EE7929] font-medium">
								{speakers[0].company}
							</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
