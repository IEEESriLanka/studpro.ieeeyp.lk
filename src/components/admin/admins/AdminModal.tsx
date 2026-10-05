"use client";

import { useState, useTransition } from "react";
import { X, Loader2, ShieldCheck, Mail, Lock, User, AlertCircle, RefreshCw } from "lucide-react";
import { createAdminUser } from "@/app/actions/admins";
import { Button } from "@/components/ui/button";

interface AdminModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function AdminModal({ isOpen, onClose, onSuccess }: AdminModalProps) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [generatedPassword, setGeneratedPassword] = useState("");

	if (!isOpen) return null;

	function generateStrongPassword() {
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
		let pass = "";
		for (let i = 0; i < 16; i++) {
			pass += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setGeneratedPassword(pass);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);

		startTransition(async () => {
			const res = await createAdminUser(formData);
			if (res.error) {
				setError(res.error);
			} else {
				onSuccess();
				onClose();
			}
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
			<div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
				{/* Header */}
				<div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-[#EE7929]/15 text-[#EE7929] flex items-center justify-center">
							<ShieldCheck className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-white">Provision New Administrator</h2>
							<p className="text-xs text-slate-400">Invite a trusted team lead to the dashboard</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Full Name */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Full Name *
						</label>
						<div className="relative">
							<User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
							<input
								name="full_name"
								type="text"
								required
								placeholder="e.g. Kasun Perera"
								className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							/>
						</div>
					</div>

					{/* Email */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Email Address *
						</label>
						<div className="relative">
							<Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
							<input
								name="email"
								type="email"
								required
								placeholder="lead@ieee.org"
								className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
							/>
						</div>
					</div>

					{/* Password with Generator */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
								Initial Password *
							</label>
							<button
								type="button"
								onClick={generateStrongPassword}
								className="text-xs text-[#EE7929] hover:underline flex items-center gap-1 cursor-pointer"
							>
								<RefreshCw className="w-3 h-3" />
								Generate Random
							</button>
						</div>
						<div className="relative">
							<Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
							<input
								name="password"
								type="text"
								required
								value={generatedPassword}
								onChange={(e) => setGeneratedPassword(e.target.value)}
								placeholder="Min. 8 characters"
								className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none font-mono"
							/>
						</div>
					</div>

					{/* Role Selector */}
					<div className="space-y-1.5">
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
							Permission Role *
						</label>
						<select
							name="role"
							defaultValue="editor"
							required
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-[#EE7929]/50 focus:border-[#EE7929] outline-none"
						>
							<option value="editor">Editor (Can create & manage content)</option>
							<option value="super_admin">Super Admin (Full platform & admin control)</option>
						</select>
					</div>

					{/* Footer */}
					<div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isPending}
							className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isPending}
							className="bg-gradient-to-r from-[#EE7929] to-[#d66518] hover:from-[#d66518] hover:to-[#c05510] text-white font-semibold flex items-center gap-2 cursor-pointer"
						>
							{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
							Provision Admin
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
