import { notFound } from "next/navigation";
import Image from "next/image";
import { getEventByCategoryAndTitle, CATEGORY_CONFIGS } from "@/data/events";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";

/**
 * Individual event detail page at /events/[category]/[title].
 *
 * Looks up the event by matching the URL category slug (e.g. "career-fairs")
 * and the decoded event title against the flattened events data.
 * Displays the full event information including images, description, speaker,
 * and venue. Shows the category label as context instead of the old StudPro version.
 *
 * @param params.category - URL-safe category id from CATEGORY_CONFIGS
 * @param params.title   - URI-encoded event title
 */
export default async function EventPage(props: {
	params: Promise<{ category: string; title: string }>;
}) {
	const params = await props.params;
	const decodedTitle = decodeURIComponent(params.title);

	// Find the event by category id and decoded title across all versions
	const found = getEventByCategoryAndTitle(params.category, decodedTitle);

	// If no event matches, render the not-found page
	if (!found) {
		return notFound();
	}

	// Resolve the category display label for the header
	const categoryConfig = CATEGORY_CONFIGS.find(
		(c) => c.id === params.category,
	);

	return (
		<div className="min-h-screen py-32">
			<div className="max-w-5xl mx-auto px-4">
				{/* Navigation back to events */}
				<div className="mb-8">
					<BackButton />
				</div>

				{/* Event header — shows category label instead of version */}
				<div className="mb-10">
					<div className="text-sm text-secondary/70 mb-2">
						{categoryConfig?.label || params.category} • {found.versionName} •{" "}
						{found.date}
					</div>
					<h1 className="text-4xl font-bold text-black mb-3">
						{found.title}
					</h1>
					<div className="flex items-center gap-2 text-secondary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
							<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
						</svg>
						<span>{found.time}</span>
					</div>
				</div>

				{/* Event Images */}
				{found.images && found.images.length > 0 && (
					<div className="mb-10">
						<div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl">
							<Image
								src={found.images[0]}
								alt={found.title}
								width={1200}
								height={600}
								className="object-cover w-full h-full"
								priority
							/>
						</div>

						{/* Additional images */}
						{found.images.length > 1 && (
							<div className="grid grid-cols-3 gap-4 mt-4">
								{found.images.slice(1).map((image, idx) => (
									<div
										key={idx}
										className="relative h-[120px] overflow-hidden rounded-lg"
									>
										<Image
											src={image}
											alt={`${found.title} - image ${idx + 2}`}
											width={400}
											height={300}
											className="object-cover w-full h-full"
										/>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Event details */}
				<div className="grid md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-6">
						<Card className="p-6 bg-white">
							<h2 className="text-xl font-semibold text-black mb-4">
								About this event
							</h2>
							<div className="space-y-4">
								<div>
									<h3 className="text-lg font-medium text-black mb-2">Topic</h3>
									<p className="text-secondary">{found.topic}</p>
								</div>

								{found.description && (
									<div>
										<h3 className="text-lg font-medium text-black mb-2">
											Description
										</h3>
										<p className="text-secondary leading-relaxed">
											{found.description}
										</p>
									</div>
								)}
							</div>
						</Card>
					</div>

					{/* Sidebar with speaker and venue info */}
					<div className="space-y-6">
						<Card className="p-6 bg-white">
							<h3 className="text-lg font-semibold text-black mb-4">Speaker</h3>
							<div className="space-y-2">
								<p className="font-medium text-black">{found.speaker.name}</p>
								<p className="text-sm text-secondary">{found.speaker.title}</p>
								<p className="text-sm font-medium text-secondary">
									{found.speaker.company}
								</p>
							</div>
						</Card>

						<Card className="p-6 bg-white">
							<h3 className="text-lg font-semibold text-black mb-4">Venue</h3>
							<p className="text-secondary">{found.venue}</p>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
