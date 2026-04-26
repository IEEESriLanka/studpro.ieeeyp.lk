import { EventCard } from "./EventCard";
import type { StudProVersion, Event, EventSeries } from "@/data/events";

interface EventTimelineProps {
	events: StudProVersion[];
	selectedYear?: number;
}

export function EventTimeline({ events, selectedYear }: EventTimelineProps) {
	// Filter events by selected year or show all if no year selected
	const filteredEvents = selectedYear
		? events.filter((event) => event.year === selectedYear)
		: events;

	// Sort events by year to ensure proper timeline order
	const sortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year);

	// Helper function to determine icon type
	const getEventIcon = () => {
		// Icon for event series
		return (
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
		);
	};

	return (
		<div className="max-w-7xl mx-auto py-8">
			{/* Header */}
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold text-black mb-4">
					<span className="text-primary">Stud</span>
					<span className="text-secondary me-4">
						Pro{" "}
						{sortedEvents
							.map((studproVersion) => studproVersion.version.split("o")[1].trim())
							.join(", ")}
					</span>
					EVENTS
				</h1>
			</div>

			{/* Version Groups */}
			<div>
				{sortedEvents.length > 0 ? (
					sortedEvents.map((studProVersion) => (
						<div key={studProVersion.version} className="mb-16 last:mb-0">
							{/* Event Series */}
							<div className="space-y-12">
								{studProVersion.eventSeries.map((series, index) => (
									<div
										key={`${studProVersion.version}-${series.title}`}
										className="relative"
									>
										{/* Category sidebar with vertical line */}
										<div className="relative ml-16">
											{/* Main timeline line */}
											<div className="absolute left-0 top-8 bottom-0 w-0.5 bg-secondary"></div>

											{/* Category header with icon */}
											<div className="relative mb-6">
												{/* Timeline icon */}
												<div className="absolute -left-5 z-10">
													{getEventIcon()}
												</div>

												<div className="ml-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
													<h3 className="text-2xl font-semibold text-black">
														{series.title}
													</h3>
													{series.description && (
														<p className="text-gray-600 text-sm mt-1">
															{series.description}
														</p>
													)}
												</div>
											</div>

											{/* Events in this series */}
											<div className="ml-8">
												<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
													{series.events.map((session) => (
														<div key={session.title} className="group">
															<EventCard
																session={session}
																version={studProVersion.version}
															/>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))
				) : (
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
							{selectedYear
								? `No events found for ${selectedYear}`
								: "No events available"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
