"use client";

import { StatsData } from "@/components/home/Stats";
import { useEffect, useRef, useState } from "react";
import {
	GraduationCap,
	Users,
	LayoutTemplate,
	MicVocal,
	type LucideIcon,
} from "lucide-react";

interface StatCardProps {
	stat: StatsData;
	index: number;
	isFirstInRow?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
	GraduationCap,
	Users,
	LayoutTemplate,
	MicVocal,
};

const formatValue = (value: number, current: number) => {
	// If target is >= 1000, display as "3K" style once we cross the threshold
	if (value >= 1000) {
		const display = current / 1000;
		// Show one decimal while counting, integer when done
		if (current >= value) return `${Math.round(display)}K`;
		return `${display.toFixed(1)}K`;
	}
	return `${Math.round(current)}`;
};

export const StatCard = ({ stat, index, isFirstInRow }: StatCardProps) => {
	const [current, setCurrent] = useState(0);
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | null>(null);

	const Icon = stat.icon ? iconMap[stat.icon] : null;

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					io.disconnect();
				}
			},
			{ threshold: 0.3 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	useEffect(() => {
		if (!visible) return;
		const duration = 1600;
		const start = performance.now();
		const startValue = 0;
		const endValue = stat.value;

		const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

		const tick = (now: number) => {
			const elapsed = now - start;
			const t = Math.min(elapsed / duration, 1);
			const eased = easeOutQuart(t);
			setCurrent(startValue + (endValue - startValue) * eased);
			if (t < 1) {
				rafRef.current = requestAnimationFrame(tick);
			}
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [visible, stat.value]);

	return (
		<div
			ref={ref}
			className={`relative flex flex-col ${
				isFirstInRow ? "" : "md:border-l md:border-white/10 md:pl-6 lg:pl-8"
			}`}
			style={{ animationDelay: `${index * 80}ms` }}
		>
			{Icon && (
				<Icon
					className="absolute right-0 top-0 w-5 h-5 text-white/15"
					strokeWidth={1.25}
					aria-hidden="true"
				/>
			)}

			<h3
				className="font-display leading-[0.85] tracking-tight text-white tabular-nums"
				style={{
					fontSize: "clamp(4rem, 10vw, 8rem)",
					letterSpacing: "0.01em",
				}}
			>
				{formatValue(stat.value, current)}
				<span className="text-[var(--primary)]">+</span>
			</h3>

			<div className="mt-4 h-px w-8 bg-[var(--primary)]" />

			<p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-white/55 font-medium">
				{stat.type}
			</p>
		</div>
	);
};
