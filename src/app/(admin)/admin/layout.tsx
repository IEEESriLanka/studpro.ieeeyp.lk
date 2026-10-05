import type { Metadata } from "next";
import { getCurrentAdmin } from "@/app/actions/auth";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export const metadata: Metadata = {
	title: "StudPro Admin Dashboard",
	description: "Management portal for IEEE StudPro events, partners, and team",
	robots: "noindex, nofollow",
};

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const adminSession = await getCurrentAdmin();

	// If unauthenticated or accessing login page, render children directly without admin shell
	if (!adminSession) {
		return <>{children}</>;
	}

	const { user, profile } = adminSession;

	return (
		<AdminShell
			userEmail={user.email}
			userName={profile.full_name || "Admin"}
			userRole={profile.role}
		>
			{children}
		</AdminShell>
	);
}
