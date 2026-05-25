import { type NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/storage/mega";

// ---------------------------------------------------------------------------
// DELETE /api/upload/[id]
// ---------------------------------------------------------------------------

/**
 * Deletes a file from MEGA by its public URL.
 *
 * Request body: { fileUrl: string }
 * Response:     { success: true }
 */
export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json().catch(() => null);
		const fileUrl: string | undefined = body?.fileUrl;

		if (!fileUrl || typeof fileUrl !== "string") {
			return NextResponse.json(
				{ error: "Missing or invalid `fileUrl` in request body." },
				{ status: 400 },
			);
		}

		if (!fileUrl.startsWith("https://mega.nz/")) {
			return NextResponse.json(
				{ error: "Invalid URL: must be a mega.nz file URL." },
				{ status: 400 },
			);
		}

		await deleteFile(fileUrl);

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[DELETE /api/upload]", err);
		return NextResponse.json(
			{ error: "Delete failed. Please check server logs." },
			{ status: 500 },
		);
	}
}
