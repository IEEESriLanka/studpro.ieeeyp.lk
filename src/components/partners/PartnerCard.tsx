"use client";

import { Partner } from "@/data/partners";
import Image from "next/image";

interface PartnerCardProps {
	partner: Partner;
	years?: number;
}

export function PartnerCard({ partner, years }: PartnerCardProps) {
	const tier = partner.partnerLevel;
	const yearsLabel =
		years && years > 0 ? `${years} yr${years === 1 ? "" : "s"} partner` : null;

	const metaLine = [tier, yearsLabel].filter(Boolean).join(" · ");

	const content = (
		<div className="group relative bg-background aspect-[3/2] flex items-center justify-center p-8 overflow-hidden transition-colors duration-300 hover:bg-[var(--muted)]">
			{/* Top orange rule (animates in on hover) */}
			<span
				className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-[var(--primary)] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
				aria-hidden="true"
			/>

			{/* Logo */}
			<Image
				src={`/images/partners/${partner.logo || partner.id + ".png"}`}
				alt={partner.name}
				width={180}
				height={100}
				className="max-h-full max-w-full object-contain grayscale opacity-60 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]"
			/>

			{/* Tier · years badge (revealed on hover) */}
			{metaLine && (
				<span
					className="pointer-events-none absolute bottom-3 left-3 right-3 text-[9px] uppercase tracking-[0.28em] text-foreground/70 opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0"
					aria-hidden="true"
				>
					{metaLine}
				</span>
			)}
		</div>
	);

	if (partner.website) {
		return (
			<a
				href={partner.website}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
				aria-label={partner.name}
			>
				{content}
			</a>
		);
	}

	return content;
}
