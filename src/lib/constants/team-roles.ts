/**
 * Standardized Organizing Committee Roles & Categories for IEEE StudPro.
 */

export interface RolePreset {
	value: string;
	label: string;
	category: "Executive Board" | "Advisors & Reps" | "Pillar Leads" | "Committee";
	defaultOrder: number;
	isContactLead?: boolean;
}

export const TEAM_ROLE_GROUPS: {
	groupName: "Executive Board" | "Advisors & Reps" | "Pillar Leads" | "Committee";
	roles: RolePreset[];
}[] = [
	{
		groupName: "Executive Board",
		roles: [
			{
				value: "Chairperson",
				label: "Chairperson",
				category: "Executive Board",
				defaultOrder: 1,
				isContactLead: true,
			},
			{
				value: "Secretary",
				label: "Secretary",
				category: "Executive Board",
				defaultOrder: 2,
				isContactLead: true,
			},
			{
				value: "Vice Chairperson - Program",
				label: "Vice Chairperson - Program",
				category: "Executive Board",
				defaultOrder: 3,
				isContactLead: true,
			},
			{
				value: "Vice Chairperson - Finance",
				label: "Vice Chairperson - Finance",
				category: "Executive Board",
				defaultOrder: 4,
				isContactLead: true,
			},
			{
				value: "Vice Chairperson - Public Visibility",
				label: "Vice Chairperson - Public Visibility",
				category: "Executive Board",
				defaultOrder: 5,
				isContactLead: true,
			},
		],
	},
	{
		groupName: "Advisors & Reps",
		roles: [
			{
				value: "YPSL Representative",
				label: "YPSL Representative",
				category: "Advisors & Reps",
				defaultOrder: 10,
			},
			{
				value: "Advisory Member",
				label: "Advisory Member",
				category: "Advisors & Reps",
				defaultOrder: 11,
			},
		],
	},
	{
		groupName: "Pillar Leads",
		roles: [
			{
				value: "Program Lead",
				label: "Program Lead",
				category: "Pillar Leads",
				defaultOrder: 20,
			},
			{
				value: "Logistics Lead",
				label: "Logistics Lead",
				category: "Pillar Leads",
				defaultOrder: 21,
			},
			{
				value: "Finance Lead",
				label: "Finance Lead",
				category: "Pillar Leads",
				defaultOrder: 22,
			},
			{
				value: "Public Visibility Lead",
				label: "Public Visibility Lead",
				category: "Pillar Leads",
				defaultOrder: 23,
			},
			{
				value: "Corporate Relations Lead",
				label: "Corporate Relations Lead",
				category: "Pillar Leads",
				defaultOrder: 24,
			},
			{
				value: "Design & Media Lead",
				label: "Design & Media Lead",
				category: "Pillar Leads",
				defaultOrder: 25,
			},
			{
				value: "Webmaster",
				label: "Webmaster",
				category: "Pillar Leads",
				defaultOrder: 26,
			},
			{
				value: "Editorial Lead",
				label: "Editorial Lead",
				category: "Pillar Leads",
				defaultOrder: 27,
			},
		],
	},
	{
		groupName: "Committee",
		roles: [
			{
				value: "Member Coordinator",
				label: "Member Coordinator",
				category: "Committee",
				defaultOrder: 50,
			},
			{
				value: "Committee Member",
				label: "Committee Member",
				category: "Committee",
				defaultOrder: 60,
			},
		],
	},
];

// Flat list of preset role values
export const ALL_PRESET_ROLES = TEAM_ROLE_GROUPS.flatMap((g) => g.roles);

/**
 * Returns role category name for filtering or badge styling.
 */
export function getRoleCategory(roleName: string): string {
	const found = ALL_PRESET_ROLES.find(
		(r) => r.value.toLowerCase() === (roleName || "").trim().toLowerCase(),
	);
	return found ? found.category : "Other";
}

/**
 * Returns whether this role appears on the public Contact Us leadership section.
 */
export function isContactLeadershipRole(roleName: string): boolean {
	const found = ALL_PRESET_ROLES.find(
		(r) => r.value.toLowerCase() === (roleName || "").trim().toLowerCase(),
	);
	return !!found?.isContactLead;
}

/**
 * Suggests default display order for a selected role.
 */
export function getDefaultRoleOrder(roleName: string): number {
	const found = ALL_PRESET_ROLES.find(
		(r) => r.value.toLowerCase() === (roleName || "").trim().toLowerCase(),
	);
	return found ? found.defaultOrder : 50;
}
