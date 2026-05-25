"use client";

import { teamMembers } from "@/data/team";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useState } from "react";

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
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const subject = encodeURIComponent(`Message from ${name}`);
		const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
		window.location.href = `mailto:studpro.ypsl@gmail.com?subject=${subject}&body=${body}`;
	};

	return (
		<section
			id="contact-us"
			className="bg-background py-32 lg:py-40 border-t border-border"
		>
			<div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
				{/* Left — editorial */}
				<div className="lg:col-span-7 flex flex-col">
					<span className="eyebrow">Get in touch</span>

					<h2
						className="mt-6 font-display text-foreground leading-[0.88]"
						style={{
							fontSize: "clamp(4rem, 10vw, 9rem)",
							letterSpacing: "0.015em",
						}}
					>
						Let&apos;s{" "}
						<em className="font-serif-italic text-[var(--primary)] not-italic">
							<span className="italic">talk.</span>
						</em>
					</h2>

					<p className="mt-8 text-muted-foreground max-w-[44ch] leading-[1.7] text-base">
						Reach out to IEEE StudPro — IEEE Young Professionals Sri Lanka for
						career guidance, industry events, and mentorship support.
					</p>

					{/* Big email "press here" */}
					<a
						href="mailto:studpro.ypsl@gmail.com"
						className="group mt-12 inline-flex items-center gap-3 w-fit"
					>
						<span className="link-rule font-display text-foreground tracking-wide text-[clamp(1.5rem,3vw,2.25rem)] leading-none">
							studpro.ypsl@gmail.com
						</span>
						<span className="w-10 h-10 flex items-center justify-center border border-border bg-card text-foreground/80 transition-all duration-500 ease-out group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] group-hover:translate-x-1">
							<ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-12" />
						</span>
					</a>

					{/* Contact vCards */}
					{contactTeam.length > 0 && (
						<div className="mt-16">
							<div className="border-t border-border grid grid-cols-1 sm:grid-cols-2">
								{contactTeam.map((member, idx) => (
									<div
										key={member.name}
										className={`relative py-6 sm:py-7 pr-6 ${
											idx % 2 === 0
												? "sm:pr-8 sm:border-r sm:border-border"
												: "sm:pl-8"
										} border-b border-border`}
									>
										<p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
											{member.role}
										</p>
										<p
											className="mt-2 font-display text-xl text-foreground leading-tight"
											style={{ letterSpacing: "0.01em" }}
										>
											{member.name}
										</p>
										<div className="mt-3 flex flex-col gap-1 text-[13px] text-muted-foreground">
											{member.email && (
												<a
													href={member.email}
													target="_blank"
													rel="noopener noreferrer"
													className="hover:text-[var(--primary)] transition-colors w-fit"
												>
													{member.email.replace("mailto:", "")}
												</a>
											)}
											{member.contactNo && (
												<a
													href={`tel:${member.contactNo}`}
													className="font-serif-italic hover:text-[var(--primary)] transition-colors w-fit"
												>
													{member.contactNo}
												</a>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Right — form */}
				<form
					onSubmit={handleSubmit}
					className="lg:col-span-5 flex flex-col gap-10 lg:pt-2"
				>
					<Field num="01" label="Name" htmlFor="contact-name">
						<input
							id="contact-name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							className="w-full border-0 bg-transparent py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 text-base"
						/>
					</Field>

					<Field num="02" label="Email" htmlFor="contact-email">
						<input
							id="contact-email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className="w-full border-0 bg-transparent py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 text-base"
						/>
					</Field>

					<Field num="03" label="Message" htmlFor="contact-message">
						<textarea
							id="contact-message"
							required
							rows={4}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Tell us a little about what you need…"
							className="w-full border-0 bg-transparent py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 resize-none text-base"
						/>
					</Field>

					<button
						type="submit"
						className="group mt-2 w-full inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white py-5 font-display uppercase tracking-[0.2em] text-sm hover:bg-[#d96b1f] transition-colors"
					>
						Send message
						<ArrowRight className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
					</button>
				</form>
			</div>
		</section>
	);
};

/**
 * Underlined editorial form field with a number prefix.
 * Uses focus-within to push the rule + label into primary state.
 */
function Field({
	num,
	label,
	htmlFor,
	children,
}: {
	num: string;
	label: string;
	htmlFor: string;
	children: React.ReactNode;
}) {
	return (
		<div className="group/field relative">
			<label
				htmlFor={htmlFor}
				className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-muted-foreground group-focus-within/field:text-[var(--primary)] transition-colors"
			>
				<span className="font-display tracking-[0.15em] text-foreground/90 group-focus-within/field:text-[var(--primary)] transition-colors">
					{num}
				</span>
				<span className="w-4 h-px bg-border group-focus-within/field:bg-[var(--primary)] transition-colors" />
				<span>{label}</span>
			</label>
			<div className="mt-2 border-b border-border group-focus-within/field:border-[var(--primary)] transition-colors">
				{children}
			</div>
		</div>
	);
}
