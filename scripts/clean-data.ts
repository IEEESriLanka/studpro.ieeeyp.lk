import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { Database } from "../types/database.types";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error("❌ Missing Supabase credentials in .env.local");
	process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

async function main() {
	console.log("\n🧹 ========================================================");
	console.log("🧹 DATABASE CYCLE UPDATE & SPEAKER CLEANUP");
	console.log("🧹 ========================================================\n");

	// 1. Remove StudPro 10.0 if present and set StudPro 9.0 (2026) as active cycle
	await supabase.from("studpro_cycles").delete().eq("version", "StudPro 10.0");
	await supabase.from("studpro_cycles").update({ is_active: false }).neq("version", "StudPro 9.0");

	const { data: c9 } = await supabase
		.from("studpro_cycles")
		.update({ is_active: true, year: 2026 })
		.eq("version", "StudPro 9.0")
		.select()
		.single();

	if (c9) {
		console.log("  ✓ Set StudPro 9.0 (2026) as active cycle");
	}

	console.log("\n🎉 Cycle settings updated successfully!");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
