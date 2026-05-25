"use client";

import { events } from "@/data/events";
import { Event, StudProVersion } from "@/data/events";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";

interface LatestEvent extends Event {
	versionTitle: string;
	seriesTitle: string;
}

const getLatestEvents = (
	eventData: StudProVersion[],
	limit = 6,
): LatestEvent[] => {
	const today = new Date();
	const latestEvents: LatestEvent[] = [];

	eventData.forEach((version) => {
		version.eventSeries.forEach((series) => {
			series.events.forEach((event) => {
				const eventDate = new Date(event.date);
				if (eventDate <= today) {
					latestEvents.push({
						...event,
						versionTitle: version.version,
						seriesTitle: series.title,
					});
				}
			});
		});
	});

	latestEvents.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	return latestEvents.slice(0, limit);
};

export const Events = () => {
	const [latestEvents, setLatestEvents] = useState<LatestEvent[]>([]);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		dragFree: true,
		align: "start",
		containScroll: "trimSnaps",
	});
	const [progress, setProgress] = useState(0);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	useEffect(() => {
		setLatestEvents(getLatestEvents(events));
	}, []);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		const onScroll = () => {
			setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
		};
		const onSelect = () => {
			setCanPrev(emblaApi.canScrollPrev());
			setCanNext(emblaApi.canScrollNext());
		};
		onScroll();
		onSelect();
		emblaApi.on("scroll", onScroll);
		emblaApi.on("reInit", onScroll);
		emblaApi.on("reInit", onSelect);
		emblaApi.on("select", onSelect);
		return () => {
			emblaApi.off("scroll", onScroll);
			emblaApi.off("reInit", onScroll);
			emblaApi.off("reInit", onSelect);
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi]);

	if (latestEvents.length === 0) {
		return null;
	}

	return (
		<section
			id="events"
			className="bg-background py-32 lg:py-40 border-t border-border"
		>
			<div className="max-w-[1400px] mx-auto px-6 lg:px-12">
				{/* Header */}
				<div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
					<div className="flex flex-col gap-5 max-w-[42rem]">
						<span className="eyebrow">Recent events</span>
						<h2
							className="font-display text-foreground leading-[0.9]"
							style={{
								fontSize: "clamp(3rem, 6.5vw, 5.5rem)",
								letterSpacing: "0.015em",
							}}
						>
							Where{" "}
							<em className="font-serif-italic text-[var(--primary)] not-italic">
								<span className="italic">we</span>
							</em>{" "}
							gather.
						</h2>
					</div>

					<div className="flex items-center gap-6 md:pb-3">
						<Link
							href="/events"
							className="link-rule text-[13px] uppercase tracking-[0.22em] text-foreground font-medium"
						>
							View all events
							<ArrowUpRight className="w-4 h-4" />
						</Link>

						<div className="hidden sm:flex items-center gap-2">
							<button
								type="button"
								onClick={scrollPrev}
								disabled={!canPrev}
								aria-label="Previous events"
								className="w-9 h-9 flex items-center justify-center bg-card border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<ChevronLeft className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={scrollNext}
								disabled={!canNext}
								aria-label="Next events"
								className="w-9 h-9 flex items-center justify-center bg-card border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Carousel */}
				<div className="relative mt-16">
					<div
						className="overflow-hidden -mx-6 px-6 lg:-mx-12 lg:px-12"
						ref={emblaRef}
					>
						<div className="flex gap-6">
							{latestEvents.map((event, idx) => (
								<div
									key={`latest-${idx}`}
									className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0"
								>
									<EventCard
										session={event}
										version={event.versionTitle}
										seriesTitle={event.seriesTitle}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Right-edge fade mask suggesting more content */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-0 right-0 bottom-0 w-16 lg:w-24"
						style={{
							background:
								"linear-gradient(270deg, var(--background) 0%, rgba(250,250,247,0) 100%)",
						}}
					/>
				</div>

				{/* Progress bar */}
				<div className="mt-10 flex items-center gap-6">
					<div className="relative h-px flex-1 bg-border overflow-hidden">
						<span
							className="absolute inset-y-0 left-0 bg-[var(--primary)] transition-[width] duration-200 ease-out"
							style={{
								width: `${Math.max(8, progress * 100)}%`,
							}}
						/>
					</div>
					<span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground tabular-nums">
						{String(Math.round(progress * 100)).padStart(2, "0")}
						<span className="mx-1 text-muted-foreground/40">/</span>100
					</span>
				</div>
			</div>
		</section>
	);
};
