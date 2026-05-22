"use client";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Hero } from "@/components/home/Hero";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { Stats } from "@/components/home/Stats";
import { Partners } from "@/components/home/Partners";
import LenisWrapper from "@/components/layout/LenisWrapper";
import { Events } from "@/components/home/Events";
import { Overview } from "@/components/home/Overview";
import { ContactUs } from "@/components/home/ContactUs";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
	const heroRef = useRef<HTMLDivElement>(null);
	const overviewRef = useRef<HTMLDivElement>(null);
	const whatWeDoRef = useRef<HTMLDivElement>(null);
	const eventsRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const partnersRef = useRef<HTMLDivElement>(null);
	const contactUsRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const sections = [
			{ ref: overviewRef, name: "Overview" },
			{ ref: whatWeDoRef, name: "WhatWeDo" },
			{ ref: eventsRef, name: "Events" },
			{ ref: statsRef, name: "Stats" },
			{ ref: partnersRef, name: "Partners" },
			{ ref: contactUsRef, name: "ContactUs" },
		];

		document.body.style.backgroundColor = "#065E86"; // Default background color

		ScrollTrigger.refresh();

		sections.forEach(({ ref, name }, i) => {
			if (ref.current) {
				const prevBgColor =
					sections[i - 1]?.ref?.current?.dataset.bgcolor || "bg-none";
				ScrollTrigger.create({
					trigger: ref.current,
					start: "top 70%",
					end: "bottom center",
					onEnter: () => {
						document.body.style.transition = "background-color 0.5s ease";
						document.body.style.backgroundColor =
							ref?.current?.dataset.bgcolor || "#065E86";
						if (ref.current) {
							// console.log(`[ScrollTrigger] onEnter: ${name}`);
							ref.current.style.transition = "opacity 0.5s ease";
							ref.current.style.opacity = "1";
						}
					},
					onLeave: () => {
						if (ref.current) {
							// console.log(`[ScrollTrigger] onLeave: ${name}`);
							ref.current.style.transition = "opacity 0.5s ease";
							ref.current.style.opacity = "0";
						}
					},
					onEnterBack: () => {
						if (ref.current) {
							// console.log(`[ScrollTrigger] onEnterBack: ${name}`);
							ref.current.style.transition = "opacity 0.5s ease";
							ref.current.style.opacity = "1";
						}
					},
					onLeaveBack: () => {
						document.body.style.transition = "background-color 0.5s ease";
						document.body.style.backgroundColor = prevBgColor || "#065E86";
						if (ref.current) {
							// console.log(`[ScrollTrigger] onLeaveBack: ${name}`);
							ref.current.style.transition = "opacity 0.5s ease";
							ref.current.style.opacity = "0";
						}
					},
				});
			}
		});

		return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	}, []);

	return (
		<LenisWrapper>
			<div ref={heroRef} className="relative" data-bgcolor="#065E86">
				<Hero />
			</div>
			<div ref={overviewRef} style={{ opacity: 0 }} data-bgcolor="#065E86">
				<Overview />
			</div>
			<div ref={whatWeDoRef} style={{ opacity: 0 }} data-bgcolor="#FFFFFF">
				<WhatWeDo />
			</div>
			<div ref={eventsRef} style={{ opacity: 0 }} data-bgcolor="#FFFFFF">
				<Events />
			</div>
			<div ref={statsRef} style={{ opacity: 0 }} data-bgcolor="#EE7929">
				<Stats />
			</div>
			<div ref={partnersRef} style={{ opacity: 0 }} data-bgcolor="#FFFFFF">
				<Partners />
			</div>
			<div ref={contactUsRef} style={{ opacity: 0 }} data-bgcolor="#065E86">
				<ContactUs />
			</div>
		</LenisWrapper>
	);
}
