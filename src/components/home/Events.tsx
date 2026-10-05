"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { events as staticEvents } from "@/data/events";

export const Events = () => {
	const [latestEvents, setLatestEvents] = useState<any[]>([]);
	const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi>();

	useEffect(() => {
		// Fallback events
		const fallbackList: any[] = [];
		staticEvents.forEach((version) => {
			version.eventSeries.forEach((series) => {
				series.events.forEach((event) => {
					fallbackList.push({
						...event,
						versionTitle: version.version,
						seriesTitle: series.title,
					});
				});
			});
		});

		fallbackList.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
		setLatestEvents(fallbackList.slice(0, 3));
	}, []);

	return (
		<div className="py-40 flex justify-center items-center h-[140vh]">
			<div className="flex flex-col justify-center items-center py-8 md:py-16 px-4 md:px-6 w-full">
				{/* Latest Events Section */}
				{latestEvents.length > 0 && (
					<div className="w-full max-w-7xl mb-8 md:mb-16">
						<div className="mb-6 md:mb-16 text-center">
							<h2 className="text-2xl md:text-3xl lg:text-4xl uppercase text-secondary font-bold mb-4 md:mb-6">
								Latest Events
							</h2>
							<p className="text-base md:text-lg mx-auto text-gray-600 px-2">
								Explore our most recent events where innovation meets
								inspiration. <br className="hidden md:block" />
								Catch up with what you missed and stay tuned for more exciting
								opportunities.
							</p>
						</div>
						{/* Mobile Carousel */}
						<div className="md:hidden">
							<Carousel
								opts={{
									loop: true,
									align: "center",
								}}
								plugins={[
									Autoplay({
										delay: 5000,
										stopOnInteraction: true,
									}),
								]}
								className="w-full items-center"
								setApi={setMobileCarouselApi}
							>
								<CarouselContent className="-ml-2">
									{latestEvents.map((event, idx) => (
										<CarouselItem
											key={`mobile-latest-${idx}`}
											className="flex justify-center"
										>
											<EventCard session={event} />
										</CarouselItem>
									))}
								</CarouselContent>
								<div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md"
										onClick={() => mobileCarouselApi?.scrollPrev()}
									>
										<ChevronLeft className="h-4 w-4" />
										<span className="sr-only">Previous slide</span>
									</Button>
								</div>
								<div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md"
										onClick={() => mobileCarouselApi?.scrollNext()}
									>
										<ChevronRight className="h-4 w-4" />
										<span className="sr-only">Next slide</span>
									</Button>
								</div>
							</Carousel>
						</div>

						{/* Desktop Grid */}
						<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{latestEvents.map((event, idx) => (
								<div key={`desktop-latest-${idx}`} className="flex justify-center">
									<EventCard session={event} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
