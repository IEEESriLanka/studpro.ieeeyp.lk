/**
 * Standardized Event Constants, Types, and Helper Utilities
 * Part of Option 1: Unified Modular Event Architecture.
 */

export type DeliveryMode = "physical" | "online" | "hybrid";

export interface DeliveryModeConfig {
	value: DeliveryMode;
	label: string;
	shortLabel: string;
	description: string;
}

export const DELIVERY_MODES: Record<DeliveryMode, DeliveryModeConfig> = {
	physical: {
		value: "physical",
		label: "Physical (In-Person Venue)",
		shortLabel: "Physical Venue",
		description: "Requires an in-person physical venue location (e.g. auditorium, campus).",
	},
	online: {
		value: "online",
		label: "Online / Virtual Webinar",
		shortLabel: "Online Webinar",
		description: "Streamed virtually via Zoom, Teams, Google Meet, or YouTube Live.",
	},
	hybrid: {
		value: "hybrid",
		label: "Hybrid (In-Person & Live Stream)",
		shortLabel: "Hybrid Session",
		description: "Hosted at a physical venue with simultaneous virtual access.",
	},
};

export interface SpeakerInput {
	id?: string;
	name: string;
	title?: string | null;
	company?: string | null;
	avatar_url?: string | null;
	display_order?: number;
}

export interface EventCompanyInput {
	company_id: string;
	role?: string; // 'Partner' | 'Host' | 'Sponsor' | 'Co-organizer'
}

export const EVENT_CATEGORIES = [
	{ value: "career-fairs", label: "Career Fairs & CV Clinics" },
	{ value: "industry-visits", label: "Industry Visits" },
	{ value: "workshops", label: "Workshops" },
	{ value: "webinar", label: "Webinars" },
] as const;

export const POPULAR_SERIES_SUGGESTIONS = [
	"Young Protegé",
	"TechNova Bootcamp",
	"Industry Connect",
	"Future Leaders Summit",
];

export const SERIES_STAGES_SUGGESTIONS = [
	"Stage 1: Awareness Session",
	"Stage 2: Technical Bootcamp",
	"Stage 3: Mentorship Round",
	"Stage 4: Grand Finale & Summit",
];
