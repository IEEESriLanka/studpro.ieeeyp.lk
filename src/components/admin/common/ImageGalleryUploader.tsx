"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { Trash2, Plus, Image as ImageIcon, Link as LinkIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressImageFiles } from "@/lib/utils/image-compression";
import { shouldBeUnoptimized } from "@/lib/utils/image";

interface ImageGalleryUploaderProps {
	name?: string;
	initialImages?: string[];
	onChange?: (images: string[]) => void;
	maxImages?: number;
}

export function ImageGalleryUploader({
	name = "images",
	initialImages = [],
	onChange,
	maxImages = 6,
}: ImageGalleryUploaderProps) {
	const [images, setImages] = useState<string[]>(initialImages);
	const [manualUrl, setManualUrl] = useState("");
	const [showUrlInput, setShowUrlInput] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	function updateImages(newImages: string[]) {
		setImages(newImages);
		if (onChange) {
			onChange(newImages);
		}
	}

	function handleRemove(index: number) {
		const updated = images.filter((_, i) => i !== index);
		updateImages(updated);
	}

	function handleAddManualUrl(e: React.FormEvent) {
		e.preventDefault();
		if (!manualUrl.trim()) return;

		const trimmed = manualUrl.trim();
		if (!images.includes(trimmed)) {
			updateImages([...images, trimmed]);
		}
		setManualUrl("");
		setShowUrlInput(false);
	}

	return (
		<div className="space-y-3">
			{/* Hidden input for form submission */}
			<input type="hidden" name={name} value={images.join(",")} />

			<div className="flex items-center justify-between">
				<label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
					<ImageIcon className="w-4 h-4 text-[#EE7929]" />
					Event Photos & Banners ({images.length}/{maxImages})
				</label>

				<button
					type="button"
					onClick={() => setShowUrlInput(!showUrlInput)}
					className="text-xs text-[#EE7929] hover:underline flex items-center gap-1 cursor-pointer"
				>
					<LinkIcon className="w-3 h-3" />
					{showUrlInput ? "Hide URL Input" : "Add Image by URL"}
				</button>
			</div>

			{/* Manual URL input drawer */}
			{showUrlInput && (
				<div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-2">
					<input
						type="url"
						value={manualUrl}
						onChange={(e) => setManualUrl(e.target.value)}
						placeholder="https://example.com/banner.jpg or /images/events/sample.jpg"
						className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-[#EE7929]"
					/>
					<Button
						type="button"
						size="sm"
						onClick={handleAddManualUrl}
						className="h-8 text-xs bg-[#EE7929] hover:bg-[#d66518] text-white"
					>
						Add
					</Button>
				</div>
			)}

			{/* Thumbnail Preview Grid */}
			{images.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
					{images.map((url, index) => (
						<div
							key={`${url}-${index}`}
							className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md"
						>
							<Image
								src={url}
								alt={`Preview ${index + 1}`}
								fill
								className="object-cover"
								unoptimized={shouldBeUnoptimized(url)}
							/>
							{/* Hover Overlay with Delete Button */}
							<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button
									type="button"
									onClick={() => handleRemove(index)}
									className="p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
									title="Remove image"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* UploadDropzone with Client-Side Auto-Compression */}
			{images.length < maxImages && (
				<div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-2 hover:border-slate-700 transition-colors">
					<UploadDropzone
						endpoint="imageUploader"
						onBeforeUploadBegin={async (files) => {
							try {
								return await compressImageFiles(files, {
									maxWidth: 1920,
									maxHeight: 1920,
									quality: 0.85,
								});
							} catch (err) {
								console.warn("Client image compression error:", err);
								return files;
							}
						}}
						onClientUploadComplete={(res) => {
							if (res && res.length > 0) {
								const newUrls = res
									.map((f) => f.ufsUrl || f.url)
									.filter(Boolean);
								updateImages([...images, ...newUrls].slice(0, maxImages));
								setUploadError(null);
							}
						}}
						onUploadError={(error: Error) => {
							setUploadError(error.message);
						}}
						appearance={{
							container: "border-0 bg-transparent py-4",
							label: "text-xs text-slate-300 font-medium",
							allowedContent: "text-[11px] text-slate-500",
							button:
								"bg-gradient-to-r from-[#EE7929] to-[#d66518] text-white text-xs font-semibold px-4 py-1.5 rounded-xl ut-ready:bg-[#EE7929]",
						}}
					/>
				</div>
			)}

			{uploadError && (
				<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
					<AlertCircle className="w-4 h-4 shrink-0" />
					<span>Upload failed: {uploadError}</span>
				</div>
			)}
		</div>
	);
}
