import { StatCard } from "@/components/home/StatCard";
import { events, StudProVersion } from "@/data/events";

export interface StatsData {
	type: string;
	value: number;
	icon?: string;
}

export const Stats = () => {
	// Get the current year and find the most recent version
	const currentYear = new Date().getFullYear();
	const previousYear = currentYear - 1;

	// Find the version from the previous year, or use the last one if not found
	const latestVersion: StudProVersion =
		events.find((event) => event.year === previousYear) ||
		events.reduce(
			(latest, current) => (current.year > latest.year ? current : latest),
			events[0],
		);

	const statsData: StatsData[] = [
		{ type: "Universities", value: 21, icon: "GraduationCap" },
		{ type: "Registrants", value: 3000, icon: "Users" },
		{ type: "Streams", value: 10, icon: "LayoutTemplate" },
		{ type: "Speakers", value: 16, icon: "MicVocal" },
	];
	return (
		<div className="h-screen sm:h-[80vh] flex flex-col justify-center items-center gap-4 bg-transparent px-4 sm:px-8">
			<h3 className="text-xl sm:text-2xl font-semibold text-white my-16 text-center">
				<p>We have conducted StudPro for many Years. We ended</p>
				<p className="mt-4 text-5xl font-bold">
					{latestVersion.version} With Massive Numbers.
				</p>
			</h3>
			<div className="flex flex-col sm:flex-row justify-center items-center gap-8 w-full max-w-6xl">
				{statsData.map((stat, index) => (
					<StatCard
						key={index}
						stat={stat}
						cardStyle={index % 2 === 0 ? "bg-transparent" : "bg-white"}
						textStyle={index % 2 === 0 ? "text-white" : "text-primary"}
					/>
				))}
			</div>
		</div>
	);
};
