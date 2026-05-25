import { type NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/mega";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ---------------------------------------------------------------------------
// POST /api/upload
// ---------------------------------------------------------------------------

/**
 * Accepts a multipart/form-data request with a single `file` field,
 * uploads it to MEGA, and returns the public URL.
 *
 * Request body: FormData { file: File }
 * Response:     { url: string }
 */
export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{
					error:
						"No file provided. Send a multipart/form-data request with a `file` field.",
				},
				{ status: 400 },
			);
		}

		// --- Validate MIME type ---
		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			return NextResponse.json(
				{
					error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
				},
				{ status: 415 },
			);
		}

		// --- Validate file size ---
		if (file.size > MAX_FILE_SIZE_BYTES) {
			return NextResponse.json(
				{
					error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)} MB. Max allowed: 10 MB.`,
				},
				{ status: 413 },
			);
		}

		// --- Convert File → Buffer ---
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// --- Sanitise filename & upload ---
		const safeFilename = sanitiseFilename(file.name);
		const url = await uploadFile(buffer, safeFilename);

		return NextResponse.json({ url }, { status: 201 });
	} catch (err) {
		console.error("[POST /api/upload]", err);
		return NextResponse.json(
			{ error: "Upload failed. Please check server logs." },
			{ status: 500 },
		);
	}
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Produces a filesystem-safe, unique filename.
 * e.g. "My Photo (1).JPG" → "my-photo-1-1748189844123.jpg"
 */
function sanitiseFilename(original: string): string {
	const ext = original.split(".").pop()?.toLowerCase() ?? "bin";
	const base = original
		.replace(/\.[^.]+$/, "") // strip extension
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dashes
		.replace(/^-+|-+$/g, "") // trim leading/trailing dashes
		.slice(0, 60); // limit length
	return `${base}-${Date.now()}.${ext}`;
}
