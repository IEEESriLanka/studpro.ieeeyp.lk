"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/logger";

export type ActionResponse = {
	success?: boolean;
	error?: string | null;
};

/**
 * Invites / Creates a new administrator account (Super Admin only).
 * Provisions both app_metadata (tamper-proof) and user_metadata.
 */
export async function createAdminUser(formData: FormData): Promise<ActionResponse> {
	const currentAdmin = await getCurrentAdmin();
	if (!currentAdmin || currentAdmin.profile.role !== "super_admin") {
		await logAuditEvent({
			action: "admin.create.unauthorized",
			category: "SECURITY",
			severity: "WARN",
			actorId: currentAdmin?.user.id,
			actorEmail: currentAdmin?.user.email,
			details: { reason: "Non-super_admin attempted to provision an admin" },
		});
		return { error: "Permission Denied: Only Super Admins can provision new administrator accounts." };
	}

	const email = (formData.get("email") as string)?.trim().toLowerCase();
	const full_name = (formData.get("full_name") as string)?.trim();
	const password = (formData.get("password") as string)?.trim();
	const role = (formData.get("role") as "super_admin" | "editor") || "editor";

	if (!email || !full_name || !password) {
		return { error: "Email, Full Name, and Initial Password are required." };
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters long." };
	}

	const adminClient = createAdminClient();

	// 1. Create auth user in Supabase Auth with server-controlled app_metadata
	const { data: newUser, error: authErr } = await adminClient.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		app_metadata: {
			role,
		},
		user_metadata: {
			full_name,
			role,
		},
	});

	if (authErr || !newUser.user) {
		await logAuditEvent({
			action: "admin.create.failed",
			category: "SECURITY",
			severity: "WARN",
			actorEmail: currentAdmin.user.email,
			details: { targetEmail: email, reason: authErr?.message },
		});
		return { error: authErr?.message || "Failed to create administrator account." };
	}

	// 2. Insert into admin_profiles
	const { error: profileErr } = await adminClient.from("admin_profiles").upsert({
		id: newUser.user.id,
		email,
		full_name,
		role,
	});

	if (profileErr) {
		return { error: profileErr.message };
	}

	// 3. Log Audit Event
	await logAuditEvent({
		action: "admin.user_created",
		category: "SECURITY",
		severity: "CRITICAL",
		actorId: currentAdmin.user.id,
		actorEmail: currentAdmin.user.email,
		actorRole: currentAdmin.profile.role,
		details: { createdUserId: newUser.user.id, createdEmail: email, assignedRole: role },
	});

	revalidatePath("/admin/admins");
	return { success: true };
}

/**
 * Updates an admin user's role (Super Admin only).
 */
export async function updateAdminRole(
	userId: string,
	newRole: "super_admin" | "editor",
): Promise<ActionResponse> {
	const currentAdmin = await getCurrentAdmin();
	if (!currentAdmin || currentAdmin.profile.role !== "super_admin") {
		return { error: "Permission Denied: Only Super Admins can modify administrator roles." };
	}

	if (currentAdmin.user.id === userId && newRole !== "super_admin") {
		return { error: "Cannot demote your own Super Admin account." };
	}

	const adminClient = createAdminClient();

	// Update Supabase Auth app_metadata and user_metadata
	const { error: authErr } = await adminClient.auth.admin.updateUserById(userId, {
		app_metadata: { role: newRole },
		user_metadata: { role: newRole },
	});

	if (authErr) {
		return { error: authErr.message };
	}

	// Update public table
	const { error: profileErr } = await adminClient
		.from("admin_profiles")
		.update({ role: newRole })
		.eq("id", userId);

	if (profileErr) {
		return { error: profileErr.message };
	}

	await logAuditEvent({
		action: "admin.role_updated",
		category: "SECURITY",
		severity: "CRITICAL",
		actorId: currentAdmin.user.id,
		actorEmail: currentAdmin.user.email,
		actorRole: currentAdmin.profile.role,
		details: { targetUserId: userId, newRole },
	});

	revalidatePath("/admin/admins");
	return { success: true };
}

/**
 * Revokes / Deletes an administrator account (Super Admin only).
 */
export async function deleteAdminUser(userId: string): Promise<ActionResponse> {
	const currentAdmin = await getCurrentAdmin();
	if (!currentAdmin || currentAdmin.profile.role !== "super_admin") {
		return { error: "Permission Denied: Only Super Admins can revoke access." };
	}

	if (currentAdmin.user.id === userId) {
		return { error: "Cannot delete your own active administrator account." };
	}

	const adminClient = createAdminClient();

	// Delete from admin_profiles
	await adminClient.from("admin_profiles").delete().eq("id", userId);

	// Delete from auth.users
	const { error } = await adminClient.auth.admin.deleteUser(userId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "admin.user_deleted",
		category: "SECURITY",
		severity: "CRITICAL",
		actorId: currentAdmin.user.id,
		actorEmail: currentAdmin.user.email,
		actorRole: currentAdmin.profile.role,
		details: { deletedUserId: userId },
	});

	revalidatePath("/admin/admins");
	return { success: true };
}
