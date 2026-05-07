"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={`fixed top-0 left-0 right-0 flex justify-center mt-4 z-50 transition-all duration-300`}
		>
			<nav
				className={`px-4 md:px-8 lg:px-16 flex justify-between items-center bg-gray-50 backdrop-blur rounded-lg shadow-md w-full max-w-[95%] md:max-w-10/12 mx-auto ${isScrolled ? "h-14" : "h-16"} transition-all duration-300 relative z-50`}
			>
				<Link href="/" className="flex items-center">
					<Image
						src="/images/studpro-logo.png"
						alt="StudPro Logo"
						width={110}
						height={0}
						className="h-auto max-h-10"
					/>
				</Link>

				{/* Desktop menu */}
				<div className="hidden md:flex gap-4 lg:gap-8">
					<Link href="/" className="hover:text-primary transition-colors">
						Home
					</Link>
					<Link href="/events" className="hover:text-primary transition-colors">
						Events
					</Link>
					<Link
						href="/partners"
						className="hover:text-primary transition-colors"
					>
						Partners
					</Link>
					<Link
						href="/about-us"
						className="hover:text-primary transition-colors"
					>
						About Us
					</Link>
					<Link
						href="/#contact-us"
						className="hover:text-primary transition-colors"
					>
						Contact Us
					</Link>
				</div>

				{/* Mobile menu (Shadcn Dropdown) */}
				<div className="md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								className="flex items-center justify-center focus:outline-none"
								aria-label="Toggle menu"
							>
								<Menu className="w-5 h-5" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-56 mt-2 bg-white/60 backdrop-blur-sm border-none"
						>
							<DropdownMenuItem asChild>
								<Link href="/" className="w-full cursor-pointer">
									Home
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/events" className="w-full cursor-pointer">
									Events
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/partners" className="w-full cursor-pointer">
									Partners
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/about-us" className="w-full cursor-pointer">
									About Us
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/#contact-us" className="w-full cursor-pointer">
									Contact Us
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
		</div>
	);
};
