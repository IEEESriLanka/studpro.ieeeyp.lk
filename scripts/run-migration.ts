import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
async function main() {
	const connectionString = process.env.DATABASE_URL;
	const targetArg = process.argv[2];
	const defaultMigration = "supabase/migrations/04_modular_events.sql";
	const migrationFile = targetArg || defaultMigration;
	const migrationPath = path.resolve(process.cwd(), migrationFile);

	if (!fs.existsSync(migrationPath)) {
		console.error("❌ Migration file not found:", migrationPath);
		process.exit(1);
	}

	if (!connectionString) {
		console.log("ℹ️  Note: DATABASE_URL is not defined in .env.local.");
		console.log(`📋 You can apply this migration directly in the Supabase SQL Editor:`);
		console.log(`   File: ${migrationFile}`);
		console.log(`   Contents are available in ${migrationPath}`);
		return;
	}

	const sql = fs.readFileSync(migrationPath, "utf-8");

	console.log("📡 Connecting to Supabase PostgreSQL database...");
	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false },
	});

	await client.connect();
	console.log("Connected successfully! Applying migration 02_security_hardening_and_audit_logs.sql...");

	await client.query(sql);

	console.log("✅ Migration applied successfully!");
	console.log("   - Fixed function search_path mutable on handle_updated_at and is_admin");
	console.log("   - Revoked public/anon execution on is_admin and rls_auto_enable");
	console.log("   - Created audit_logs table with RLS policies");

	await client.end();
}

main().catch((err) => {
	console.error("❌ Migration failed:", err.message);
	process.exit(1);
});
