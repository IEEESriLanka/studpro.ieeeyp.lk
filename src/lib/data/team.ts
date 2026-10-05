import { createAdminClient } from "@/lib/supabase/server";
import { teamMembers as staticTeamMembers, type TeamMember } from "@/data/team";

export interface PublicTeamMember {
	id: string;
	name: string;
	role: string;
	email?: string;
	contactNo?: string;
	linkedIn?: string;
	image?: string;
	displayOrder: number;
}

/**
 * Fetches the public Organizing Committee team members from Supabase for the active cycle.
 */
export async function getPublicTeamMembers(): Promise<PublicTeamMember[]> {
	try {
		const supabase = createAdminClient();

		// Find active cycle
		const { data: activeCycle } = await supabase
			.from("studpro_cycles")
			.select("id")
			.eq("is_active", true)
			.single();

		let query = supabase.from("team_members").select("*").order("display_order", { ascending: true });

		if (activeCycle) {
			query = query.eq("cycle_id", activeCycle.id);
		}

		const { data, error } = await query;

		if (!error && data && data.length > 0) {
			return data.map((m) => ({
				id: m.id,
				name: m.name,
				role: m.role,
				email: m.email || undefined,
				contactNo: m.contact_no || undefined,
				linkedIn: m.linkedin_url || undefined,
				image: m.image_url || "/images/team/avatar.png",
				displayOrder: m.display_order ?? 0,
			}));
		}
	} catch (e) {
		console.warn("Falling back to static team members:", e);
	}

	// Fallback to static data
	return staticTeamMembers.map((m, idx) => ({
		id: `member-${idx}`,
		name: m.name,
		role: m.role,
		email: m.email,
		contactNo: m.contactNo,
		linkedIn: m.linkedIn,
		image: `/images/team/${m.name.trim().split(" ")[0]}.png`,
		displayOrder: idx,
	}));
}

export const LEADERSHIP_ROLES = [
	"Chairperson",
	"Secretary",
	"Vice Chairperson - Program",
	"Vice Chairperson - Finance",
	"Vice Chairperson - Public Visibility",
];

/**
 * Fetches leadership contact leads for the Contact Us section from the active cycle.
 */
export async function getContactLeadershipTeam(): Promise<PublicTeamMember[]> {
	const allMembers = await getPublicTeamMembers();

	// Filter for leadership roles
	const matchedMembers = allMembers.filter((m) =>
		LEADERSHIP_ROLES.some(
			(role) => m.role.trim().toLowerCase() === role.toLowerCase(),
		),
	);

	// Sort according to defined hierarchy in LEADERSHIP_ROLES
	return matchedMembers.sort((a, b) => {
		const indexA = LEADERSHIP_ROLES.findIndex(
			(r) => r.toLowerCase() === a.role.trim().toLowerCase(),
		);
		const indexB = LEADERSHIP_ROLES.findIndex(
			(r) => r.toLowerCase() === b.role.trim().toLowerCase(),
		);
		return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
	});
}

