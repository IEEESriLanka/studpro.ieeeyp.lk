import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { Database } from "../types/database.types";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
	process.exit(1);
}

// Service role client bypasses RLS and has auth admin API access
const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

async function main() {
	const args = process.argv.slice(2);
	const email = args[0] || process.env.ADMIN_EMAIL;
	const password = args[1] || process.env.ADMIN_PASSWORD;
	const fullName = args[2] || "Super Administrator";
	const role = (args[3] as "super_admin" | "editor") || "super_admin";

	if (!email || !password) {
		console.log("\n📖 Usage:");
		console.log("  npm run create-admin <email> <password> [fullName] [role]");
		console.log("\nExample:");
		console.log('  npm run create-admin admin@ieeeyp.lk MySecurePassword123! "Manusha Sathsara" super_admin\n');
		process.exit(1);
	}

	console.log(`\n🔐 Creating / Registering Admin Account for: ${email}`);

	// 1. Create or retrieve auth user
	const { data: userData, error: createAuthError } =
		await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			app_metadata: { role },
			user_metadata: { full_name: fullName, role },
		});

	let userId = userData?.user?.id;

	if (createAuthError) {
		if (createAuthError.message.includes("already registered") || (createAuthError as any).code === "email_exists") {
			console.log("ℹ️  Auth user already exists. Updating password & admin profile...");
			// Find user ID
			const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
			if (listErr) {
				console.error("❌ Error listing users:", listErr.message);
				process.exit(1);
			}
			const existing = usersData.users.find((u) => u.email === email);
			if (!existing) {
				console.error("❌ Could not find existing user ID.");
				process.exit(1);
			}
			userId = existing.id;

			// Update password and roles
			await supabase.auth.admin.updateUserById(userId, {
				password,
				email_confirm: true,
				app_metadata: { role },
				user_metadata: { full_name: fullName, role },
			});
		} else {
			console.error("❌ Auth creation error:", createAuthError.message);
			process.exit(1);
		}
	}

	if (!userId) {
		console.error("❌ Failed to resolve user ID.");
		process.exit(1);
	}

	// 2. Upsert into admin_profiles whitelist
	const { error: profileError } = await supabase.from("admin_profiles").upsert(
		{
			id: userId,
			email,
			full_name: fullName,
			role,
		},
		{ onConflict: "id" },
	);

	if (profileError) {
		console.error("❌ Error upserting admin profile:", profileError.message);
		process.exit(1);
	}

	console.log("\n🎉 ========================================================");
	console.log("🎉 ADMIN ACCOUNT SUCCESSFULLY CREATED & AUTHORIZED!");
	console.log(`🎉 Email: ${email}`);
	console.log(`🎉 Role : ${role}`);
	console.log(`🎉 Name : ${fullName}`);
	console.log("🎉 ========================================================\n");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
