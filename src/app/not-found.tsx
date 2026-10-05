import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Calendar, Users, Briefcase } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center pt-28 pb-16 sm:pt-36 sm:pb-20 px-4">
			<div className="max-w-xl w-full text-center space-y-6 sm:space-y-8 my-auto">
				{/* Logo with guaranteed clearance below floating navbar */}
				<div className="flex justify-center mb-2 sm:mb-4">
					<Image
						src="/images/studpro-logo.png"
						alt="IEEE StudPro"
						width={160}
						height={48}
						className="h-10 sm:h-12 w-auto object-contain dark:brightness-110"
						priority
					/>
				</div>

				{/* 404 Visual badge */}
				<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider uppercase">
					404 Error • Page Not Found
				</div>

				{/* Headings */}
				<div className="space-y-3">
					<h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
						Lost in the Career Cosmos?
					</h1>
					<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-md mx-auto">
						The page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
					</p>
				</div>

				{/* Primary Navigation Action */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<Link
						href="/"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all active:scale-95"
					>
						<Home className="w-4 h-4" />
						Return to Homepage
					</Link>
					<Link
						href="/events"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium transition-all active:scale-95 border border-gray-200 dark:border-gray-700"
					>
						<Calendar className="w-4 h-4" />
						Explore Events
					</Link>
				</div>

				{/* Quick Links Grid */}
				<div className="pt-8 border-t border-gray-200 dark:border-gray-800">
					<p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
						Popular Destinations
					</p>
					<div className="grid grid-cols-3 gap-3">
						<Link
							href="/partners"
							className="p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 flex flex-col items-center gap-1.5 transition-all"
						>
							<Briefcase className="w-4 h-4 text-blue-500" />
							Partners
						</Link>
						<Link
							href="/about-us"
							className="p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 flex flex-col items-center gap-1.5 transition-all"
						>
							<Users className="w-4 h-4 text-emerald-500" />
							About Us
						</Link>
						<Link
							href="/admin/login"
							className="p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 flex flex-col items-center gap-1.5 transition-all"
						>
							<ArrowLeft className="w-4 h-4 text-purple-500" />
							Admin Portal
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
