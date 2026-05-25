"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/events", label: "Events" },
	{ href: "/partners", label: "Partners" },
	{ href: "/about-us", label: "About Us" },
	{ href: "/#contact-us", label: "Contact" },
];

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 8);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		if (href.startsWith("/#")) return false;
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<header
			className={cn(
				"sticky top-0 left-0 right-0 z-50 w-full transition-all duration-500",
				isScrolled
					? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_0_0_rgba(15,17,21,0.04)]"
					: "bg-transparent",
			)}
		>
			{/* Thin orange accent rule — only visible at top of page */}
			<span
				aria-hidden
				className={cn(
					"absolute top-0 left-0 h-px bg-[var(--primary)] transition-all duration-700",
					isScrolled ? "w-0 opacity-0" : "w-24 opacity-100",
				)}
			/>

			<div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-3 group"
					onClick={() => setIsOpen(false)}
				>
					<Image
						src="/images/studpro-logo.png"
						alt="StudPro"
						width={110}
						height={32}
						className={cn(
							"h-auto max-h-9 w-auto transition-[filter] duration-500",
							!isScrolled && "brightness-0 invert",
						)}
						priority
					/>
				</Link>

				<nav className="hidden md:flex items-center gap-10">
					{navLinks.map((link) => {
						const active = isActive(link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"relative text-[13px] uppercase tracking-[0.18em] transition-colors",
									isScrolled
										? active
											? "text-foreground"
											: "text-foreground/65 hover:text-foreground"
										: active
											? "text-white"
											: "text-white/70 hover:text-white",
								)}
							>
								{link.label}
								{active && (
									<span
										aria-hidden
										className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px w-5 bg-[var(--primary)]"
									/>
								)}
							</Link>
						);
					})}
				</nav>

				<div className="hidden md:block">
					<Button
						asChild
						variant="accent"
						size="sm"
						className="uppercase tracking-[0.18em] text-[12px] font-semibold rounded-none"
					>
						<Link href="/#contact-us">Apply</Link>
					</Button>
				</div>

				<button
					type="button"
					className={cn(
						"md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 transition-colors",
						isScrolled || isOpen ? "text-foreground" : "text-white",
					)}
					aria-label={isOpen ? "Close menu" : "Open menu"}
					aria-expanded={isOpen}
					onClick={() => setIsOpen((v) => !v)}
				>
					{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
				</button>
			</div>

			{isOpen && (
				<div className="md:hidden fixed inset-0 top-20 z-40 bg-background flex flex-col">
					<nav className="flex-1 flex flex-col items-start gap-8 px-6 pt-12 pb-16 max-w-[1200px] mx-auto w-full">
						{navLinks.map((link) => {
							const active = isActive(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setIsOpen(false)}
									className={cn(
										"font-display text-3xl tracking-tight transition-colors",
										active
											? "text-foreground"
											: "text-foreground/70 hover:text-foreground",
									)}
								>
									{link.label}
								</Link>
							);
						})}
						<div className="pt-6">
							<Button
								asChild
								variant="accent"
								size="lg"
								onClick={() => setIsOpen(false)}
							>
								<Link href="/#contact-us">Apply</Link>
							</Button>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
};
