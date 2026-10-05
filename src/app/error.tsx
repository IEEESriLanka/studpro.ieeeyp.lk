"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[APPLICATION ERROR CAPTURED]:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center pt-28 pb-16 sm:pt-36 sm:pb-20 px-4">
			<div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6 my-auto">
				<div className="mx-auto w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
					<AlertTriangle className="w-7 h-7" />
				</div>

				<div className="space-y-2">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Something Went Wrong
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						An unexpected error occurred while processing your request. Our technical team has been notified.
					</p>
					{error.digest && (
						<p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 py-1 px-2 rounded-md inline-block">
							Error ID: {error.digest}
						</p>
					)}
				</div>

				<div className="flex flex-col sm:flex-row gap-3 pt-2">
					<button
						type="button"
						onClick={() => reset()}
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all active:scale-95 shadow-md shadow-blue-500/20"
					>
						<RefreshCw className="w-4 h-4" />
						Try Again
					</button>
					<Link
						href="/"
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-sm transition-all active:scale-95 border border-gray-200 dark:border-gray-700"
					>
						<Home className="w-4 h-4" />
						Return Home
					</Link>
				</div>
			</div>
		</div>
	);
}
