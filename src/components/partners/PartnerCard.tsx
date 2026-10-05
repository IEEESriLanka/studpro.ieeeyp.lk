"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Partner } from "@/data/partners";
import Image from "next/image";
import Link from "next/link";

interface PartnerCardProps {
	partner: Partner;
	years?: number;
}

export function PartnerCard({ partner, years }: PartnerCardProps) {
	const level = partner.partnerLevel;

	// Determine badge text without duplicating "Partner"
	const getBadgeText = (lvl?: string) => {
		if (!lvl || lvl === "Partner" || lvl === "partner") {
			return "Partner";
		}
		if (lvl.toLowerCase().endsWith("partner")) {
			return lvl;
		}
		return `${lvl} Partner`;
	};

	// Determine theme color styling
	const getLevelColorClass = (lvl?: string) => {
		switch (lvl) {
			case "Platinum":
				return "text-purple-600";
			case "Gold":
				return "text-amber-500";
			case "Silver":
				return "text-slate-400";
			case "Bronze":
				return "text-amber-700";
			default:
				return "text-blue-500";
		}
	};

	const logoSrc = partner.logo
		? partner.logo.startsWith("/") || partner.logo.startsWith("http")
			? partner.logo
			: `/images/partners/${partner.logo}`
		: `/images/partners/${partner.id || "placeholder"}.png`;

	return (
		<Link
			href={partner.website || "#"}
			target="_blank"
			rel="noopener noreferrer"
			className="block h-full"
		>
			<Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white overflow-hidden pt-0 cursor-pointer">
				<div className="w-full h-[150px] relative flex items-center justify-center pt-10 p-6">
					<Image
						src={logoSrc}
						alt={partner.name}
						width={180}
						height={100}
						className="object-contain max-h-[150px] rounded-md"
						unoptimized={logoSrc.startsWith("http")}
					/>
				</div>

				<CardContent className="px-6 pb-6 text-center">
					<div className="space-y-2 flex flex-col items-center">
						<div className="flex flex-col items-center">
							<h3 className="text-lg font-semibold text-black mb-2">
								{partner.name}
							</h3>
							{years && (
								<p className="text-sm text-secondary">
									{years} {years === 1 ? "year" : "years"} with us
								</p>
							)}
						</div>

						<div className="flex justify-center pt-2">
							<div
								className={`flex gap-1.5 items-center font-medium ${getLevelColorClass(
									level,
								)}`}
							>
								<div className="w-4 h-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								</div>
								<span className="text-sm">{getBadgeText(level)}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
