"use client";

import { useState } from "react";
import { EventCard } from "./EventCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	getEventsByCategory,
	CATEGORY_CONFIGS,
} from "@/data/events";

interface EventTimelineProps {
	selectedCategory: string;
	allEvents?: any[];
}

export function EventTimeline({
	selectedCategory,
	allEvents,
}: EventTimelineProps) {
	const categoryConfig = CATEGORY_CONFIGS.find(
		(c) => c.id === selectedCategory,
	);

	// Filter events for this category
	let categoryEvents: any[] = [];
	if (allEvents && allEvents.length > 0) {
		categoryEvents = allEvents.filter(
			(e) => e.category?.toLowerCase() === selectedCategory.toLowerCase(),
		);
	} else {
		categoryEvents = getEventsByCategory(selectedCategory);
	}

	// Group events by year (descending)
	const eventsByYear = new Map<number, any[]>();
	for (const event of categoryEvents) {
		const year = event.cycle?.year || event.versionYear || new Date(event.event_date || event.date || "2026-01-01").getFullYear();
		const existing = eventsByYear.get(year) || [];
		existing.push(event);
		eventsByYear.set(year, existing);
	}

	const sortedYears = Array.from(eventsByYear.keys()).sort((a, b) => b - a);

	function renderEventGroup(events: any[]) {
		return <EventCarousel events={events} />;
	}

	return (
		<div className="max-w-7xl mx-auto py-8">
			{/* Category header */}
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold text-black mb-4">
					<span className="text-primary">Stud</span>
					<span className="text-secondary me-2">Pro</span>
					<span className="text-black">{categoryConfig?.label || selectedCategory}</span>
				</h1>
				{categoryConfig?.description && (
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						{categoryConfig.description}
					</p>
				)}
			</div>

			{/* Timeline */}
			<div className="relative">
				{sortedYears.length === 0 ? (
					<div className="py-12 text-center text-slate-500">
						No events scheduled in this category yet.
					</div>
				) : (
					sortedYears.map((year, index) => {
						const yearEvents = eventsByYear.get(year) || [];
						const isLeft = index % 2 === 0;

						// Sub-group by series title if present
						const eventsBySeries = new Map<string, any[]>();
						for (const event of yearEvents) {
							const seriesTitle = event.series?.title || event.seriesTitle || "Special Sessions";
							const existing = eventsBySeries.get(seriesTitle) || [];
							existing.push(event);
							eventsBySeries.set(seriesTitle, existing);
						}

						return (
							<div key={year} className="mb-24 relative">
								{/* Year badge */}
								<div className="flex justify-center mb-12">
									<div className="bg-primary text-white font-bold px-6 py-2 rounded-full shadow-lg text-lg">
										{year}
									</div>
								</div>

								{/* Series within this year */}
								{Array.from(eventsBySeries.entries()).map(
									([seriesTitle, seriesEvents], sIdx) => (
										<div key={`${year}-${seriesTitle}-${sIdx}`} className="mb-12">
											<h3 className="text-xl font-bold text-secondary mb-6 text-center">
												{seriesTitle}
											</h3>
											{renderEventGroup(seriesEvents)}
										</div>
									),
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

function EventCarousel({ events }: { events: any[] }) {
	const [api, setApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const onSelect = () => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	};

	return (
		<div className="relative w-full px-4 sm:px-12">
			<Carousel
				setApi={(cApi) => {
					setApi(cApi);
					if (cApi) {
						cApi.on("select", onSelect);
						cApi.on("reInit", onSelect);
					}
				}}
				opts={{
					align: "start",
					loop: false,
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-4">
					{events.map((event, idx) => (
						<CarouselItem
							key={`${event.id || event.title || "event"}-${idx}`}
							className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
						>
							<EventCard session={event} />
						</CarouselItem>
					))}
				</CarouselContent>

				{canScrollPrev && (
					<Button
						variant="outline"
						size="icon"
						className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border-primary/20 hover:bg-primary hover:text-white z-10"
						onClick={() => api?.scrollPrev()}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
				)}

				{canScrollNext && (
					<Button
						variant="outline"
						size="icon"
						className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border-primary/20 hover:bg-primary hover:text-white z-10"
						onClick={() => api?.scrollNext()}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				)}
			</Carousel>
		</div>
	);
}
