"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDE_DURATION = 6500;

type Slide = {
	image: string;
	eyebrow: string;
	lines: [string, string, string];
	accent: number;
	caption: string;
};

const slides: Slide[] = [
	{
		image: "/images/hero/hero-bg-1.jpg",
		eyebrow: "Career Guidance Initiative · Est. 2017",
		lines: ["Bridging", "academia", "& industry."],
		accent: 2,
		caption:
			"A flagship initiative by IEEE Young Professionals Sri Lanka — connecting student members to the industries shaping their careers.",
	},
	{
		image: "/images/hero/hero-bg-2.jpg",
		eyebrow: "Student Development · Sri Lanka",
		lines: ["Shaping", "Sri Lanka's", "next engineers."],
		accent: 1,
		caption:
			"From webinars to workshops to the annual career fair — programmes that take undergraduates from classroom to corporate floor.",
	},
	{
		image: "/images/hero/hero-bg-3.jpg",
		eyebrow: "IEEE Young Professionals · YP · SL",
		lines: ["Industry.", "Network.", "Career."],
		accent: 0,
		caption:
			"A platform built for IEEE student members to carry their membership forward, and for fresh graduates to meet the people who hire them.",
	},
];

export const Hero = () => {
	const autoplay = useRef(
		Autoplay({
			delay: SLIDE_DURATION,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
		}),
	);

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop: true, duration: 38, dragFree: false },
		[autoplay.current],
	);

	const [selected, setSelected] = useState(0);
	const [progress, setProgress] = useState(0);
	const rafRef = useRef<number | null>(null);

	const scrollTo = useCallback(
		(index: number) => emblaApi?.scrollTo(index),
		[emblaApi],
	);
	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
		onSelect();
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi]);

	useEffect(() => {
		setProgress(0);
		const start = performance.now();
		const tick = (now: number) => {
			const elapsed = now - start;
			setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
			if (elapsed < SLIDE_DURATION) {
				rafRef.current = requestAnimationFrame(tick);
			}
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [selected]);

	const active = slides[selected];

	return (
		<section className="relative -mt-20 h-[100dvh] min-h-[640px] overflow-hidden bg-[var(--ink)] text-white">
			{/* Carousel viewport — owns the imagery */}
			<div ref={emblaRef} className="absolute inset-0 h-full w-full">
				<div className="flex h-full">
					{slides.map((s, i) => (
						<div
							key={s.image}
							className="relative h-full min-w-0 flex-[0_0_100%]"
						>
							<Image
								src={s.image}
								alt=""
								fill
								priority={i === 0}
								sizes="100vw"
								className="object-cover scale-[1.04]"
							/>
						</div>
					))}
				</div>
			</div>

			{/* Cinematic overlays */}
			<div className="absolute inset-0 z-[1] bg-[var(--ink)]/45 pointer-events-none" />
			<div
				className="absolute inset-0 z-[1] pointer-events-none"
				style={{
					background:
						"linear-gradient(100deg, rgba(6,10,15,0.92) 0%, rgba(6,10,15,0.55) 40%, rgba(6,10,15,0.05) 75%)",
				}}
			/>
			<div
				className="absolute inset-0 z-[1] pointer-events-none"
				style={{
					background:
						"linear-gradient(180deg, rgba(6,10,15,0.65) 0%, transparent 22%, transparent 55%, rgba(6,10,15,0.95) 92%, rgb(6,10,15) 100%)",
				}}
			/>
			<div className="absolute inset-0 z-[1] bg-grain opacity-[0.12] mix-blend-overlay pointer-events-none" />

			{/* Side rule + vertical eyebrow (desktop) */}
			<div className="absolute left-6 lg:left-12 top-0 bottom-0 z-[2] hidden lg:flex flex-col items-center justify-between py-28 pointer-events-none">
				<div className="w-px flex-1 bg-white/10 relative overflow-hidden">
					<span className="absolute inset-x-0 h-12 bg-gradient-to-b from-[var(--primary)]/0 via-[var(--primary)] to-[var(--primary)]/0 animate-scroll-pulse" />
				</div>
				<span
					className="text-[10px] tracking-[0.5em] uppercase text-white/40 [writing-mode:vertical-rl] rotate-180 my-6"
					style={{ fontFeatureSettings: '"tnum"' }}
				>
					Studpro · {new Date().getFullYear()}
				</span>
				<div className="w-px flex-1 bg-white/10" />
			</div>

			{/* Top-right metadata badge */}
			<div className="absolute top-28 right-6 lg:right-12 xl:right-16 z-[3] hidden md:block">
				<div
					className="relative bg-white/[0.04] backdrop-blur-md border border-white/10 px-5 py-4 text-right"
					style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)" }}
				>
					<span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--primary)]" />
					<div className="text-[9px] uppercase tracking-[0.32em] text-white/40">
						Established
					</div>
					<div
						className="mt-1 text-4xl leading-none text-white/95 font-display"
						style={{ letterSpacing: "0.05em" }}
					>
						2017
					</div>
					<div className="mt-2 text-[9px] uppercase tracking-[0.28em] text-white/35">
						IEEE · YP · SL
					</div>
				</div>
			</div>

			{/* Main content — bottom anchored, key forces re-animation per slide */}
			<div
				key={selected}
				className="relative z-[2] h-full max-w-[1400px] mx-auto w-full px-6 lg:px-20 pb-12 sm:pb-16 lg:pb-20 pt-28 flex flex-col justify-end"
			>
				{/* Eyebrow */}
				<div className="hero-fade-rise" style={{ animationDelay: "40ms" }}>
					<span className="inline-flex items-center gap-3">
						<span className="w-6 h-px bg-[var(--primary)]" />
						<span className="text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-white/55 font-medium">
							{active.eyebrow}
						</span>
					</span>
				</div>

				{/* Massive display headline */}
				<h1 className="mt-6 max-w-[14ch]">
					{active.lines.map((line, i) => (
						<span
							key={`${selected}-${i}`}
							className="block overflow-hidden leading-[0.86]"
						>
							<span
								className="hero-reveal font-display"
								style={{
									animationDelay: `${120 + i * 90}ms`,
									fontSize: "clamp(2.75rem, 9.2vw, 8.5rem)",
									letterSpacing: "0.015em",
									color:
										i === active.accent
											? "var(--primary)"
											: "rgba(255,255,255,0.96)",
								}}
							>
								{i === active.accent && (
									<span className="font-serif-italic mr-2 align-baseline opacity-90">
										/
									</span>
								)}
								{line}
							</span>
						</span>
					))}
				</h1>

				{/* Description + CTA + stats */}
				<div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
					<div
						className="hero-fade-rise lg:col-span-5"
						style={{ animationDelay: "440ms" }}
					>
						<p className="text-white/65 text-sm sm:text-base leading-[1.7] max-w-[42ch]">
							{active.caption}
						</p>
						<div className="mt-6 flex flex-wrap items-center gap-3">
							<Link
								href="/events"
								className="group inline-flex items-center gap-2 bg-[var(--primary)] text-white text-[13px] font-semibold tracking-wider uppercase px-5 py-3 hover:bg-[#d96b1f] transition-colors"
							>
								Explore Program
								<ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
							<Link
								href="/about-us"
								className="inline-flex items-center gap-2 text-white/75 text-[13px] uppercase tracking-wider px-5 py-3 border border-white/15 hover:text-white hover:border-white/40 transition-colors"
							>
								Our story
							</Link>
						</div>
					</div>

					<div
						className="hero-fade-rise lg:col-span-7 lg:justify-self-end"
						style={{ animationDelay: "520ms" }}
					>
						<div className="grid grid-cols-3 gap-6 sm:gap-10">
							{[
								{ value: "21", suffix: "", label: "Universities" },
								{ value: "3K", suffix: "+", label: "Registrants" },
								{ value: "16", suffix: "+", label: "Speakers" },
							].map((s) => (
								<div key={s.label} className="border-l border-white/10 pl-4">
									<div
										className="text-[2.25rem] sm:text-[2.75rem] leading-none text-white/95 font-display tabular-nums"
										style={{ letterSpacing: "0.04em" }}
									>
										{s.value}
										<span className="text-[var(--primary)]">{s.suffix}</span>
									</div>
									<div className="mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-white/40">
										{s.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Navigation rail */}
				<div
					className="hero-fade-rise mt-10 sm:mt-12 pt-5 border-t border-white/10 flex items-center justify-between"
					style={{ animationDelay: "620ms" }}
				>
					<div className="flex items-center gap-5">
						<div className="flex items-center gap-2">
							{slides.map((_, i) => (
								<button
									key={i}
									type="button"
									onClick={() => scrollTo(i)}
									aria-label={`Go to slide ${i + 1}`}
									className="relative h-[2px] overflow-hidden bg-white/15 transition-all duration-500 ease-out"
									style={{ width: i === selected ? 44 : 14 }}
								>
									{i === selected && (
										<span
											className="absolute inset-y-0 left-0 bg-[var(--primary)]"
											style={{ width: `${progress}%`, transition: "none" }}
										/>
									)}
								</button>
							))}
						</div>
						<span className="text-white/30 text-[10px] tabular-nums tracking-[0.25em]">
							{String(selected + 1).padStart(2, "0")} /{" "}
							{String(slides.length).padStart(2, "0")}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={scrollPrev}
							aria-label="Previous slide"
							className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/55 hover:border-white/40 hover:text-white transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button
							type="button"
							onClick={scrollNext}
							aria-label="Next slide"
							className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/55 hover:border-white/40 hover:text-white transition-colors"
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
