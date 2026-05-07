"use client";

import { useState, useEffect } from "react";
import { WhatWeDoCard } from "@/components/home/WhatWeDoCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export const WhatWeDo = () => {
	const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi>();
	const [desktopCarouselApi, setDesktopCarouselApi] = useState<CarouselApi>();
	const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
	const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);

	useEffect(() => {
		if (!mobileCarouselApi || !desktopCarouselApi) return;

		const onMobileSelect = () => {
			setMobileActiveIndex(mobileCarouselApi.selectedScrollSnap());
		};

		const onDesktopSelect = () => {
			setDesktopActiveIndex(desktopCarouselApi.selectedScrollSnap());
		};

		mobileCarouselApi.on("select", onMobileSelect);
		desktopCarouselApi.on("select", onDesktopSelect);

		// Set initial indexes
		setMobileActiveIndex(mobileCarouselApi.selectedScrollSnap());
		setDesktopActiveIndex(desktopCarouselApi.selectedScrollSnap());

		return () => {
			mobileCarouselApi.off("select", onMobileSelect);
			desktopCarouselApi.off("select", onDesktopSelect);
		};
	}, [mobileCarouselApi, desktopCarouselApi]);

	// useLayoutEffect(() => {
	// 	const container = containerRef.current;
	// 	const rightContent = rightContentRef.current;
	// 	if (!container || !rightContent) return;
	//
	// 	let totalScroll = rightContent.scrollHeight - rightContent.clientHeight;
	//
	// 	const updateScroll = () => {
	// 		totalScroll = rightContent.scrollHeight - rightContent.clientHeight;
	// 		ScrollTrigger.refresh();
	// 	};
	//
	// 	const pinTrigger = ScrollTrigger.create({
	// 		trigger: container,
	// 		start: "top top",
	// 		end: () => `+=${totalScroll}`,
	// 		pin: true,
	// 		pinSpacing: true,
	// 		anticipatePin: 1,
	// 		onUpdate: (self) => {
	// 			const progress = self.progress;
	// 			const scrollDistance = progress * totalScroll;
	// 			rightContent.scrollTop = scrollDistance;
	// 		},
	// 		onRefresh: (self) => {
	// 			totalScroll = rightContent.scrollHeight - rightContent.clientHeight;
	// 			self.vars.end = `+=${totalScroll}`;
	// 		},
	// 	});
	//
	// 	const preventScroll = (e: WheelEvent) => {
	// 		e.preventDefault();
	// 	};
	// 	rightContent.addEventListener("wheel", preventScroll, { passive: false });
	//
	// 	const resizeObserver = new ResizeObserver(updateScroll);
	// 	resizeObserver.observe(rightContent);
	//
	// 	ScrollTrigger.refresh();
	//
	// 	return () => {
	// 		pinTrigger.kill();
	// 		rightContent.removeEventListener("wheel", preventScroll);
	// 		resizeObserver.disconnect();
	// 	};
	// }, []);

	const services = [
		{
			title: "Webinars",
			description:
				"Webinars and session series starting from CV writing, personal grooming, facing interview, industry niches and much more.",
			image: "/images/services/webinar.png",
		},
		{
			title: "Workshops",
			description:
				"Workshops on how to maintain your LinkedIn profile, writing emails, creating CVs and a whole lot more to ensure our candidates are well prepared for the industry.",
			image: "/images/services/workshop.png",
		},
		{
			title: "Industry Visits",
			description:
				"A series of sessions targeted to get answers for the burning questions of undergraduates and fresh graduates directly from industry professionals.",
			image: "/images/services/visit.png",
		},
		{
			title: "Carrer Guidance",
			description:
				"Career guidance sessions to help candidates understand the industry and how to prepare for it, including resume building, interview preparation, and more.",
			image: "/images/services/career-guidance.png",
		},
		{
			title: "Annual Career Fair",
			description:
				"The flagship event of IEEE StudPro, making sure that the candidates who are groomed to a higher level are ready to take their next step with industry giants.",
			image: "/images/services/career-fair.png",
		},
	];
	// Helper function to navigate directly to specific slides
	const goToMobileSlide = (index: number) => {
		if (mobileCarouselApi) {
			mobileCarouselApi.scrollTo(index);
		}
	};

	const goToDesktopSlide = (index: number) => {
		if (desktopCarouselApi) {
			desktopCarouselApi.scrollTo(index);
		}
	};

	return (
		<div id="about" className="w-full">
			<div className="w-full h-full">
				{/* Mobile view */}
				<div className="flex flex-col md:hidden h-full px-4 py-12">
					<div className="space-y-6 mb-8">
						<h1 className="text-3xl font-bold text-secondary leading-tight drop-shadow-xl">
							What We Do
						</h1>
						<p className="text-base text-gray-600 leading-relaxed drop-shadow-xl">
							IEEE StudPro is an annual event hosted by the IEEE Young
							Professionals Sri Lanka that intends to expose the talents and
							skills of all fresh graduates and undergraduates in Sri Lanka to
							the corporate world immediately after graduation or during the
							last stages of their degree. It was first started back in 2017 and
							has continued its journey for 7 successful years.
						</p>
					</div>{" "}
					<div className="relative">
						<Carousel
							opts={{
								loop: true,
								align: "center",
							}}
							plugins={[
								Autoplay({
									delay: 5000,
									stopOnInteraction: true,
								}),
							]}
							className="w-full"
							setApi={setMobileCarouselApi}
						>
							<CarouselContent className="-ml-2">
								{services.map((service, index) => (
									<CarouselItem key={index} className="pl-2 basis-full">
										<WhatWeDoCard
											title={service.title}
											image={service.image}
											description={service.description}
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md"
									onClick={() => mobileCarouselApi?.scrollPrev()}
								>
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Previous slide</span>
								</Button>
							</div>
							<div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md"
									onClick={() => mobileCarouselApi?.scrollNext()}
								>
									<ChevronRight className="h-4 w-4" />
									<span className="sr-only">Next slide</span>
								</Button>
							</div>{" "}
							{/* Pagination dots for mobile view */}
							<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
								{services.map((_, index) => (
									<button
										key={index}
										onClick={() => goToMobileSlide(index)}
										className={`w-2 h-2 rounded-full transition-all ${
											index === mobileActiveIndex
												? "bg-primary w-4"
												: "bg-gray-300"
										}`}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>
						</Carousel>
					</div>
				</div>

				{/* Desktop view */}
				<div className="hidden md:flex h-full justify-center">
					{/* Left Side - What We Do Content */}
					<div className="w-1/3 relative">
						<div
							/* ref={leftContentRef} */
							className="h-full overflow-hidden"
							style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
						>
							<div className="px-6 lg:px-12 py-16 pt-32 space-y-16 h-full">
								<div className="space-y-8">
									<h1 className="text-4xl lg:text-5xl font-bold text-secondary leading-tight drop-shadow-xl">
										What We Do
									</h1>
									<p className="text-base lg:text-xl text-gray-600 leading-relaxed max-w-lg drop-shadow-xl">
										IEEE StudPro is an annual event hosted by the IEEE Young
										Professionals Sri Lanka that intends to expose the talents
										and skills of all fresh graduates and undergraduates in Sri
										Lanka to the corporate world immediately after graduation or
										during the last stages of their degree. It was first started
										back in 2017 and has continued its journey for 7 successful
										years.
									</p>
								</div>
							</div>
						</div>
					</div>
					{/* Right Side - Services List with Carousel */}
					<div className="w-[34%] bg-gradient-to-br">
						<div
							className="h-full px-6 lg:px-12 pt-32"
							style={{
								scrollbarWidth: "none",
								msOverflowStyle: "none",
							}}
						>
							{" "}
							<Carousel
								opts={{
									loop: true,
									align: "center",
								}}
								plugins={[
									Autoplay({
										delay: 5000,
										stopOnInteraction: true,
									}),
								]}
								className="w-full relative"
								setApi={setDesktopCarouselApi}
							>
								<CarouselContent className="-ml-2">
									{services.map((service, index) => (
										<CarouselItem key={index} className="pl-2 basis-full">
											<WhatWeDoCard
												title={service.title}
												image={service.image}
												description={service.description}
											/>
										</CarouselItem>
									))}
								</CarouselContent>
								<div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md"
										onClick={() => desktopCarouselApi?.scrollPrev()}
									>
										<ChevronLeft className="h-4 w-4" />
										<span className="sr-only">Previous slide</span>
									</Button>
								</div>
								<div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md"
										onClick={() => desktopCarouselApi?.scrollNext()}
									>
										<ChevronRight className="h-4 w-4" />
										<span className="sr-only">Next slide</span>
									</Button>
								</div>{" "}
								{/* Pagination dots for desktop view */}
								<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
									{services.map((_, index) => (
										<button
											key={index}
											onClick={() => goToDesktopSlide(index)}
											className={`w-2 h-2 rounded-full transition-all ${
												index === desktopActiveIndex
													? "bg-primary w-4"
													: "bg-gray-300"
											}`}
											aria-label={`Go to slide ${index + 1}`}
										/>
									))}
								</div>
							</Carousel>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
