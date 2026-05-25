"use client";

import { StatCard } from "@/components/home/StatCard";

export interface StatsData {
	type: string;
	value: number;
	icon?: string;
}

export const Stats = () => {
	const statsData: StatsData[] = [
		{ type: "Universities", value: 21, icon: "GraduationCap" },
		{ type: "Registrants", value: 3000, icon: "Users" },
		{ type: "Streams", value: 10, icon: "LayoutTemplate" },
		{ type: "Speakers", value: 16, icon: "MicVocal" },
	];

	return (
		<section className="relative overflow-hidden bg-[var(--ink)] text-white py-32 lg:py-40">
			{/* Grain overlay */}
			<div
				className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay"
				aria-hidden="true"
			/>

			{/* Soft radial glow */}
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden="true"
				style={{
					background:
						"radial-gradient(60% 50% at 80% 20%, rgba(238,121,41,0.08) 0%, transparent 60%)",
				}}
			/>

			<div className="relative max-w-[1200px] mx-auto px-6 lg:px-12">
				<div className="flex flex-col gap-8">
					<span className="eyebrow text-white/60">By the numbers</span>

					<h2
						className="font-display leading-[0.92] tracking-tight max-w-[18ch]"
						style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
					>
						Seven years.{" "}
						<em className="font-serif-italic text-[var(--primary)]">
							One mission.
						</em>
					</h2>

					<p className="text-white/55 text-sm sm:text-base leading-[1.7] max-w-[52ch]">
						Built on numbers — and the people behind them. Here&apos;s what
						StudPro looks like across the country.
					</p>
				</div>

				<div className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0">
					{statsData.map((stat, index) => (
						<StatCard
							key={stat.type}
							stat={stat}
							index={index}
							isFirstInRow={index === 0 || index === 2}
						/>
					))}
				</div>
			</div>
		</section>
	);
};
