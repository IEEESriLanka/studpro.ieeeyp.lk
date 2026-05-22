/**
 * This file defines the list of all partner companies who partenred with us at least once.
 * Each company has
 *      a unique string `id`,
 *      a display `name`,
 *   and optional fields such a`logo`, `website`, and `previousYears` (number of years partnered before StudPro 5.0).
 * The exported `companies` array contains all company records, while `companyMap` provides fast lookup by company ID.
 * This structure supports efficient referencing and maintenance across the project.
 */

export interface Company {
	id: string; // Unique identifier for the company
	name: string; // Display name of the company
	logo?: string; // Optional logo filename for the company. default value expected to be in the `public/images/companies/<companyId>.png` if not provided
	website?: string; // website URL for the company
	previousYears?: number; // number of years the company has partnered with us before StudPro 5.0
}

export const companies: Company[] = [
	{
		id: "dialog_axiata",
		name: "Dialog Axiata",
		previousYears: 4,
	},
	{
		id: "azend_technologies",
		name: "Azend Technologies",
		logo: "azend.png",
		previousYears: 1,
	},
	{
		id: "axiata_digital_labs",
		name: "Axiata Digital Labs",
		previousYears: 1,
	},
	{
		id: "cambio_software_engineering",
		name: "Cambio Software Engineering",
	},
	{
		id: "directfn",
		name: "DirectFN",
		logo: "directfn.webp",
		previousYears: 1,
	},
	{
		id: "ncinga",
		name: "NCINGA",
		logo: "ncinga.jpg",
		previousYears: 1,
	},
	{
		id: "lseg_sri_lanka",
		name: "LSEG Sri Lanka",
		logo: "lseg.svg",
		previousYears: 3,
	},
	{
		id: "rizing_lanka",
		name: "Rizing Lanka",
	},
	{
		id: "fortude",
		name: "Fortude",
		logo: "fortude.webp",
		previousYears: 1,
	},
	{
		id: "different_technologies",
		name: ":Different Technologies",
		logo: "different.svg",
		previousYears: 1,
	},
	{
		id: "slt_mobitel",
		name: "SLT Mobitel",
		previousYears: 3,
	},
	{
		id: "enactor",
		name: "Enactor",
		logo: "enactor.jpg",
	},
	{
		id: "huex",
		name: "huex",
		previousYears: 1,
	},
	{
		id: "expernetic",
		name: "Expernetic",
		logo: "expernetic.jpeg",
	},
	{
		id: "iqz_systems",
		name: "IQZ Systems",
	},
	{
		id: "champsoft",
		name: "ChampSoft",
	},
	{
		id: "data_capture_experts",
		name: "Data Capture Experts",
		logo: "dce.webp",
	},
	{
		id: "global_market_technologies",
		name: "Global Market Technologies",
		previousYears: 1,
	},
	{
		id: "syntax_genie",
		name: "Syntax Genie",
		previousYears: 1,
	},
	{
		id: "futurelabs",
		name: "FutureLabs",
		previousYears: 1,
	},
	{
		id: "eyepax_it_consulting",
		name: "Eyepax IT Consulting",
		logo: "eyepax.jpeg",
	},
	{
		id: "nagarro",
		name: "Nagarro",
		previousYears: 1,
	},
	{
		id: "rootcode_labs",
		name: "Rootcode Labs",
		logo: "rootcode.jpg",
		previousYears: 1,
	},
	{
		id: "hayleys",
		name: "Hayleys",
		previousYears: 1,
	},
	{
		id: "99x",
		name: "99x",
		previousYears: 1,
	},
	{
		id: "veroxlabs",
		name: "VeroxLabs",
		previousYears: 1,
	},
	{
		id: "cict",
		name: "CICT",
		previousYears: 1,
	},
	{
		id: "resource_management_associates",
		name: "Resource Management Associates",
		logo: "rma.png",
		previousYears: 1,
	},
	{
		id: "brandix_lanka",
		name: "Brandix Lanka",
		previousYears: 1,
	},
	{
		id: "sagt_sri_lanka",
		name: "SAGT Sri Lanka",
		previousYears: 1,
	},
	{
		id: "paymedia",
		name: "PayMedia",
		previousYears: 1,
	},
	{
		id: "ifs_sri_lanka",
		name: "IFS Sri Lanka",
		logo: "ifs.jpeg",
		previousYears: 1,
	},
	{
		id: "persistent_systems",
		name: "Persistent Systems",
		previousYears: 1,
	},
	{
		id: "effective_solutions",
		name: "Effective Solutions",
		previousYears: 1,
	},
	{
		id: "amithi_power_consultants",
		name: "Amithi Power Consultants",
		logo: "apcl.jpeg",
		previousYears: 1,
	},
	{
		id: "elephant_house",
		name: "Elephant House",
		logo: "elephant_house.webp",
		previousYears: 1,
	},
	{
		id: "john_keells_it",
		name: "John Keells IT",
		previousYears: 1,
	},
	{
		id: "mybudget_holdings",
		name: "MyBudget Holdings",
		logo: "mybudget.webp",
		previousYears: 1,
	},
	{
		id: "evonsys",
		name: "EvonSys",
		previousYears: 1,
	},
	{
		id: "mitra_innovation",
		name: "Mitra Innovation",
		previousYears: 2,
	},
	{
		id: "pearson_lanka",
		name: "Pearson Lanka",
		previousYears: 1,
	},
	{
		id: "sixer_video",
		name: "SIXER Video",
		logo: "sixer_video.avif",
		previousYears: 1,
	},
	{
		id: "virtusa",
		name: "Virtusa",
		previousYears: 3,
	},
	{
		id: "creative_software",
		name: "Creative Software",
		previousYears: 3,
	},
	{
		id: "calcey",
		name: "Calcey",
		logo: "calcey.webp",
	},
	{
		id: "zone_24x7",
		name: "Zone 24x7",
		logo: "zone_24x7.webp",
	},
	{
		id: "codegen",
		name: "Codegen",
	},
	{
		id: "ladyproto_10_wie_affinity_group___uov",
		name: "Ladyproto 1.0: WIE affinity group _ UoV",
		logo: "ladyproto.png",
	},
	{
		id: "uor_career_fair",
		name: "UOR Career Fair",
		logo: "uor_career_fair.png",
	},
	{
		id: "altrium",
		name: "Altrium",
	},
	{
		id: "rootcode_labs",
		name: "RootCode Labs",
		logo: "rootcode.jpg",
	},
	{
		id: "acentura",
		name: "Acentura",
		logo: "acentura.jpg",
	},
	{
		id: "wso2",
		name: "WSO2",
	},
	{
		id: "vsis",
		name: "VSIS",
		logo: "vsis.jpg",
	},
	{
		id: "idea8",
		name: "Idea8",
	},
	{
		id: "inivos",
		name: "Inivos",
		logo: "inivos.jpg",
	},
	{
		id: "cms",
		name: "CMS",
		logo: "cms.png",
	},
	{
		id: "cube",
		name: "CUBE",
		logo: "cube.png",
	},
	{
		id: "econsulate",
		name: "Econsulate",
		logo: "econsulate.png",
	},
	{
		id: "pick_me",
		name: "Pick Me",
		logo: "pick_me.png",
	},
	{
		id: "nestle",
		name: "Nestle",
		logo: "nestle.png",
	},
	{
		id: "express_jobs",
		name: "Express Jobs",
		logo: "express_jobs.png",
	},
	{
		id: "mint_hrm",
		name: "Mint HRM",
		logo: "mint_hrm.png",
	},
	{
		id: "octave",
		name: "Octave",
		logo: "octave.png",
	},
	{
		id: "north_sails",
		name: "North Sails",
		logo: "north_sails.png",
	},
	{
		id: "sentry_labs",
		name: "Sentry Labs",
		logo: "sentry_labs.png",
	},
	{
		id: "gtn",
		name: "GTN",
		logo: "gtn.png",
	},
	{
		id: "hemas",
		name: "Hemas",
		logo: "hemas.jpeg",
	},
	{
		id: "dpl",
		name: "DPL",
		logo: "dpl.jpeg",
	},
	{
		id: "heyleys",
		name: "Heyleys",
		logo: "heyleys.jpeg",
	},
	{
		id: "accelr",
		name: "Accelr",
		logo: "accelr.jpeg",
	},
	{
		id: "satva",
		name: "Satva",
		logo: "satva.jpeg",
	},
];

export const companyMap: Record<string, Company> = Object.fromEntries(
	companies.map((c) => [c.id, c]),
);
