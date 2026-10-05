"use client";

import { useTransition } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
	isOpen: boolean;
	title: string;
	message?: string;
	onClose: () => void;
	onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
	isOpen,
	title,
	message = "This action is permanent and cannot be undone.",
	onClose,
	onConfirm,
}: DeleteConfirmModalProps) {
	const [isPending, startTransition] = useTransition();

	if (!isOpen) return null;

	function handleConfirm() {
		startTransition(async () => {
			await onConfirm();
			onClose();
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
			<div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
				<div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
					<AlertTriangle className="w-6 h-6" />
				</div>

				<div className="space-y-1">
					<h3 className="text-lg font-bold text-white">Delete &ldquo;{title}&rdquo;?</h3>
					<p className="text-sm text-slate-400">{message}</p>
				</div>

				<div className="pt-2 flex items-center justify-end gap-3">
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
						type="button"
						onClick={handleConfirm}
						disabled={isPending}
						className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 cursor-pointer"
					>
						{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
						Delete Permanently
					</Button>
				</div>
			</div>
		</div>
	);
}
