"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminShellProps {
	userEmail?: string;
	userName?: string;
	userRole?: string;
	children: React.ReactNode;
}

export function AdminShell({
	userEmail = "",
	userName = "Administrator",
	userRole = "super_admin",
	children,
}: AdminShellProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
			{/* Persistent Sidebar */}
			<AdminSidebar
				userEmail={userEmail}
				userName={userName}
				userRole={userRole}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			{/* Main Layout Area offset by sidebar width on desktop */}
			<div className="lg:pl-64 flex flex-col flex-1 min-w-0">
				<AdminHeader
					userEmail={userEmail}
					userName={userName}
					userRole={userRole}
					onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
				/>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
					{children}
				</main>
			</div>
		</div>
	);
}
