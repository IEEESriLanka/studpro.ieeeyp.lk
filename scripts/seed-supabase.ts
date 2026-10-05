import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

import { companies } from "../src/data/companies";
import { partnersByYear } from "../src/data/partners";
import { events as versionsData } from "../src/data/events";
import { teamMembers } from "../src/data/team";
import type { Database } from "../types/database.types";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
	process.env.SUPABASE_SERVICE_ROLE_KEY ||
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or API Key in .env.local");
	process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
	auth: { persistSession: false },
});

/**
 * Normalizes date string into YYYY-MM-DD format
 */
function parseDate(dateStr: string, fallbackYear: number): string {
	if (!dateStr) return `${fallbackYear}-01-01`;

	const parsed = new Date(dateStr);
	if (!isNaN(parsed.getTime())) {
		return parsed.toISOString().split("T")[0];
	}

	return `${fallbackYear}-01-01`;
}

/**
 * Normalizes partner tier string
 */
function normalizeTier(
	tier?: string,
): "Platinum" | "Gold" | "Silver" | "Bronze" | "Partner" {
	if (!tier) return "Partner";
	const lower = tier.toLowerCase().trim();
	if (lower.includes("plat")) return "Platinum";
	if (lower.includes("gold")) return "Gold";
	if (lower.includes("silver")) return "Silver";
	if (lower.includes("bronze")) return "Bronze";
	return "Partner";
}

/**
 * Normalizes category
 */
function normalizeCategory(
	category: string,
): "career-fairs" | "industry-visits" | "workshops" | "webinar" {
	if (category === "cv-clinics") {
		return "career-fairs";
	}
	const validCategories = [
		"career-fairs",
		"industry-visits",
		"workshops",
		"webinar",
	];
	if (validCategories.includes(category)) {
		return category as any;
	}
	return "career-fairs";
}

