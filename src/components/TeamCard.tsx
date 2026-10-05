// Team card with image, member name, role, contact button, and social links
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaLinkedin } from "react-icons/fa";
import { MdMail, MdPhone } from "react-icons/md";

export interface TeamCardProps {
	member: {
		id?: string;
		name: string;
		role: string;
		image?: string;
		image_url?: string;
		contactNo?: string;
		contact_no?: string;
		email?: string;
		linkedIn?: string;
		linkedin_url?: string;
	};
}

export const TeamCard = ({ member }: TeamCardProps) => {
	const firstName = member.name.split(" ")[0];
	const imageSrc =
		member.image ||
		member.image_url ||
		`/images/team/${firstName}.png`;

	const contactPhone = member.contactNo || member.contact_no;
	const linkedinUrl = member.linkedIn || member.linkedin_url;
	const emailAddr = member.email;

	return (
		<Card className="bg-white hover:bg-gray-100 rounded-lg py-6 m-8 flex flex-col gap-2 items-center w-64 border-none shadow-none">
			<div className="w-64 h-64 mb-4 relative overflow-hidden rounded-full bg-slate-100 shadow-sm">
				<Image
					src={imageSrc}
					alt={member.name}
					fill={true}
					className="rounded-full object-cover aspect-square"
					unoptimized={imageSrc.startsWith("http")}
				/>
			</div>
			<h3 className="text-lg font-bold uppercase text-gray-900 dark:text-white mb-2 text-center">
				{member.name}
			</h3>
			<p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
				{member.role}
			</p>
			<div className="flex gap-6 items-center">
				{contactPhone && (
					<Link
						href={contactPhone.startsWith("tel:") ? contactPhone : `tel:${contactPhone}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-secondary hover:text-primary transition-colors"
					>
						<MdPhone size={20} />
					</Link>
				)}
				{emailAddr && (
					<Link
						href={emailAddr.startsWith("mailto:") ? emailAddr : `mailto:${emailAddr}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-secondary hover:text-primary transition-colors"
					>
						<MdMail size={20} />
					</Link>
				)}
				{linkedinUrl && (
					<Link
						href={linkedinUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-secondary hover:text-[#0A66C2] transition-colors"
					>
						<FaLinkedin size={20} />
					</Link>
				)}
			</div>
		</Card>
	);
};
