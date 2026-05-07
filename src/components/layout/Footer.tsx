import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const usefulLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about-us", label: "About Us" },
	{ href: "/about-us#team", label: "Team" },
	{ href: "/events", label: "Event Timeline" },
	{ href: "/partners", label: "Partners" },
];

const nationalProjects = [
	{ href: "https://letstalk.ieeeyp.lk/", label: "Let's Talk" },
	{ href: "https://slinspire.lk/", label: "SL Inspire" },
	{ href: "https://aidriven.ieeeyp.lk/", label: "AIDSL" },
	{ href: "https://y2npro.ieeeyp.lk/", label: "Y2NPro" },
	{ href: "https://insl.ieeeyp.lk/", label: "INSL" },
];

const ieeeLinks = [
	{ href: "https://www.ieee.org/", label: "IEEE" },
	{ href: "https://ieee.lk/", label: "IEEE Sri Lanka" },
	{ href: "https://yp.ieee.org/", label: "IEEE YPSL" },
	{ href: "https://www.ieeer10.org/", label: "IEEE R10" },
];

export const FooterSocialLinks = () => (
	<div className="flex gap-6 items-start">
		<Link
			href="https://www.instagram.com/ieee.studpro/"
			target="_blank"
			rel="noopener noreferrer"
		>
			<FaInstagram className="hover:text-primary transition-colors" size={20} />
		</Link>
		<Link
			href="https://www.linkedin.com/company/ieee-studpro/"
			target="_blank"
			rel="noopener noreferrer"
		>
			<FaLinkedin className="hover:text-primary transition-colors" size={20} />
		</Link>
		<Link
			href="https://www.facebook.com/ieeestudpro/"
			target="_blank"
			rel="noopener noreferrer"
		>
			<FaFacebook className="hover:text-primary transition-colors" size={20} />
		</Link>
	</div>
);

interface FooterLinksSectionProps {
	title: string;
	links: { href: string; label: string }[];
	bold?: boolean;
}

const FooterLinksSection = ({ title, links }: FooterLinksSectionProps) => (
	<div className="flex flex-col gap-2 w-48">
		<h3 className="font-bold uppercase">{title}</h3>
		{links.map((link) => (
			<Link
				key={link.href}
				href={link.href}
				className="hover:text-primary transition-colors"
			>
				{link.label}
			</Link>
		))}
	</div>
);

export const Footer = () => (
	<footer className="row-start-3 shadow-2xl shadow-black/50 bg-white flex flex-col gap-6 md:gap-10 items-center justify-center w-full">
		<div className="flex flex-col lg:flex-row justify-around w-full px-4 sm:px-6 lg:px-16 py-6 md:py-8 mt-4 md:mt-8 gap-8 lg:gap-0">
			<div className="flex flex-col gap-4 md:gap-6 max-w-xl">
				<div className="flex flex-col items-center lg:items-start">
					<Image
						src="/images/studpro-logo.png"
						alt="StudPro Logo"
						height={40}
						width={160}
					/>
					<p className="text-xs md:text-sm mt-4 md:mt-6 text-center lg:text-justify px-4 lg:px-0">
						IEEE StudPro is a flagship initiative by IEEE Young Professionals
						Sri Lanka, aimed at empowering undergraduates and fresh graduates
						through career-focused events, industry exposure, and skill-building
						opportunities. It bridges the gap between academia and the
						professional world, guiding students on their path to career
						success.
					</p>
				</div>
				<div className="flex justify-center lg:justify-start">
					<FooterSocialLinks />
				</div>
			</div>
			<div className="flex flex-wrap justify-start sm:justify-center md:justify-around gap-8 md:gap-12 px-4">
				<FooterLinksSection title="Useful Links" links={usefulLinks} />
				<FooterLinksSection
					title="National Projects"
					links={nationalProjects}
				/>
				<FooterLinksSection title="IEEE Links" links={ieeeLinks} />
				<div className="flex flex-col gap-2">
					<h3 className="font-bold uppercase">Contact Us</h3>
					<p className="">
						Tel:{" "}
						<Link
							className="hover:text-primary transition-colors"
							href="tel:+94769409925"
						>
							+94 76 940 9925
						</Link>
					</p>
					<p className="">
						Email:{" "}
						<Link
							className="hover:text-primary transition-colors"
							href="mailto:studpro@gmail.com"
						>
							studpro.ypsl@gmail.com
						</Link>
					</p>
				</div>
			</div>
		</div>
		<div className="py-3 md:py-4 mx-4 md:mx-8 border-t border-gray-300 w-full flex justify-center">
			<p className="text-sm md:text-base text-center">
				All rights reserved &copy; {new Date().getFullYear()}
			</p>
		</div>
	</footer>
);
