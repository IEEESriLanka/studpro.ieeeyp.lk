import LenisWrapper from "@/components/layout/LenisWrapper";
import { teamMembers } from "@/data/team";
import { TeamCard } from "@/components/TeamCard";

export default function PartnersPage() {
	const vision =
		"Our vision is to create a platform that connects students with opportunities, resources, and each other, fostering a community of growth and collaboration.";
	const mission =
		"Our mission is to empower students by providing them with the tools, resources, and connections they need to succeed academically and professionally.";

	return (
		<div className="min-h-screen bg-background">
			<LenisWrapper>
				<section className="pt-40 pb-24 lg:pt-48 lg:pb-32">
					<div className="max-w-[1200px] mx-auto px-6 lg:px-12">
						<p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
							About
						</p>
						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.95] max-w-[20ch] mt-6">
							Building Sri Lanka&apos;s <em className="italic">next</em>{" "}
							engineering generation.
						</h1>
						<p className="text-base lg:text-lg text-muted-foreground max-w-[55ch] mt-8">
							A student-led IEEE Young Professionals initiative connecting
							undergraduates across the island with the people, programs, and
							projects that shape their careers.
						</p>
					</div>
				</section>

				<section className="py-24 border-t border-border">
					<div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
								Vision
							</p>
							<p className="text-lg leading-relaxed text-foreground/85 max-w-[50ch] mt-6">
								{vision}
							</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
								Mission
							</p>
							<p className="text-lg leading-relaxed text-foreground/85 max-w-[50ch] mt-6">
								{mission}
							</p>
						</div>
					</div>
				</section>

				<section id="team" className="py-24 lg:py-32 border-t border-border">
					<div className="max-w-[1200px] mx-auto px-6 lg:px-12">
						<p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
							Our team
						</p>
						<h2 className="font-display text-4xl lg:text-5xl tracking-tight mt-2">
							The people behind the program.
						</h2>
						<div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
							{teamMembers.map((member, index) => (
								<TeamCard key={index} member={member} />
							))}
						</div>
					</div>
				</section>
			</LenisWrapper>
		</div>
	);
}
