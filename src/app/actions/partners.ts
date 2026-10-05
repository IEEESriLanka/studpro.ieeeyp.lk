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
 * Creates a new Master Company record.
 */
export async function createCompany(formData: FormData): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const name = (formData.get("name") as string)?.trim();
	const customId = (formData.get("id") as string)?.trim();
	const logo_url = (formData.get("logo_url") as string)?.trim();
	const web_link = (formData.get("web_link") as string)?.trim() || null;

	if (!name) {
		return { error: "Company name is required." };
	}

	// Auto-generate slug ID if not explicitly provided
	const id =
		customId ||
		name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "_")
			.replace(/^_+|_+$/g, "");

	const adminClient = createAdminClient();

	const { error } = await adminClient.from("companies").insert({
		id,
		name,
		logo_url: logo_url || `/images/partners/${id}.png`,
		web_link,
	});

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "company.created",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { companyId: id, name },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/partners");
	revalidatePath("/partners");
	return { success: true };
}

/**
 * Updates an existing Master Company.
 */
export async function updateCompany(
	companyId: string,
	formData: FormData,
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const name = (formData.get("name") as string)?.trim();
	const logo_url = (formData.get("logo_url") as string)?.trim();
	const web_link = (formData.get("web_link") as string)?.trim() || null;

	if (!name) {
		return { error: "Company name is required." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient
		.from("companies")
		.update({
			name,
			logo_url: logo_url || `/images/partners/${companyId}.png`,
			web_link,
		})
		.eq("id", companyId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "company.updated",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { companyId, name },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/partners");
	revalidatePath("/partners");
	return { success: true };
}

/**
 * Deletes a company and unlinks all cycle partner associations.
 */
export async function deleteCompany(companyId: string): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	// Remove cycle links first
	await adminClient.from("cycle_partners").delete().eq("company_id", companyId);

	// Remove master company
	const { error } = await adminClient
		.from("companies")
		.delete()
		.eq("id", companyId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "company.deleted",
		category: "DATA_MUTATION",
		severity: "WARN",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { companyId },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/partners");
	revalidatePath("/partners");
	return { success: true };
}

/**
 * Assigns a partner company to a specific StudPro cycle with a partnership tier.
 */
export async function assignCyclePartner(
	formData: FormData,
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const cycle_id = formData.get("cycle_id") as string;
	const company_id = formData.get("company_id") as string;
	const tier = (formData.get("tier") as any) || "Partner";

	if (!cycle_id || !company_id) {
		return { error: "Please select both a Cycle and a Company." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient.from("cycle_partners").upsert(
		{
			cycle_id,
			company_id,
			tier,
		},
		{ onConflict: "cycle_id, company_id" },
	);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "partner.assigned",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { cycle_id, company_id, tier },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/partners");
	revalidatePath("/partners");
	return { success: true };
}

/**
 * Updates partnership tier for an assigned cycle partner.
 */
export async function updatePartnerTier(
	cycleId: string,
	companyId: string,
	tier: "Platinum" | "Gold" | "Silver" | "Bronze" | "Partner",
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient
		.from("cycle_partners")
		.update({ tier })
		.eq("cycle_id", cycleId)
		.eq("company_id", companyId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "partner.tier_updated",
		category: "DATA_MUTATION",
		severity: "INFO",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { cycleId, companyId, tier },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/partners");
	revalidatePath("/partners");
	return { success: true };
}

/**
 * Unlinks a partner company from an annual cycle.
 */
export async function removeCyclePartner(
	cycleId: string,
	companyId: string,
): Promise<ActionResponse> {
	const adminSession = await getCurrentAdmin();
	if (!adminSession) {
		return { error: "Unauthorized. Please log in as an admin." };
	}

	const adminClient = createAdminClient();

	const { error } = await adminClient
		.from("cycle_partners")
		.delete()
		.eq("cycle_id", cycleId)
		.eq("company_id", companyId);

	if (error) {
		return { error: error.message };
	}

	await logAuditEvent({
		action: "partner.removed",
		category: "DATA_MUTATION",
		severity: "WARN",
		actorId: adminSession.user.id,
		actorEmail: adminSession.user.email,
		actorRole: adminSession.profile.role,
		details: { cycleId, companyId },
	});

	revalidatePath("/admin");
	revalidatePath("/admin/partners");
	revalidatePath("/partners");
	return { success: true };
}
