import { PartnerCard } from "./PartnerCard";
import {
	calculatePartnerYears,
	getPartnerByPartnerRecord,
	PartnersByYear,
} from "@/data/partners";

interface PartnerTimelineProps {
	partnersByYear: PartnersByYear[];
	selectedYear?: number;
}

export function PartnerTimeline({
	partnersByYear,
	selectedYear,
}: PartnerTimelineProps) {
	// Filter partners by selected year or show all if no year selected
	const filteredPartners = selectedYear
		? partnersByYear.filter((yearGroup) => yearGroup.year === selectedYear)
		: partnersByYear;
	// Sort by year to ensure proper timeline order
	const sortedPartners = [...filteredPartners].sort((a, b) => a.year - b.year); // Define level priority for sorting: Platinum > Gold > Silver > Bronze > No Level
	const levelOrder: Record<string, number> = {
		Platinum: 1,
		Gold: 2,
		Silver: 3,
		Bronze: 4,
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold text-black mb-4">
					<span className="text-primary">Stud</span>
					<span className="text-secondary me-4">Pro</span>
					Partners
				</h1>
				<p className="text-lg text-gray-600">
					Meet the organizations that make our programs possible
				</p>
			</div>

			{/* Partners Grid */}
			<div className="relative">
				{sortedPartners.map((yearGroup) => (
					<div key={yearGroup.year} className="mb-16 last:mb-0">
						<div className="mb-6">
							<h2 className="text-2xl font-bold">
								<span className="text-black">{yearGroup.year} - </span>
								<span className="text-primary">{yearGroup.version}</span>
							</h2>
							<p className="text-gray-600 mt-2">
								Our valued partners for this year
							</p>
						</div>{" "}
						{/* Partner Cards Grid */}{" "}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{[...yearGroup.partners]
								.sort((a, b) => {
									// Default to highest number (lowest priority) if partnerLevel is undefined
									const levelA = a.partnerLevel
										? levelOrder[a.partnerLevel] || 5
										: 5;
									const levelB = b.partnerLevel
										? levelOrder[b.partnerLevel] || 5
										: 5;
									return levelA - levelB;
								})
								.map((partner, index) => {
									const years = calculatePartnerYears(partner);
									const company = getPartnerByPartnerRecord(partner);
									return (
										<div
											key={`${partner.companyId}-${index}`}
											className="group"
										>
											<PartnerCard partner={company} years={years} />
										</div>
									);
								})}
						</div>
					</div>
				))}

				{/* Empty state when no partners found */}
				{sortedPartners.length === 0 && (
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
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-black mb-2">
							No partners found
						</h3>
						<p className="text-primary">
							{selectedYear
								? `No partners found for ${selectedYear}`
								: "No partners available"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
