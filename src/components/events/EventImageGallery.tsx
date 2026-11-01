"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { shouldBeUnoptimized } from "@/lib/utils/image";

interface EventImageGalleryProps {
	images: string[];
	title: string;
	category?: string;
}

export function EventImageGallery({ images, title }: EventImageGalleryProps) {
	const safeImages = images && images.length > 0 ? images : [];
	const [activeIndex, setActiveIndex] = useState(0);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const thumbnailStripRef = useRef<HTMLDivElement>(null);

	const handlePrev = useCallback(() => {
		if (safeImages.length === 0) return;
		setActiveIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
	}, [safeImages.length]);

	const handleNext = useCallback(() => {
		if (safeImages.length === 0) return;
		setActiveIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
	}, [safeImages.length]);

	// Automatically scroll thumbnail into view when active index changes
	useEffect(() => {
		if (thumbnailStripRef.current) {
			const activeThumb = thumbnailStripRef.current.children[activeIndex] as HTMLElement;
			if (activeThumb) {
				activeThumb.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "center",
				});
			}
		}
	}, [activeIndex]);

	// Keyboard arrow navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				handlePrev();
			} else if (e.key === "ArrowRight") {
				handleNext();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handlePrev, handleNext]);

	// Fallback if no images provided
	if (safeImages.length === 0) {
		return null;
	}

	const activeImage = safeImages[activeIndex] || safeImages[0];
	const hasMultiple = safeImages.length > 1;

	// Mobile touch swipe handlers
	const onTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStart === null) return;
		const touchEnd = e.changedTouches[0].clientX;
		const diff = touchStart - touchEnd;

		// 50px threshold for swipe
		if (diff > 50) {
			handleNext();
		} else if (diff < -50) {
			handlePrev();
		}
		setTouchStart(null);
	};

	return (
		<div className="mb-10 space-y-4">
			{/* Top Large Image Showcase */}
			<div
				className="relative w-full min-h-[360px] sm:min-h-[460px] md:min-h-[540px] lg:min-h-[580px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center select-none group"
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
			>
				{/* Ambient Dynamic Blurred Backdrop */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<Image
						src={activeImage}
						alt=""
						fill
						className="object-cover scale-125 blur-3xl opacity-35 transition-all duration-700 ease-out"
						unoptimized={shouldBeUnoptimized(activeImage)}
						aria-hidden="true"
						priority={false}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/80" />
				</div>

				{/* Foreground Active Image - Rendered in 100% natural aspect ratio without clipping */}
				<div className="relative z-10 w-full h-[360px] sm:h-[460px] md:h-[540px] lg:h-[580px] flex items-center justify-center p-3 sm:p-6">
					<Image
						key={`${activeImage}-${activeIndex}`}
						src={activeImage}
						alt={`${title} - Photo ${activeIndex + 1}`}
						width={1200}
						height={800}
						priority={activeIndex === 0}
						loading={activeIndex === 0 ? "eager" : "lazy"}
						className="w-auto h-auto max-h-full max-w-full object-contain mx-auto rounded-xl drop-shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1200px"
						unoptimized={shouldBeUnoptimized(activeImage)}
					/>
				</div>

				{/* Counter Badge */}
				{hasMultiple && (
					<div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-700/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
						<Images className="w-3.5 h-3.5 text-[#EE7929]" />
						<span>
							{activeIndex + 1} / {images.length}
						</span>
					</div>
				)}

				{/* Navigation Arrows for Multiple Images */}
				{hasMultiple && (
					<>
						<button
							type="button"
							onClick={handlePrev}
							className="absolute left-3 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/70 hover:bg-[#EE7929] text-white border border-slate-700/60 hover:border-[#EE7929] backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EE7929]"
							aria-label="Previous photo"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>

						<button
							type="button"
							onClick={handleNext}
							className="absolute right-3 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/70 hover:bg-[#EE7929] text-white border border-slate-700/60 hover:border-[#EE7929] backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EE7929]"
							aria-label="Next photo"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</>
				)}
			</div>

			{/* Interactive Thumbnail Strip / Carousel */}
			{hasMultiple && (
				<div className="relative">
					<div
						ref={thumbnailStripRef}
						className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent scroll-smooth"
					>
						{images.map((image, idx) => {
							const isActive = idx === activeIndex;
							return (
								<button
									key={`${image}-${idx}`}
									type="button"
									onClick={() => setActiveIndex(idx)}
									className={`group relative shrink-0 w-24 sm:w-32 h-16 sm:h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-slate-900 ${
										isActive
											? "border-2 border-[#EE7929] ring-2 ring-[#EE7929]/50 shadow-lg shadow-[#EE7929]/20 scale-[1.03] opacity-100"
											: "border border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600 hover:scale-[1.02]"
									}`}
									aria-label={`View photo ${idx + 1}`}
								>
									<Image
										src={image}
										alt={`${title} thumbnail ${idx + 1}`}
										fill
										className="object-cover"
										sizes="160px"
										quality={65}
										loading="lazy"
										unoptimized={shouldBeUnoptimized(image)}
									/>
									{/* Active Indicator overlay dot */}
									{isActive && (
										<span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EE7929] shadow" />
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
