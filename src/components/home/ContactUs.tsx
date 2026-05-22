import { teamMembers } from "@/data/team";
import Link from "next/link";

const contactRoles = [
	"Chairperson",
	"Secretary",
	"Vice Chairperson - Program",
	"Vice Chairperson - Finance",
];

const contactTeam = teamMembers.filter((member) =>
	contactRoles.includes(member.role),
);

export const ContactUs = () => {
	return (
		<section
			id="contact-us"
			className="py-12 bg-transparent mt-30 text-white flex flex-col sm:flex-row justify-center items-center px-4 sm:px-20"
		>
			<div className="w-full sm:flex-1 h-full flex flex-col \ gap-2 mb-8 sm:mb-0">
				<h2 className="text-4xl font-bold text-center m-0 flex justify-center sm:justify-start items-center gap-4">
					<div className="hidden sm:block h-[2px] bg-white w-12"> </div>
					Get In Touch
				</h2>
				<p className="text-center sm:text-left mt-4">
					Reach out to IEEE StudPro – IEEE Young Professionals Sri Lanka for
					career guidance, industry events, and mentorship support!
				</p>
				<Link
					href="mailto:studpro.ypsl@gmail.com"
					className="hover:underline break-all font-semibold text-center sm:text-left"
					target="_blank"
					rel="noopener noreferrer"
				>
					studpro.ypsl@gmail.com
				</Link>
			</div>
			<div className="w-full sm:flex-1 grid grid-cols-1 sm:grid-rows justify-start sm:pl-20">
				{contactTeam.map((member, index) => (
					<div
						key={member.name}
						className={`p-6 flex flex-col items-center sm:items-start ${index !== contactTeam.length - 1 ? "border-b" : ""}`}
					>
						<h3 className="text-lg font-semibold mb-1 text-center sm:text-left">
							{member.name}
						</h3>
						<p className="text-sm text-center sm:text-left mb-1">
							{member.role}
						</p>
						<div className="flex flex-col items-center sm:items-start gap-1 font-semibold ">
							{member.email && (
								<Link
									href={member.email}
									className="hover:underline break-all"
									target="_blank"
									rel="noopener noreferrer"
								>
									{member.email.replace("mailto:", "")}
								</Link>
							)}
							{member.contactNo && (
								<Link
									href={`tel:${member.contactNo}`}
									className="hover:underline"
								>
									{member.contactNo}
								</Link>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
