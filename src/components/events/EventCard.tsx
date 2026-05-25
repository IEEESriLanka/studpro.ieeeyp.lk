"use client";

import type { Event } from "@/data/events";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

interface EventCardProps {
	session: Event;
	version?: string;
	seriesTitle?: string;
}

export function EventCard({ session, version, seriesTitle }: EventCardProps) {
	const router = useRouter();

	const getVersionSlug = () => {
		if (version) {
			return version.replace(/\s+/g, "-");
		}
		return "unknown-version";
	};

	const handleClick = () => {
		const versionSlug = getVersionSlug();
		const encodedTitle = encodeURIComponent(session.title);
		router.push(`/events/${versionSlug}/${encodedTitle}`);
	};

	const handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<article
			tabIndex={0}
			role="link"
			aria-label={`${session.title} — ${session.date}`}
			onClick={handleClick}
			onKeyDown={handleKey}
			className="group relative flex flex-col cursor-pointer card-lift bg-card border border-border h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
		>
			{/* Image */}
			<div className="relative aspect-[4/3] overflow-hidden bg-muted">
				{session.images && session.images.length > 0 ? (
					<Image
						src={session.images[0]}
						alt={session.title}
						fill
						sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
						className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
					/>
				) : (
					<div className="absolute inset-0 bg-[var(--ink-soft)]/5" />
				)}
				{/* Subtle inner gradient for depth */}
				<div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/25 via-transparent to-transparent pointer-events-none" />

				{/* Top-left corner badge */}
				{version && (
					<div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-[var(--ink)]/85 backdrop-blur-sm px-2.5 py-1.5 border-l-2 border-[var(--primary)]">
						<span className="font-display text-[10px] leading-none tracking-[0.18em] text-white/95 uppercase">
							{version}
						</span>
					</div>
				)}

				{/* Hover arrow */}
				<div className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 text-[var(--ink)] translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
					<ArrowUpRight className="w-4 h-4" />
				</div>
			</div>

			{/* Body */}
			<div className="flex flex-col gap-3 px-5 pt-5 pb-6 flex-1">
				{seriesTitle && (
					<p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground line-clamp-1">
						{seriesTitle}
					</p>
				)}

				<h3
					className="font-display text-2xl lg:text-[1.7rem] leading-[1.02] text-foreground line-clamp-2"
					style={{ letterSpacing: "0.01em" }}
				>
					{session.title}
				</h3>

				<p className="font-serif-italic text-sm text-muted-foreground">
					{session.date}
				</p>

				{session.description && (
					<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">
						{session.description}
					</p>
				)}

				{/* Bottom rule that scales in on hover */}
				<div className="mt-auto pt-5">
					<div className="relative h-px w-full bg-border overflow-hidden">
						<span className="absolute inset-y-0 left-0 w-full bg-[var(--primary)] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
					</div>
				</div>
			</div>
		</article>
	);
}
