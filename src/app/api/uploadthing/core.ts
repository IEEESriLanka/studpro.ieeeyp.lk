import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentAdmin } from "@/app/actions/auth";
import { logAuditEvent } from "@/lib/logger";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "8MB",
			maxFileCount: 6,
		},
	})
		.middleware(async () => {
			const adminSession = await getCurrentAdmin();
			if (!adminSession) {
				await logAuditEvent({
					action: "upload.rejected",
					category: "SECURITY",
					severity: "WARN",
					details: { endpoint: "imageUploader", reason: "Unauthenticated upload attempt blocked" },
				});
				throw new UploadThingError("Unauthorized: Administrator authentication required.");
			}
			return { adminId: adminSession.user.id, role: adminSession.profile.role };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			await logAuditEvent({
				action: "upload.completed",
				category: "DATA_MUTATION",
				severity: "INFO",
				actorId: metadata.adminId,
				actorRole: metadata.role,
				details: { fileUrl: file.ufsUrl || file.url, name: file.name, size: file.size },
			});
			return { url: file.ufsUrl || file.url };
		}),

	singleImageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async () => {
			const adminSession = await getCurrentAdmin();
			if (!adminSession) {
				await logAuditEvent({
					action: "upload.rejected",
					category: "SECURITY",
					severity: "WARN",
					details: { endpoint: "singleImageUploader", reason: "Unauthenticated upload attempt blocked" },
				});
				throw new UploadThingError("Unauthorized: Administrator authentication required.");
			}
			return { adminId: adminSession.user.id, role: adminSession.profile.role };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			await logAuditEvent({
				action: "upload.completed",
				category: "DATA_MUTATION",
				severity: "INFO",
				actorId: metadata.adminId,
				actorRole: metadata.role,
				details: { fileUrl: file.ufsUrl || file.url, name: file.name, size: file.size },
			});
			return { url: file.ufsUrl || file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
