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
 * Creates a new team member record.
 */
export async function createTeamMember(formData: FormData): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const cycle_id = formData.get("cycle_id") as string;
	const name = (formData.get("name") as string)?.trim();
	const role = (formData.get("role") as string)?.trim();
	const email = (formData.get("email") as string)?.trim() || null;
	const contact_no = (formData.get("contact_no") as string)?.trim() || null;
	const linkedin_url = (formData.get("linkedin_url") as string)?.trim() || null;
	const image_url = (formData.get("image_url") as string)?.trim() || null;
	const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

	if (!name || !role || !cycle_id) {
		return { error: "Name, Role, and StudPro Cycle are required." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient.from("team_members").insert({
		cycle_id,
		name,
		role,
		email,
		contact_no,
		linkedin_url,
		image_url: image_url || "/images/team/avatar.png",
		display_order,
	});

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "team.member_created",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { name, role, cycle_id },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/team");
	revalidatePath("/about-us");
	return { success: true };
}

/**
 * Updates an existing team member record.
 */
export async function updateTeamMember(
	memberId: string,
	formData: FormData,
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const cycle_id = formData.get("cycle_id") as string;
	const name = (formData.get("name") as string)?.trim();
	const role = (formData.get("role") as string)?.trim();
	const email = (formData.get("email") as string)?.trim() || null;
	const contact_no = (formData.get("contact_no") as string)?.trim() || null;
	const linkedin_url = (formData.get("linkedin_url") as string)?.trim() || null;
	const image_url = (formData.get("image_url") as string)?.trim() || null;
	const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

	if (!name || !role || !cycle_id) {
		return { error: "Name, Role, and StudPro Cycle are required." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient
		.from("team_members")
		.update({
			cycle_id,
			name,
			role,
			email,
			contact_no,
			linkedin_url,
			image_url: image_url || "/images/team/avatar.png",
			display_order,
		})
		.eq("id", memberId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "team.member_updated",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { memberId, name, role },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/team");
	revalidatePath("/about-us");
	return { success: true };
}

/**
 * Deletes a team member from the directory.
 */
export async function deleteTeamMember(memberId: string): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient
		.from("team_members")
		.delete()
		.eq("id", memberId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "team.member_deleted",
		category: "DATA_MUTATION",
		severity: "WARN",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { memberId },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/team");
	revalidatePath("/about-us");
	revalidatePath("/");
	return { success: true };
}

/**
 * Fetches leadership contact leads for public Contact Us section from active cycle.
 */
export async function getContactLeadsAction() {
	const { getContactLeadershipTeam } = await import("@/lib/data/team");
	return await getContactLeadershipTeam();
}

