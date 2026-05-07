"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
	const images = useMemo(
		() => [
			"/images/hero/hero-bg-1.jpg",
			"/images/hero/hero-bg-2.jpg",
			"/images/hero/hero-bg-3.jpg",
			"/images/hero/hero-bg-4.jpg",
		],
		[],
	); // Add more if needed

	const bgRef1 = useRef<HTMLDivElement>(null);
	const bgRef2 = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [activeLayer, setActiveLayer] = useState(0);

	// ⏱ Image change + fade effect
	useEffect(() => {
		const interval = setInterval(() => {
			const nextIndex = (currentImageIndex + 1) % images.length;
			const fadeOutRef = activeLayer === 0 ? bgRef1 : bgRef2;
			const fadeInRef = activeLayer === 0 ? bgRef2 : bgRef1;

			if (fadeInRef.current && fadeOutRef.current) {
				// Set background for next layer
				fadeInRef.current.style.backgroundImage = `url('${images[nextIndex]}')`;

				// Animate fade
				gsap.to(fadeInRef.current, { opacity: 1, duration: 1 });
				gsap.to(fadeOutRef.current, { opacity: 0, duration: 1 });

				setActiveLayer(activeLayer === 0 ? 1 : 0);
				setCurrentImageIndex(nextIndex);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [currentImageIndex, activeLayer, images]);

	useEffect(() => {
		if (!mainRef.current) return;

		const ctx = gsap.context(() => {
			gsap.to(mainRef.current, {
				scrollTrigger: {
					trigger: mainRef.current,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
					onLeave: () => {
						if (mainRef.current) {
							mainRef.current.style.transition = "opacity 0.5s ease";
							mainRef.current.style.opacity = "0";
						}
					},
					onEnterBack: () => {
						if (mainRef.current) {
							mainRef.current.style.transition = "opacity 0.5s ease";
							mainRef.current.style.opacity = "100";
						}
					},
				},
			});
		}, mainRef.current);

		return () => ctx.revert();
	}, []);

	return (
		<main className="relative z-0 pt-16 h-[120vh]" ref={mainRef}>
			{/* Layer 1 */}
			<div
				ref={bgRef1}
				className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 z-0"
				style={{
					backgroundImage: `url('${images[0]}')`,
					opacity: 1,
				}}
			/>
			{/* Layer 2 */}
			<div
				ref={bgRef2}
				className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 z-0"
				style={{
					backgroundImage: `url('${images[1]}')`,
					opacity: 0,
				}}
			/>

			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-secondary/100 z-10" />

			{/* Content */}
			<div className="relative z-20 h-screen w-full flex flex-col gap-6 sm:gap-10 md:gap-16 justify-center items-center px-4 sm:px-8">
				<div className="text-center mx-auto space-y-2 sm:space-y-4 text-white">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-md">
						Welcome to StudPro
					</h1>
					<p className="text-base sm:text-lg font-bold text-center max-w-2xl mx-auto px-2 drop-shadow-md">
						Bridging Academia and Industry for Over 7 Years
					</p>
				</div>
				<div className="flex gap-4 sm:gap-8 items-center justify-center flex-col sm:flex-row w-full">
					<Button asChild size="lg" className="w-full sm:w-auto">
						<Link href="/events">View Events</Link>
					</Button>
					<Button
						variant="outline"
						asChild
						size="lg"
						className="w-full sm:w-auto"
					>
						<Link href="/about-us">Learn More</Link>
					</Button>
				</div>
			</div>
		</main>
	);
};
