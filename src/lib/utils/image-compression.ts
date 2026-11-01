/**
 * Client-Side Image Compression & Optimization Engine
 * Compresses oversized photos and flyers in the browser before network transmission.
 */

export interface ImageCompressionOptions {
	/** Maximum width in pixels (default: 1920) */
	maxWidth?: number;
	/** Maximum height in pixels (default: 1920) */
	maxHeight?: number;
	/** Output quality between 0.0 and 1.0 (default: 0.85) */
	quality?: number;
	/** Output MIME type (default: 'image/webp', fallbacks to 'image/jpeg') */
	mimeType?: string;
}

/**
 * Compresses a File object in the browser using HTML5 Canvas.
 * Non-image files, SVGs, or animated GIFs are returned untouched.
 */
export async function compressImageFile(
	file: File,
	options: ImageCompressionOptions = {},
): Promise<File> {
	// Skip non-images, vector SVGs, and animated GIFs
	if (
		!file.type.startsWith("image/") ||
		file.type === "image/svg+xml" ||
		file.type === "image/gif"
	) {
		return file;
	}

	const {
		maxWidth = 1920,
		maxHeight = 1920,
		quality = 0.85,
		mimeType = "image/webp",
	} = options;

	return new Promise((resolve) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(objectUrl);

			let { width, height } = img;

			// If image is already smaller than max dimensions and under 600KB, keep original
			if (width <= maxWidth && height <= maxHeight && file.size < 600 * 1024) {
				return resolve(file);
			}

			// Proportional downscale
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}
			if (height > maxHeight) {
				width = Math.round((width * maxHeight) / height);
				height = maxHeight;
			}

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return resolve(file);
			}

			// High-quality bicubic interpolation
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
			ctx.drawImage(img, 0, 0, width, height);

			canvas.toBlob(
				(blob) => {
					if (!blob || blob.size >= file.size) {
						// If compression resulted in larger file, use original
						return resolve(file);
					}

					const extension = mimeType === "image/webp" ? ".webp" : ".jpg";
					const cleanName = file.name.replace(/\.[^/.]+$/, "") + extension;

					const compressedFile = new File([blob], cleanName, {
						type: mimeType,
						lastModified: Date.now(),
					});

					resolve(compressedFile);
				},
				mimeType,
				quality,
			);
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(file);
		};

		img.src = objectUrl;
	});
}

/**
 * Compresses an array of files concurrently.
 */
export async function compressImageFiles(
	files: File[],
	options?: ImageCompressionOptions,
): Promise<File[]> {
	return Promise.all(files.map((file) => compressImageFile(file, options)));
}
