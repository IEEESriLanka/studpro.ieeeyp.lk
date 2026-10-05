import { createAdminClient } from "@/lib/supabase/server";
import { partnersByYear as staticPartnersByYear } from "@/data/partners";

export interface PublicPartner {
	id: string;
	name: string;
	logo: string;
	website?: string;
	partnerLevel?: "Platinum" | "Gold" | "Silver" | "Bronze" | "Partner";
}

export interface PublicPartnerYearGroup {
	year: number;
	version: string;
	partners: Array<{
		companyId: string;
		companyName: string;
		logo: string;
		website: string | null;
		partnerLevel: "Platinum" | "Gold" | "Silver" | "Bronze" | "Partner";
	}>;
}

/**
 * Fetches all partners grouped by StudPro edition/year from Supabase.
 */
export async function getPublicPartnersGroupedByYear(): Promise<PublicPartnerYearGroup[]> {
	try {
		const supabase = createAdminClient();

		const [cyclesRes, cyclePartnersRes] = await Promise.all([
			supabase
				.from("studpro_cycles")
				.select("id, version, year, is_active")
				.order("year", { ascending: false }),
			supabase
				.from("cycle_partners")
				.select(`
					cycle_id,
					tier,
					display_order,
					company:companies(id, name, logo_url, web_link)
				`)
				.order("display_order", { ascending: true }),
		]);

		if (cyclesRes.data && cyclesRes.data.length > 0) {
			const groups: PublicPartnerYearGroup[] = [];

			for (const cycle of cyclesRes.data) {
				const partnersInCycle = (cyclePartnersRes.data || [])
					.filter((cp) => cp.cycle_id === cycle.id && cp.company)
					.map((cp: any) => ({
						companyId: cp.company.id,
						companyName: cp.company.name,
						logo: cp.company.logo_url,
						website: cp.company.web_link,
						partnerLevel: cp.tier as any,
					}));

				if (partnersInCycle.length > 0) {
					groups.push({
						year: cycle.year,
						version: cycle.version,
						partners: partnersInCycle,
					});
				}
			}

			if (groups.length > 0) {
				return groups;
			}
		}
	} catch (e) {
		console.warn("Falling back to static partners data:", e);
	}

	// Fallback to static data
	return staticPartnersByYear.map((g) => ({
		year: g.year,
		version: g.version,
		partners: g.partners.map((p) => ({
			companyId: p.companyId,
			companyName: p.companyId
				.split("_")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(" "),
			logo: `/images/partners/${p.companyId}.png`,
			website: null,
			partnerLevel: (p.partnerLevel || "Partner") as any,
		})),
	}));
}

/**
 * Fetches featured partners for the homepage carousel.
 */
export async function getFeaturedPartners(): Promise<Array<{ id: string; name: string; logo: string; website?: string; partnerLevel?: string }>> {
	const groups = await getPublicPartnersGroupedByYear();
	if (groups.length === 0) return [];

	// Return latest cycle's partners
	const latest = groups[0];
	return latest.partners.map((p) => ({
		id: p.companyId,
		name: p.companyName,
		logo: p.logo,
		website: p.website || undefined,
		partnerLevel: p.partnerLevel,
	}));
}
