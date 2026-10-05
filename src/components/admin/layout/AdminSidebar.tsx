"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Calendar,
	Building2,
	Users,
	Layers,
	ShieldCheck,
	Activity,
	ExternalLink,
	LogOut,
	ChevronRight,
	X,
} from "lucide-react";
import { signOutAdmin } from "@/app/actions/auth";

export interface NavItem {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	exact?: boolean;
}

const navItems: NavItem[] = [
	{
		title: "Overview",
		href: "/admin",
		icon: LayoutDashboard,
		exact: true,
	},
	{
		title: "Events & Series",
		href: "/admin/events",
		icon: Calendar,
	},
	{
		title: "Partner Companies",
		href: "/admin/partners",
		icon: Building2,
	},
	{
		title: "Team Directory",
		href: "/admin/team",
		icon: Users,
	},
	{
		title: "Annual Cycles",
		href: "/admin/cycles",
		icon: Layers,
	},
	{
		title: "Security & Logs",
		href: "/admin/logs",
		icon: Activity,
	},
	{
		title: "Admins & Roles",
		href: "/admin/admins",
		icon: ShieldCheck,
	},
];

interface AdminSidebarProps {
	userEmail?: string;
	userName?: string;
	userRole?: string;
	isOpen?: boolean;
	onClose?: () => void;
}

export function AdminSidebar({
	userEmail = "",
	userName = "Administrator",
	userRole = "super_admin",
	isOpen = false,
	onClose,
}: AdminSidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Mobile Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
					onClick={onClose}
				/>
			)}

			<aside
				className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Top Branding Section */}
				<div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
					<Link href="/admin" className="flex items-center gap-3">
						<Image
							src="/images/studpro-logo.png"
							alt="StudPro Logo"
							width={110}
							height={32}
							className="h-6 w-auto"
						/>
						<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EE7929]/15 text-[#EE7929] border border-[#EE7929]/30 uppercase tracking-wider">
							Admin
						</span>
					</Link>

					{onClose && (
						<button
							onClick={onClose}
							className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					)}
				</div>

				{/* Navigation Links */}
				<div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
					<div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
						Management
					</div>

					{navItems.map((item) => {
						const isActive = item.exact
							? pathname === item.href
							: pathname === item.href || pathname.startsWith(`${item.href}/`);
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={onClose}
								className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
									isActive
										? "bg-gradient-to-r from-[#EE7929] to-[#d66518] text-white shadow-lg shadow-[#EE7929]/20"
										: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
								}`}
							>
								<div className="flex items-center gap-3">
									<Icon
										className={`w-4 h-4 transition-transform group-hover:scale-110 ${
											isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
										}`}
									/>
									<span>{item.title}</span>
								</div>
								{isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
							</Link>
						);
					})}

					<div className="pt-4 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
						Quick Links
					</div>
					<Link
						href="/"
						target="_blank"
						className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
					>
						<div className="flex items-center gap-3">
							<ExternalLink className="w-4 h-4 text-slate-400" />
							<span>Live Website</span>
						</div>
					</Link>
				</div>

				{/* Bottom User Profile Section */}
				<div className="p-3 border-t border-slate-800 bg-slate-950/40">
					<div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between gap-3">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#065E86] to-[#EE7929] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
								{userName.charAt(0).toUpperCase()}
							</div>
							<div className="min-w-0">
								<p className="text-xs font-semibold text-white truncate">
									{userName}
								</p>
								<p className="text-[10px] text-[#EE7929] capitalize font-medium truncate">
									{userRole.replace("_", " ")}
								</p>
							</div>
						</div>

						<form action={signOutAdmin}>
							<button
								type="submit"
								title="Sign Out"
								className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
							>
								<LogOut className="w-4 h-4" />
							</button>
						</form>
					</div>
				</div>
			</aside>
		</>
	);
}
