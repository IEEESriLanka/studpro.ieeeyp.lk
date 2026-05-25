import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/data/team";
import { FaLinkedin } from "react-icons/fa";
import { MdMail, MdPhone } from "react-icons/md";
import { getSafeTeamImageUrl } from "@/lib/image-utils";

export interface TeamCardProps {
	member: TeamMember;
}

export const TeamCard = ({ member }: TeamCardProps) => {
	return (
		<article className="group flex flex-col">
			<div className="aspect-square overflow-hidden rounded-md bg-muted mb-5 relative">
				<Image
					src={getSafeTeamImageUrl(
						`/images/team/${member.name.split(" ")[0].toLowerCase()}.png`,
					)}
					alt={member.name}
					fill={true}
					className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
				/>
			</div>
			<h3 className="text-base font-medium tracking-tight">
				<span className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover:after:scale-x-100">
					{member.name}
				</span>
			</h3>
			<p className="text-sm text-muted-foreground mt-1">{member.role}</p>
			{(member.contactNo || member.email || member.linkedIn) && (
				<div className="flex gap-3 mt-3 text-muted-foreground">
					{member.contactNo && (
						<Link
							href={`tel:${member.contactNo}`}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
						>
							<MdPhone size={16} />
						</Link>
					)}
					{member.email && (
						<Link
							href={member.email}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
						>
							<MdMail size={16} />
						</Link>
					)}
					{member.linkedIn && (
						<Link
							href={member.linkedIn}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
						>
							<FaLinkedin size={16} />
						</Link>
					)}
				</div>
			)}
		</article>
	);
};
