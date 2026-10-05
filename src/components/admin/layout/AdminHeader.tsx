"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, Shield } from "lucide-react";
import { signOutAdmin } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
	userEmail?: string;
	userName?: string;
	userRole?: string;
	onToggleSidebar: () => void;
}

export function AdminHeader({
	userEmail = "",
	userName = "Admin",
	userRole = "super_admin",
	onToggleSidebar,
}: AdminHeaderProps) {
	const pathname = usePathname();

	// Generate friendly breadcrumb from pathname
	const segments = pathname.split("/").filter(Boolean);
	const breadcrumbName =
		segments.length <= 1
			? "Dashboard Overview"
			: segments[segments.length - 1]
					.replace(/-/g, " ")
					.replace(/\b\w/g, (l) => l.toUpperCase());

	return (
		<header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
			<div className="flex items-center gap-3">
				{/* Mobile toggle button */}
				<button
					type="button"
					onClick={onToggleSidebar}
					className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
					aria-label="Toggle navigation menu"
				>
					<Menu className="w-5 h-5" />
				</button>

				{/* Breadcrumb path */}
				<div className="flex items-center gap-2 text-sm font-medium">
					<span className="text-slate-500 hidden sm:inline">Admin</span>
					<span className="text-slate-600 hidden sm:inline">/</span>
					<span className="text-white font-semibold">{breadcrumbName}</span>
				</div>
			</div>

			{/* Right actions */}
			<div className="flex items-center gap-3 sm:gap-4">
				<Link
					href="/"
					target="_blank"
					className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors"
				>
					<span>View Live Site</span>
					<ExternalLink className="w-3.5 h-3.5" />
				</Link>

				<div className="hidden sm:flex flex-col text-right">
					<span className="text-xs font-semibold text-white">{userName}</span>
					<span className="text-[10px] text-[#EE7929] capitalize flex items-center justify-end gap-1">
						<Shield className="w-3 h-3" />
						{userRole.replace("_", " ")}
					</span>
				</div>

				<form action={signOutAdmin}>
					<Button
						type="submit"
						variant="outline"
						size="sm"
						className="h-8 text-xs border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 cursor-pointer"
					>
						Sign Out
					</Button>
				</form>
			</div>
		</header>
	);
}
