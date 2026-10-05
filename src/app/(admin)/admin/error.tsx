"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[ADMIN DASHBOARD ERROR]:", error);
	}, [error]);

	return (
		<div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-12">
			<div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 shadow-xl text-center space-y-6">
				<div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
					<AlertOctagon className="w-7 h-7" />
				</div>

				<div className="space-y-2">
					<h2 className="text-2xl font-bold text-foreground">
						Admin Operation Encountered an Error
					</h2>
					<p className="text-sm text-muted-foreground">
						The admin dashboard could not complete the requested action or fetch database records.
					</p>
					{error.digest && (
						<p className="text-xs font-mono bg-muted text-muted-foreground py-1 px-2 rounded-md inline-block">
							Digest: {error.digest}
						</p>
					)}
				</div>

				<div className="flex flex-col sm:flex-row gap-3 pt-2">
					<button
						type="button"
						onClick={() => reset()}
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all active:scale-95 shadow-md shadow-primary/20"
					>
						<RefreshCw className="w-4 h-4" />
						Retry Action
					</button>
					<Link
						href="/admin"
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm transition-all active:scale-95 border border-border"
					>
						<LayoutDashboard className="w-4 h-4" />
						Admin Home
					</Link>
				</div>
			</div>
		</div>
	);
}
