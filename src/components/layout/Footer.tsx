import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const exploreLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about-us", label: "About" },
	{ href: "/about-us#team", label: "Team" },
	{ href: "/events", label: "Events" },
	{ href: "/partners", label: "Partners" },
];

const socialLinks = [
	{
		href: "https://www.instagram.com/ieee.studpro/",
		label: "Instagram",
		Icon: FaInstagram,
	},
	{
		href: "https://www.linkedin.com/company/ieee-studpro/",
		label: "LinkedIn",
		Icon: FaLinkedin,
	},
	{
		href: "https://www.facebook.com/ieeestudpro/",
		label: "Facebook",
		Icon: FaFacebook,
	},
];

export const FooterSocialLinks = () => (
	<div className="flex gap-6 items-center">
		{socialLinks.map(({ href, label, Icon }) => (
			<Link
				key={href}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={label}
				className="link-rule text-background/70 hover:text-[var(--primary)] transition-colors"
			>
				<Icon size={18} />
			</Link>
		))}
	</div>
);

export const Footer = () => (
	<footer className="relative bg-foreground text-background w-full overflow-hidden">
		{/* Grain overlay */}
		<div
			className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay"
			aria-hidden="true"
		/>

		{/* Soft glow */}
		<div
			className="pointer-events-none absolute inset-0"
			aria-hidden="true"
			style={{
				background:
					"radial-gradient(50% 60% at 20% 100%, rgba(238,121,41,0.10) 0%, transparent 60%)",
			}}
		/>

		<div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-10">
			{/* Top row — giant editorial brand */}
			<div className="relative pb-16 lg:pb-20">
				<div className="flex items-center gap-3">
					<span className="h-px w-8 bg-[var(--primary)]" />
					<span className="text-[10px] uppercase tracking-[0.32em] text-background/55">
						IEEE Young Professionals · Sri Lanka
					</span>
				</div>

				<h2
					className="mt-8 font-display tracking-tight leading-[0.85] text-background select-none"
					style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
				>
					STUD<em className="font-serif-italic text-[var(--primary)]">PRO</em>
				</h2>

				<p className="mt-6 text-background/60 text-sm sm:text-base leading-[1.7] max-w-[48ch]">
					A flagship initiative bridging Sri Lankan undergraduates with the
					industries shaping their careers.
				</p>
			</div>

			{/* Thin orange accent rule */}
			<div className="relative">
				<span className="absolute left-0 top-0 h-px w-16 bg-[var(--primary)]" />
				<div className="border-t border-background/10" />
			</div>

			{/* Middle row — link columns */}
			<div className="pt-16 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
				<div className="md:col-span-4 flex flex-col gap-5">
					<Link href="/" className="inline-flex items-center">
						<Image
							src="/images/studpro-logo.png"
							alt="StudPro"
							width={140}
							height={40}
							className="h-auto max-h-10 w-auto brightness-0 invert"
						/>
					</Link>
					<p className="text-background/60 text-sm leading-relaxed max-w-xs">
						Connecting student members to the industries shaping their careers —
						since 2017.
					</p>
				</div>

				<div className="md:col-span-4 flex flex-col">
					<h3 className="text-[10px] uppercase tracking-[0.32em] text-background/45 mb-5">
						Explore
					</h3>
					<ul className="flex flex-col gap-3">
						{exploreLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="link-rule text-sm text-background/80 hover:text-[var(--primary)] transition-colors"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="md:col-span-4 flex flex-col">
					<h3 className="text-[10px] uppercase tracking-[0.32em] text-background/45 mb-5">
						Get in touch
					</h3>
					<Link
						href="mailto:studpro.ypsl@gmail.com"
						className="link-rule text-sm text-background/80 hover:text-[var(--primary)] transition-colors mb-3 self-start"
					>
						studpro.ypsl@gmail.com
					</Link>
					<Link
						href="tel:+94769409925"
						className="link-rule text-sm text-background/60 hover:text-[var(--primary)] transition-colors mb-8 self-start"
					>
						+94 76 940 9925
					</Link>
					<FooterSocialLinks />
				</div>
			</div>

			{/* Bottom row — copyright + signature */}
			<div className="mt-20 pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
				<p className="text-[10px] uppercase tracking-[0.28em] text-background/45">
					&copy; {new Date().getFullYear()} IEEE YP Sri Lanka — All rights
					reserved
				</p>
				<p className="text-[10px] uppercase tracking-[0.28em] text-background/45">
					Built with <span className="text-[var(--primary)]">care</span> in
					Colombo
				</p>
			</div>
		</div>
	</footer>
);
