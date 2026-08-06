import { Card, CardContent } from "@/components/ui/card";
// import { /* Carousel removed - show only first image */ } from "@/components/ui/carousel";
import type { Event } from "@/data/events";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsCalendar } from "react-icons/bs";

interface EventCardProps {
	session: Event;
}

export function EventCard({ session }: EventCardProps) {
	const router = useRouter();

	/**
	 * Navigates to the event detail page using the event's category
	 * and URL-encoded title. The category id is already a URL-safe slug
	 * (e.g. "career-fairs", "cv-clinics", "industry-visits").
	 */
	const handleCardClick = () => {
		const encodedTitle = encodeURIComponent(session.title);
		router.push(`/events/${session.category}/${encodedTitle}`);
	};

	return (
		<Card
			className="h-full w-full max-w-[350px] transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white cursor-pointer overflow-hidden pt-0 mx-auto"
			onClick={handleCardClick}
		>
			{session.images && session.images.length > 0 && (
				<div className="w-full aspect-[4/5] relative overflow-hidden">
						<Image
							src={session.images[0]}
							alt={session.title}
							width={350}
							height={200}
							className="object-cover w-full h-full"
						/>
				</div>
			)}
			<CardContent className="px-6">
				<div className="space-y-4 flex flex-col items-center text-center">
					<div className="flex flex-col items-center">
						<h3 className="text-xl uppercase tracking-wider font-semibold text-black mb-2">
							{session.title}
						</h3>
						<p className="text-sm text-secondary leading-relaxed">
							{session.topic}
						</p>
						<div className="flex items-center mt-2 text-xs text-primary">
							<BsCalendar className="h-3.5 w-3.5 mr-1" />
							<span>{session.date}</span>
						</div>
						{session.description && (
							<p className="text-xs text-black/80 mt-2 leading-relaxed line-clamp-3">
								{session.description}
							</p>
						)}
					</div>

					<div className="pt-4 border-t border-secondary/20 w-full">
						<div className="space-y-1 flex flex-col items-center">
							<p className="font-medium text-black">{session.speaker.name}</p>
							<p className="text-sm">{session.speaker.title}</p>
							<p className="text-sm font-medium">{session.speaker.company}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
