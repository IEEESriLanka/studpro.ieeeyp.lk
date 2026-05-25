import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	partnersByYear,
	calculatePartnerYears,
	getPartnerByPartnerRecord,
} from "@/data/partners";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { ArrowUpRight } from "lucide-react";

export const Partners = () => {
	const currentYear = new Date().getFullYear();

	const currentYearGroup = partnersByYear.find(
		(yearGroup) => yearGroup.year === currentYear,
	);
	const currentPartners = currentYearGroup?.partners || [];

	const levelOrder = {
		Platinum: 1,
		Gold: 2,
		Silver: 3,
		Bronze: 4,
		Industry: 2.5,
		Ecosystem: 3.5,
		undefined: 5,
	} as const;

	const sortedPartners = [...currentPartners].sort(
		(a, b) =>
			(levelOrder[(a.partnerLevel as keyof typeof levelOrder) ?? "undefined"] ??
				5) -
			(levelOrder[(b.partnerLevel as keyof typeof levelOrder) ?? "undefined"] ??
				5),
	);

	const limitedPartners = sortedPartners.slice(0, 15);
	const hasPartners = limitedPartners.length > 0;

	// Build a deduped marquee list using partner companies from the current year
	// (fall back to all partners if current year is empty).
	const marqueeSourcePartners =
		currentPartners.length > 0
			? currentPartners
			: partnersByYear.flatMap((y) => y.partners);

	const marqueeNames = Array.from(
		new Set(
			marqueeSourcePartners
				.map((p) => getPartnerByPartnerRecord(p)?.name)
				.filter((n): n is string => Boolean(n)),
		),
	);

	// Duplicate for seamless loop
	const marqueeLoop = [...marqueeNames, ...marqueeNames];

	return (
		<section
			id="partners"
			className="relative bg-background py-32 lg:py-40 border-t border-border overflow-hidden"
		>
			<div className="max-w-[1200px] mx-auto px-6 lg:px-12">
				<div className="flex flex-col gap-4">
					<span className="eyebrow">Partners & sponsors</span>
					<h2
						className="font-display tracking-tight leading-[0.95] text-foreground"
						style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
					>
						In <em className="font-serif-italic text-[var(--primary)]">good</em>{" "}
						company.
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base leading-[1.7] max-w-[52ch]">
						The companies that walk with us — investing in the next generation
						of Sri Lankan engineers.
					</p>
				</div>
			</div>

			{/* Full-bleed marquee with edge-fade mask */}
			{marqueeNames.length > 0 && (
				<div
					className="relative mt-16 lg:mt-20 overflow-hidden select-none"
					aria-hidden="true"
					style={{
						maskImage:
							"linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
						WebkitMaskImage:
							"linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
					}}
				>
					<div className="flex w-max animate-marquee-x-slow whitespace-nowrap">
						{marqueeLoop.map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-display text-foreground/[0.08] px-8 tracking-tight"
								style={{
									fontSize: "clamp(2.5rem, 6vw, 5rem)",
									lineHeight: 1,
								}}
							>
								{name}
								<span className="text-[var(--primary)]/30 ml-8">/</span>
							</span>
						))}
					</div>
				</div>
			)}

			<div className="max-w-[1200px] mx-auto px-6 lg:px-12">
				{hasPartners ? (
					<div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-border border border-border overflow-hidden">
						{limitedPartners.map((partner, index) => {
							const company = getPartnerByPartnerRecord(partner);
							const years = calculatePartnerYears(partner);
							return (
								<PartnerCard
									key={`${partner.companyId}-${index}`}
									partner={company}
									years={years}
								/>
							);
						})}
					</div>
				) : (
					<div className="mt-16 py-16 text-center border border-border">
						<h3 className="font-display text-2xl text-foreground mb-2">
							No partners yet for {currentYear}
						</h3>
						<p className="text-muted-foreground text-sm">
							Check back soon for our newest partners.
						</p>
					</div>
				)}

				<div className="mt-12 flex items-center justify-between flex-wrap gap-4">
					<Link href="/partners">
						<Button variant="outline" className="group">
							View all partners
							<ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</Button>
					</Link>
					<span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
						{currentYearGroup?.version ?? `StudPro · ${currentYear}`}
					</span>
				</div>
			</div>
		</section>
	);
};
