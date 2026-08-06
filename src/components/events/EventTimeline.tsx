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
	type EventWithContext,
	getEventsByCategory,
	CATEGORY_CONFIGS,
} from "@/data/events";

interface EventTimelineProps {
	/** The category id to display (maps to EventCategory.id in CATEGORY_CONFIGS) */
	selectedCategory: string;
}

/**
 * Renders a timeline of events for a single category.
 *
 * Events are flattened across all StudPro versions, filtered by category,
 * and grouped by year (descending). Within each year, events are further
 * grouped by their original event series title (sub-category).
 *
 * Each sub-category renders its events in a single horizontal row using
 * a carousel. When all events fit within the viewport, no scrolling is
 * needed. When events overflow, prev/next navigation buttons appear
 * for horizontal sliding.
 *
 * @param selectedCategory - The category id from CATEGORY_CONFIGS to display
 */
export function EventTimeline({ selectedCategory }: EventTimelineProps) {
	// Fetch the category configuration for display labels
	const categoryConfig = CATEGORY_CONFIGS.find(
		(c) => c.id === selectedCategory,
	);

	// Get all events for this category, sorted by year desc
	const categoryEvents = getEventsByCategory(selectedCategory);

	// Group events by year (descending)
	const eventsByYear = new Map<number, EventWithContext[]>();
	for (const event of categoryEvents) {
		const existing = eventsByYear.get(event.versionYear) || [];
		existing.push(event);
		eventsByYear.set(event.versionYear, existing);
	}

	const sortedYears = Array.from(eventsByYear.keys()).sort((a, b) => b - a);

	/**
	 * Renders all events in a sub-category as a single horizontal row.
	 * Always uses a carousel so events stay on one line — when they overflow
	 * the viewport, the user scrolls horizontally. Nav buttons appear only
	 * when scrolling is actually needed.
	 */
	function renderEventGroup(events: EventWithContext[]) {
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

			{/* Events by year */}
			{categoryEvents.length > 0 ? (
				<div className="space-y-16">
					{sortedYears.map((year) => {
						const yearEvents = eventsByYear.get(year) || [];

						// Group year events by series title (sub-category)
						const bySeries = new Map<string, EventWithContext[]>();
						for (const event of yearEvents) {
							const existing = bySeries.get(event.seriesTitle) || [];
							existing.push(event);
							bySeries.set(event.seriesTitle, existing);
						}

						return (
							<div key={year}>
								{/* Year divider */}
								<div className="flex items-center gap-4 mb-8">
									<div className="h-px flex-1 bg-secondary/20" />
									<span className="text-lg font-semibold text-secondary whitespace-nowrap">
										{year}
									</span>
									<div className="h-px flex-1 bg-secondary/20" />
								</div>

								{/* Sub-category (series) groups within year */}
								<div className="space-y-12">
									{Array.from(bySeries.entries()).map(([seriesTitle, seriesEvents]) => (
										<div key={seriesTitle} className="relative">
											{/* Timeline sidebar with icon */}
											<div className="relative ml-16">
												{/* Vertical timeline line */}
												<div className="absolute left-0 top-8 bottom-0 w-0.5 bg-secondary/30" />

												{/* Series header */}
												<div className="relative mb-6">
													<div className="absolute -left-5 z-10">
														<div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-md">
															<svg
																width="20"
																height="20"
																fill="currentColor"
																className="text-white"
																viewBox="0 0 16 16"
															>
																<path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z" />
															</svg>
														</div>
													</div>

													<div className="ml-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
														<h3 className="text-2xl font-semibold text-black">
															{seriesTitle}
														</h3>
													</div>
												</div>

												{/* Events in this sub-category — single row, scrolls if overflow */}
												<div className="ml-8">
													{renderEventGroup(seriesEvents)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				/* Empty state when no events exist for this category */
				<div className="text-center py-16">
					<div className="text-secondary mb-4">
						<svg
							className="w-16 h-16 mx-auto"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-black mb-2">
						No events found
					</h3>
					<p className="text-primary">
						No events found in this category yet.
					</p>
				</div>
			)}
		</div>
	);
}

/**
 * Renders events in a single horizontal row using Embla carousel.
 *
 * Event cards have responsive widths (narrower on mobile, wider on desktop)
 * and sit side-by-side in one row. When cards overflow the viewport,
 * prev/next navigation buttons appear for horizontal scrolling.
 * When all cards fit, the buttons are hidden.
 *
 * @param events - The events to display in the carousel row
 */
function EventCarousel({ events }: { events: EventWithContext[] }) {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	/**
	 * Callback fired by Embla whenever the carousel re-initializes
	 * or the user scrolls. Updates the scroll-state flags so nav
	 * buttons appear only when there's something to scroll to.
	 */
	function onSelect(api: CarouselApi) {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}

	return (
		<div className="relative">
			<Carousel
				opts={{ align: "start", loop: false, dragFree: true }}
				setApi={(api) => {
					setCarouselApi(api);
					if (api) {
						onSelect(api);
						api.on("reInit", onSelect);
						api.on("select", onSelect);
					}
				}}
				className="w-full"
			>
				<CarouselContent>
					{events.map((event, idx) => (
						/*
						 * Responsive carousel items:
						 * - mobile: ~260px wide card
						 * - sm: ~300px wide card
						 * - md+: ~340px wide card
						 *
						 * Cards sit side-by-side in a single row.
						 * When they overflow, the user drags/clicks to scroll.
						 */
						<CarouselItem
							key={idx}
							className="basis-[260px] sm:basis-[300px] md:basis-[340px] pl-4"
						>
							<EventCard session={event} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Navigation buttons — only visible when scrolling is possible */}
			{(canScrollPrev || canScrollNext) && (
				<div className="flex justify-center gap-2 mt-6">
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-full shadow-md"
						onClick={() => carouselApi?.scrollPrev()}
						disabled={!canScrollPrev}
						aria-label="Previous events"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-full shadow-md"
						onClick={() => carouselApi?.scrollNext()}
						disabled={!canScrollNext}
						aria-label="Next events"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
