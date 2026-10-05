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
 * Creates a new annual StudPro edition / cycle.
 */
export async function createCycle(formData: FormData): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const version = (formData.get("version") as string)?.trim();
	const year = parseInt((formData.get("year") as string) || "2026", 10);
	const description = (formData.get("description") as string)?.trim() || null;
	const is_active = formData.get("is_active") === "true";

	if (!version || isNaN(year)) {
		return { error: "Version (e.g. StudPro 10.0) and Year are required." };
	}

	const adminClient = createAdminClient();

	// If marked active, deactivate other cycles first
	if (is_active) {
		await adminClient.from("studpro_cycles").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
	}

	const { error } = await adminClient.from("studpro_cycles").insert({
		version,
		year,
		description,
		is_active,
	});

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "cycle.created",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { version, year, is_active },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/cycles");
	revalidatePath("/");
	return { success: true };
}

/**
 * Updates an existing annual cycle.
 */
export async function updateCycle(
	cycleId: string,
	formData: FormData,
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const version = (formData.get("version") as string)?.trim();
	const year = parseInt((formData.get("year") as string) || "2026", 10);
	const description = (formData.get("description") as string)?.trim() || null;
	const is_active = formData.get("is_active") === "true";

	if (!version || isNaN(year)) {
		return { error: "Version (e.g. StudPro 10.0) and Year are required." };
	}

	const adminClient = createAdminClient();

	if (is_active) {
		await adminClient.from("studpro_cycles").update({ is_active: false }).neq("id", cycleId);
	}

	const { error } = await adminClient
		.from("studpro_cycles")
		.update({
			version,
			year,
			description,
			is_active,
		})
		.eq("id", cycleId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "cycle.updated",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { cycleId, version, year, is_active },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/cycles");
	revalidatePath("/");
	return { success: true };
}

/**
 * Sets a specific cycle as the platform-wide active cycle.
 */
export async function setActiveCycle(cycleId: string): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	// Deactivate all cycles
	await adminClient.from("studpro_cycles").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");

	// Activate target cycle
	const { error } = await adminClient
		.from("studpro_cycles")
		.update({ is_active: true })
		.eq("id", cycleId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "cycle.activated",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { cycleId },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/cycles");
	revalidatePath("/");
	return { success: true };
}

/**
 * Deletes a cycle if it contains no events.
 */
export async function deleteCycle(cycleId: string): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	// Check if active cycle
	const { data: cycle } = await adminClient.from("studpro_cycles").select("is_active").eq("id", cycleId).single();
	if (cycle?.is_active) {
		return { error: "Cannot delete the active cycle. Please set another cycle as active first." };
	}

	const { error } = await adminClient
		.from("studpro_cycles")
		.delete()
		.eq("id", cycleId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "cycle.deleted",
		category: "DATA_MUTATION",
		severity: "WARN",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { cycleId },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/cycles");
	return { success: true };
}
