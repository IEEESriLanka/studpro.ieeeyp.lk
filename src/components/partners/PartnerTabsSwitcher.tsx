"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnerTimeline } from "@/components/partners/PartnerTimeline";
import { partnersByYear as staticPartnersByYear } from "@/data/partners";

interface PartnerTabsSwitcherProps {
	partnersByYear?: any[];
}

export function PartnerTabsSwitcher({
	partnersByYear = staticPartnersByYear,
}: PartnerTabsSwitcherProps) {
	const partners = partnersByYear;
	const yearVersionMap: { [key: number]: string } = {};
	partners.forEach((yearGroup) => {
		yearVersionMap[yearGroup.year] = yearGroup.version;
	});

	// Get unique years from partners and sort them descending (latest edition first)
	const uniqueYears = [
		...new Set(partners.map((yearGroup) => yearGroup.year)),
	].sort((a, b) => b - a);

	if (uniqueYears.length === 0) {
		return (
			<div className="py-12 text-center text-slate-500">
				No corporate partners published yet.
			</div>
		);
	}

	return (
		<div className="w-full">
			<Tabs defaultValue={uniqueYears[0]?.toString()} className="w-full">
				<TabsList
					className="grid w-full mb-8 bg-primary/30"
					style={{
						gridTemplateColumns: `repeat(${uniqueYears.length}, minmax(0, 1fr))`,
					}}
				>
					{uniqueYears.map((year) => (
						<TabsTrigger
							key={year}
							value={year.toString()}
							className="text-sm font-medium bg-none text-secondary data-[state=active]:text-white data-[state=active]:bg-primary"
						>
							{yearVersionMap[year]}
						</TabsTrigger>
					))}
				</TabsList>

				{uniqueYears.map((year) => (
					<TabsContent key={year} value={year.toString()} className="mt-0">
						<PartnerTimeline partnersByYear={partners} selectedYear={year} />
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
