import { WhatWeDoCard } from "@/components/home/WhatWeDoCard";

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
		title: "Career Guidance",
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

const marqueeItems = [
	"Webinars",
	"Workshops",
	"Industry Visits",
	"Career Guidance",
	"Annual Career Fair",
];

export const WhatWeDo = () => {
	return (
		<section
			id="about"
			className="relative bg-background py-32 lg:py-40 border-t border-border overflow-hidden"
		>
			{/* Full-bleed marquee — escapes max-w container */}
			<div
				className="relative -mt-14 lg:-mt-20 mb-20 lg:mb-28 select-none pointer-events-none overflow-hidden"
				style={{
					WebkitMaskImage:
						"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
					maskImage:
						"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
				}}
				aria-hidden="true"
			>
				<div className="flex animate-marquee-x-slow whitespace-nowrap will-change-transform">
					{[
						...marqueeItems,
						...marqueeItems,
						...marqueeItems,
						...marqueeItems,
					].map((item, i) => (
						<span
							key={i}
							className="font-display text-foreground/[0.06] inline-flex items-center"
							style={{
								fontSize: "clamp(5rem, 12vw, 11rem)",
								letterSpacing: "0.02em",
								lineHeight: 1,
								paddingInline: "0.5em",
							}}
						>
							{item}
							<span className="text-[var(--primary)]/20 mx-6">·</span>
						</span>
					))}
				</div>
			</div>

			<div className="max-w-[1200px] mx-auto px-6 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
					<div className="lg:col-span-7">
						<span className="eyebrow">What we do · 05 programs</span>
						<h2
							className="mt-8 font-display text-foreground max-w-[16ch]"
							style={{
								fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
								letterSpacing: "0.015em",
								lineHeight: 0.9,
							}}
						>
							Programs that{" "}
							<em className="font-serif-italic text-[var(--primary)]">
								connect
							</em>{" "}
							students to industry.
						</h2>
					</div>
					<div className="lg:col-span-5 lg:pl-6 lg:border-l lg:border-border">
						<p className="max-w-prose text-foreground/70 leading-[1.75] text-base">
							IEEE StudPro is an annual event hosted by IEEE Young Professionals
							Sri Lanka, exposing the talents and skills of fresh graduates and
							undergraduates to the corporate world. First started in 2017, it
							has continued its journey for seven successful years.
						</p>
						<div className="mt-8 flex items-center gap-4">
							<div className="h-px w-12 bg-[var(--primary)]" />
							<span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
								Since 2017 · 7 years
							</span>
						</div>
					</div>
				</div>

				<div className="mt-20 lg:mt-28 border border-border">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
						{services.map((service, index) => (
							<WhatWeDoCard
								key={service.title}
								index={index}
								title={service.title}
								description={service.description}
								image={service.image}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