async function seed() {
	console.log("\n🌱 ========================================================");
	console.log("🌱 STARTING SUPABASE DATABASE SEEDING");
	console.log("🌱 ========================================================\n");

	// 1. Seed Master Companies (Deduplicated by ID)
	const uniqueCompaniesMap = new Map<string, { id: string; name: string; logo_url: string; web_link: string | null }>();

	for (const c of companies) {
		uniqueCompaniesMap.set(c.id, {
			id: c.id,
			name: c.name,
			logo_url: c.logo ? `/images/partners/${c.logo}` : `/images/partners/${c.id}.png`,
			web_link: (c as any).website || (c as any).url || null,
		});
	}

	// Also add any company referenced in partnersByYear if missing
	for (const pYear of partnersByYear) {
		for (const p of pYear.partners) {
			if (!uniqueCompaniesMap.has(p.companyId)) {
				const autoName = p.companyId
					.split("_")
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(" ");

				uniqueCompaniesMap.set(p.companyId, {
					id: p.companyId,
					name: autoName,
					logo_url: `/images/partners/${p.companyId}.png`,
					web_link: null,
				});
			}
		}
	}

	const companyRows = Array.from(uniqueCompaniesMap.values());
	console.log(`📦 Seeding ${companyRows.length} unique master companies...`);

	for (const company of companyRows) {
		const { error } = await supabase.from("companies").upsert(company, { onConflict: "id" });
		if (error) {
			console.error(`❌ Error seeding company ${company.id}:`, error.message);
		}
	}
	console.log(`✅ Seeded ${companyRows.length} companies successfully.`);

	// 2. Seed StudPro Cycles
	console.log(`\n📦 Seeding StudPro annual cycles...`);
	const cycleMap = new Map<string, string>(); // version -> cycle_id

	for (const version of versionsData) {
		const { data: cycle, error: cycleErr } = await supabase
			.from("studpro_cycles")
			.upsert(
				{
					version: version.version,
					year: version.year,
					description: version.description || null,
					is_active: version.version === "StudPro 6.0",
				},
				{ onConflict: "version" },
			)
			.select("id, version")
			.single();

		if (cycleErr) {
			console.error(`❌ Error seeding cycle ${version.version}:`, cycleErr.message);
		} else if (cycle) {
			cycleMap.set(cycle.version, cycle.id);
			console.log(`  ✓ Cycle ${cycle.version} (ID: ${cycle.id})`);
		}
	}

	// Also ensure past cycles from partners (e.g. StudPro 4.0, 3.0) exist
	for (const pYear of partnersByYear) {
		if (!cycleMap.has(pYear.version)) {
			const { data: cycle } = await supabase
				.from("studpro_cycles")
				.upsert(
					{
						version: pYear.version,
						year: pYear.year,
						description: `${pYear.version} edition of StudPro`,
						is_active: false,
					},
					{ onConflict: "version" },
				)
				.select("id, version")
				.single();

			if (cycle) {
				cycleMap.set(cycle.version, cycle.id);
				console.log(`  ✓ Cycle ${cycle.version} (ID: ${cycle.id}) [from partners]`);
			}
		}
	}

	// 3. Seed Cycle Partners
	console.log(`\n📦 Seeding annual cycle partners...`);
	let partnerCount = 0;
	for (const pYear of partnersByYear) {
		const cycleId = cycleMap.get(pYear.version);
		if (!cycleId) continue;

		const seenCompaniesInYear = new Set<string>();

		for (let i = 0; i < pYear.partners.length; i++) {
			const p = pYear.partners[i];
			if (seenCompaniesInYear.has(p.companyId)) continue;
			seenCompaniesInYear.add(p.companyId);

			const { error: pErr } = await supabase.from("cycle_partners").upsert(
				{
					cycle_id: cycleId,
					company_id: p.companyId,
					tier: normalizeTier(p.partnerLevel),
					display_order: i,
				},
				{ onConflict: "cycle_id, company_id" },
			);

			if (!pErr) {
				partnerCount++;
			} else {
				console.error(`❌ Error linking partner ${p.companyId} to ${pYear.version}:`, pErr.message);
			}
		}
	}
	console.log(`✅ Seeded ${partnerCount} cycle-partner relations.`);

	// 4. Seed Event Series, Events, and Speakers
	console.log(`\n📦 Seeding Event Series, Events, and Speakers...`);
	let totalSeries = 0;
	let totalEvents = 0;
	let totalSpeakers = 0;

	// Clean up existing events to avoid stale duplicate rows when re-seeding
	await supabase.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");

	for (const version of versionsData) {
		const cycleId = cycleMap.get(version.version);
		if (!cycleId) continue;

		for (let sIdx = 0; sIdx < version.eventSeries.length; sIdx++) {
			const series = version.eventSeries[sIdx];

			// Check if series already exists
			let seriesId: string | null = null;
			const { data: existingSeries } = await supabase
				.from("event_series")
				.select("id")
				.eq("cycle_id", cycleId)
				.eq("title", series.title)
				.single();

			if (existingSeries) {
				seriesId = existingSeries.id;
			} else {
				const { data: seriesRow } = await supabase
					.from("event_series")
					.insert({
						cycle_id: cycleId,
						title: series.title,
						description: series.description || null,
						display_order: sIdx,
					})
					.select("id")
					.single();

				if (seriesRow) {
					seriesId = seriesRow.id;
					totalSeries++;
				}
			}

			if (!seriesId) continue;

			// Insert Events in this series
			for (const ev of series.events) {
				const { data: eventRow } = await supabase
					.from("events")
					.insert({
						cycle_id: cycleId,
						series_id: seriesId,
						category: normalizeCategory(ev.category),
						title: ev.title,
						topic: ev.topic || null,
						event_date: parseDate(ev.date, version.year),
						time: ev.time || null,
						venue: ev.venue || null,
						description: ev.description || null,
						images: ev.images || [],
					})
					.select("id")
					.single();

				if (eventRow) {
					totalEvents++;

					// Insert Speaker if present
					if (ev.speaker && ev.speaker.name) {
						const { error: spkErr } = await supabase.from("speakers").insert({
							event_id: eventRow.id,
							name: ev.speaker.name,
							title: ev.speaker.title || null,
							company: ev.speaker.company || null,
						});

						if (!spkErr) {
							totalSpeakers++;
						}
					}
				}
			}
		}
	}

	console.log(`✅ Seeded ${totalSeries} event series.`);
	console.log(`✅ Seeded ${totalEvents} individual events.`);
	console.log(`✅ Seeded ${totalSpeakers} speakers.`);

	// 5. Seed Team Members
	console.log(`\n📦 Seeding ${teamMembers.length} organizing committee members...`);
	const currentCycleId = cycleMap.get("StudPro 9.0") || null;

	const teamRows = teamMembers.map((m, index) => {
		const firstName = m.name.trim().split(" ")[0];
		return {
			cycle_id: currentCycleId,
			name: m.name,
			role: m.role,
			email: m.email ? m.email.replace(/^mailto:/, "") : null,
			contact_no: m.contactNo || null,
			linkedin_url: m.linkedIn || null,
			image_url: `/images/team/${firstName}.png`,
			display_order: index,
		};
	});

	await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
	const { error: teamErr } = await supabase.from("team_members").insert(teamRows);

	if (teamErr) {
		console.error("❌ Error seeding team members:", teamErr.message);
	} else {
		console.log(`✅ Seeded ${teamRows.length} team members successfully.`);
	}

	console.log("\n🎉 ========================================================");
	console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
	console.log("🎉 ========================================================\n");
}

seed().catch((err) => {
	console.error("Fatal error during seeding:", err);
	process.exit(1);
});
