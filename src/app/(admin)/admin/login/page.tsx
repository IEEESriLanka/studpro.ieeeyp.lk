"use client";

import { useActionState, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, Clock } from "lucide-react";
import { signInAdmin, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

function LoginForm() {
	const searchParams = useSearchParams();
	const errorParam = searchParams.get("error");
	const reasonParam = searchParams.get("reason");

	const unauthorized = errorParam === "unauthorized";
	const sessionExpired = errorParam === "session_expired";

	const [showPassword, setShowPassword] = useState(false);
	const [state, formAction, isPending] = useActionState<AuthState, FormData>(
		signInAdmin,
		unauthorized
			? {
					error:
						"Access Denied: Your account is not authorized as an administrator.",
				}
			: { error: null },
	);

	return (
		<div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
			{/* Session Expired Notice */}
			{sessionExpired && !state?.error && (
				<div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
					<Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
					<div>
						<p className="font-semibold text-amber-200">Session Expired</p>
						<p className="text-xs text-amber-300/90 mt-0.5">
							{reasonParam === "absolute_timeout"
								? "Your 12-hour session duration limit has ended. Please sign in again."
								: "You have been signed out due to 2 hours of inactivity. Please sign in again."}
						</p>
					</div>
				</div>
			)}

			{/* Error alert banner */}
			{state?.error && (
				<div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
					<div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
					<div>{state.error}</div>
				</div>
			)}

			<form action={formAction} className="space-y-5">
				{/* Email Input */}
				<div className="space-y-2">
					<label
						htmlFor="email"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
					>
						Email Address
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
							<Mail className="w-4 h-4" />
						</div>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
							placeholder="admin@ieeeyp.lk"
							className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] transition-all"
						/>
					</div>
				</div>

				{/* Password Input */}
				<div className="space-y-2">
					<label
						htmlFor="password"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
					>
						Password
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
							<Lock className="w-4 h-4" />
						</div>
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							required
							placeholder="••••••••••••"
							className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] transition-all"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
							tabIndex={-1}
						>
							{showPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					disabled={isPending}
					className="w-full mt-2 py-2.5 h-11 bg-gradient-to-r from-[#EE7929] to-[#d66518] hover:from-[#d66518] hover:to-[#c05510] text-white font-semibold rounded-xl shadow-lg shadow-[#EE7929]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
				>
					{isPending ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Authenticating...
						</>
					) : (
						"Sign In to Dashboard"
					)}
				</Button>
			</form>

			<div className="mt-6 pt-6 border-t border-slate-800 text-center">
				<p className="text-xs text-slate-500">
					Restricted access. Public registration is disabled.
				</p>
			</div>
		</div>
	);
}

export default function AdminLoginPage() {
	return (
		<div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
			{/* Decorative background grid and gradients */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
			<div className="absolute -top-40 -left-40 w-96 h-96 bg-[#065E86]/30 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#EE7929]/20 rounded-full blur-3xl pointer-events-none" />

			{/* Back button to public website */}
			<div className="absolute top-6 left-6 z-20">
				<Link
					href="/"
					className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 backdrop-blur-sm"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Website
				</Link>
			</div>

			<div className="w-full max-w-md relative z-10">
				{/* Header Branding */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-4">
						<Image
							src="/images/studpro-logo.png"
							alt="StudPro Logo"
							width={140}
							height={45}
							className="h-9 w-auto"
							priority
						/>
					</div>
					<h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
						<ShieldCheck className="w-6 h-6 text-[#EE7929]" />
						Admin Portal
					</h1>
					<p className="text-sm text-slate-400 mt-1">
						Sign in with your authorized IEEE StudPro credentials
					</p>
				</div>

				{/* Suspense-wrapped form */}
				<Suspense
					fallback={
						<div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 flex items-center justify-center text-slate-400">
							<Loader2 className="w-6 h-6 animate-spin text-[#EE7929]" />
						</div>
					}
				>
					<LoginForm />
				</Suspense>
			</div>
		</div>
	);
}
