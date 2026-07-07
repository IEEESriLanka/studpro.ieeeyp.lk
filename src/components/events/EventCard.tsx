import { Card, CardContent } from "@/components/ui/card";
// import { /* Carousel removed - show only first image */ } from "@/components/ui/carousel";
import type { Event } from "@/data/events";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsCalendar } from "react-icons/bs";

interface EventCardProps {
	session: Event;
	version?: string;
}

export function EventCard({ session, version }: EventCardProps) {
	const router = useRouter();
	// Get version from context if not provided directly
	const getVersionSlug = () => {
		if (version) {
			return version.replace(/\s+/g, "-");
		}
		return "unknown-version";
	};

	const handleCardClick = () => {
		const versionSlug = getVersionSlug();
		const encodedTitle = encodeURIComponent(session.title);
		router.push(`/events/${versionSlug}/${encodedTitle}`);
	};

	return (
		<Card
			className="h-full w-[350px] transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white cursor-pointer overflow-hidden pt-0"
			onClick={handleCardClick}
		>
			{session.images && session.images.length > 0 && (
				<div className="w-full h-[350px] relative overflow-hidden">
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
