"use client";

import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function LenisWrapper({ children }: { children: ReactNode }) {
	const lenisRef = useRef<LenisRef>(null);

	useEffect(() => {
		const lenis = lenisRef.current?.lenis;
		if (lenis) {
			lenis?.on("scroll", ScrollTrigger.update);
		}

		return () => {
			if (lenis) {
				lenis.off("scroll", ScrollTrigger.update);
			}
		};
	}, []);

	return (
		<ReactLenis
			root
			ref={lenisRef}
			options={{
				autoRaf: true,
				lerp: 0.1,
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: "vertical",
				gestureOrientation: "vertical",
				smoothWheel: true,
				wheelMultiplier: 1,
				syncTouch: false,
				touchMultiplier: 2,
				infinite: false,
			}}
		>
			{children}
			<AutoScroll />
		</ReactLenis>
	);
}

function AutoScroll() {
	const lenis = useLenis();

	useEffect(() => {
		if (!lenis || window.location.pathname !== "/" || !window.location.hash)
			return;
		lenis.scrollTo(window.location.hash, { offset: -100 });
	}, [lenis]);

	return null;
}
