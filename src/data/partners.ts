import { Company, companyMap } from "@/data/companies";

export interface PartnerRecord {
	companyId: string;
	partnerLevel?: string;
}

export interface PartnersByYear {
	year: number;
	version: string;
	partners: PartnerRecord[];
}

export interface Partner extends Company {
	partnerLevel?: string;
}

export const partnersByYear: PartnersByYear[] = [
	{
		year: 2022,
		version: "StudPro 5.0",
		partners: [
			{
				companyId: "dialog_axiata",
				partnerLevel: "Platinum",
			},
			{
				companyId: "azend_technologies",
				partnerLevel: "Platinum",
			},
			{
				companyId: "axiata_digital_labs",
				partnerLevel: "Platinum",
			},
			{
				companyId: "cambio_software_engineering",
				partnerLevel: "Platinum",
			},
			{
				companyId: "directfn",
				partnerLevel: "Gold",
			},
			{
				companyId: "ncinga",
				partnerLevel: "Gold",
			},
			{
				companyId: "lseg_sri_lanka",
				partnerLevel: "Silver",
			},
			{
				companyId: "rizing_lanka",
				partnerLevel: "Silver",
			},
			{
				companyId: "fortude",
				partnerLevel: "Bronze",
			},
			{
				companyId: "different_technologies",
				partnerLevel: "Bronze",
			},
			{
				companyId: "slt_mobitel",
			},
			{
				companyId: "enactor",
			},
			{
				companyId: "huex",
			},
			{
				companyId: "expernetic",
			},
			{
				companyId: "iqz_systems",
			},
			{
				companyId: "champsoft",
			},
			{
				companyId: "data_capture_experts",
			},
		],
	},
	{
		year: 2023,
		version: "StudPro 6.0",
		partners: [
			{
				companyId: "dialog_axiata",
			},
			{
				companyId: "huex",
			},
			{
				companyId: "global_market_technologies",
			},
			{
				companyId: "syntax_genie",
			},
			{
				companyId: "futurelabs",
			},
			{
				companyId: "eyepax_it_consulting",
			},
			{
				companyId: "nagarro",
				partnerLevel: "Bronze",
			},
			{
				companyId: "rootcode_labs",
				partnerLevel: "Bronze",
			},
			{
				companyId: "hayleys",
			},
			{
				companyId: "99x",
				partnerLevel: "Gold",
			},
			{
				companyId: "different_technologies",
				partnerLevel: "Gold",
			},
			{
				companyId: "veroxlabs",
			},
			{
				companyId: "cict",
			},
			{
				companyId: "resource_management_associates",
				partnerLevel: "Bronze",
			},
			{
				companyId: "brandix_lanka",
			},
			{
				companyId: "azend_technologies",
			},
			{
				companyId: "sagt_sri_lanka",
				partnerLevel: "Bronze",
			},
			{
				companyId: "paymedia",
			},
			{
				companyId: "ifs_sri_lanka",
				partnerLevel: "Gold",
			},
			{
				companyId: "persistent_systems",
			},
			{
				companyId: "effective_solutions",
				partnerLevel: "Bronze",
			},
			{
				companyId: "amithi_power_consultants",
			},
			{
				companyId: "elephant_house",
			},
			{
				companyId: "john_keells_it",
			},
			{
				companyId: "mybudget_holdings",
			},
			{
				companyId: "evonsys",
				partnerLevel: "Bronze",
			},
			{
				companyId: "mitra_innovation",
				partnerLevel: "Gold",
			},
			{
				companyId: "pearson_lanka",
				partnerLevel: "Gold",
			},
			{
				companyId: "lseg_sri_lanka",
			},
			{
				companyId: "sixer_video",
				partnerLevel: "Bronze",
			},
			{
				companyId: "virtusa",
			},
			{
				companyId: "creative_software",
			},
			{
				companyId: "slt_mobitel",
			},
		],
	},
	{
		year: 2024,
		version: "StudPro 7.0",
		partners: [
			{
				companyId: "ifs_sri_lanka",
				partnerLevel: "Industry",
			},
			{
				companyId: "dialog_axiata",
				partnerLevel: "Industry",
			},
			{
				companyId: "slt_mobitel",
				partnerLevel: "Industry",
			},
			{
				companyId: "virtusa",
				partnerLevel: "Industry",
			},
			{
				companyId: "calcey",
				partnerLevel: "Industry",
			},
			{
				companyId: "zone_24x7",
				partnerLevel: "Industry",
			},
			{
				companyId: "codegen",
				partnerLevel: "Industry",
			},
			{
				companyId: "ladyproto_10_wie_affinity_group___uov",
				partnerLevel: "Ecosystem",
			},
			{
				companyId: "uor_career_fair",
				partnerLevel: "Ecosystem",
			},
		],
	},
	{
		year: 2025,
		version: "StudPro 8.0",
		partners: [
			{
				companyId: "cambio_software_engineering",
				partnerLevel: "Industry",
			},
			{
				companyId: "altrium",
				partnerLevel: "Industry",
			},
			{
				companyId: "ifs_sri_lanka",
				partnerLevel: "Industry",
			},
			{
				companyId: "rootcode_labs",
				partnerLevel: "Industry",
			},
			{
				companyId: "acentura",
				partnerLevel: "Industry",
			},
			{
				companyId: "wso2",
				partnerLevel: "Industry",
			},
			{
				companyId: "vsis",
				partnerLevel: "Industry",
			},
			{
				companyId: "nagarro",
				partnerLevel: "Industry",
			},
			{
				companyId: "virtusa",
				partnerLevel: "Industry",
			},
			{
				companyId: "idea8",
				partnerLevel: "Industry",
			},
			{
				companyId: "inivos",
				partnerLevel: "Industry",
			},
		],
	}, {
		year: 2026,
		version: "StudPro 9.0",
		partners: [
			{
				companyId: "vsis",
				partnerLevel: "Industry",
			}, {
				companyId: "slt_mobitel",
			}, {
				companyId: "ifs_sri_lanka",
				partnerLevel: "Gold",
			},{
				companyId: "effective_solutions",
				partnerLevel: "Bronze",
			},{
				companyId: "john_keells_it",
			},{
				companyId: "nagarro",
				partnerLevel: "Industry",
			},{
				companyId: "virtusa",
				partnerLevel: "Industry",
			},{
				companyId: "hayleys",
			},
			{
				companyId: "cms",
			},
			{
				companyId: "econsulate",
			},
			{
				companyId: "pick_me",
			},
			{
				companyId: "nestle",
			},
			{
				companyId: "express_jobs",
			},
			{
				companyId: "mint_hrm",
			},
			{
				companyId: "octave",
			},
			{
				companyId: "north_sails",
			},
			{
				companyId: "sentry_labs",
			},
			{
				companyId: "gtn",
			},
			{
				companyId: "hemas",
			},
			{
				companyId: "dpl",
			},
			{
				companyId:"heyleys"
			},
			{
				companyId: "accelr",
			},
			{
				companyId: "satva",
			}

		],
	},
];

export function calculatePartnerYears(partner: PartnerRecord): number {
	// Count the number of year groups a partner occurs in
	return (
		partnersByYear.filter((yearGroup: PartnersByYear) =>
			yearGroup.partners.some(
				(p: PartnerRecord) => p.companyId === partner.companyId,
			),
		).length + (companyMap[partner.companyId]?.previousYears ?? 0)
	);
}

export function getPartnerByPartnerRecord(partner: PartnerRecord): Partner {
	// Get the company details from the companyMap
	return {
		...companyMap[partner.companyId],
		partnerLevel: partner.partnerLevel,
	};
}
