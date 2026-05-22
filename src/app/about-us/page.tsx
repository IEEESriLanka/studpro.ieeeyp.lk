import LenisWrapper from "@/components/layout/LenisWrapper";
import { teamMembers } from "@/data/team";
import { TeamCard } from "@/components/TeamCard";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PartnersPage() {
	const vssion =
		"Our vision is to create a platform that connects students with opportunities, resources, and each other, fostering a community of growth and collaboration.";
	const mission =
		"Our mission is to empower students by providing them with the tools, resources, and connections they need to succeed academically and professionally.";

	return (
		<div className="min-h-screen bg-white p-10">
			<LenisWrapper>
				<h1 className="mt-24 text-5xl font-bold text-center">About US</h1>
				<div className="max-w-6xl mx-auto px-4 py-16">
					<div className="flex flex-col sm:flex-row gap-8">
						<Card
							className={cn(
								"bg-white dark:bg-gray-800 rounded-lg shadow-md p-6",
							)}
						>
							<h2 className="text-2xl font-bold mb-4 text-primary">Vision</h2>
							<p className=" ">{vssion}</p>
						</Card>
						<Card
							className={cn(
								"bg-white dark:bg-gray-800 rounded-lg shadow-md p-6",
							)}
						>
							<h2 className="text-2xl font-bold mb-4 text-secondary">
								Mission
							</h2>
							<p className=" ">{mission}</p>
						</Card>
					</div>
					<div id="team" className="mt-16">
						<h1 className="text-3xl font-bold uppercase text-center sm:text-start">
							{" "}
							Our Team{" "}
						</h1>
						<div className="flex flex-wrap justify-center items-center pt-8">
							{teamMembers.map((member, index) => (
								<TeamCard key={index} member={member} />
							))}
						</div>
					</div>
				</div>
			</LenisWrapper>
		</div>
	);
}
