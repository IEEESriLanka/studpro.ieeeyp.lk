"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, getClientMetadata } from "@/lib/logger";
import {
	checkRateLimit,
	recordFailedAttempt,
	clearRateLimit,
} from "@/lib/rate-limiter";
import { ADMIN_SESSION_CONFIG, checkSessionExpiry } from "@/lib/constants/auth";

export type AuthState = {
	error?: string | null;
	success?: boolean;
};

/**
 * Signs in an admin user using email and password.
 * Validates existence of admin role in tamper-proof metadata and admin_profiles.
 * Protected with sliding-window brute-force rate limiting.
 */
export async function signInAdmin(
	prevState: AuthState | null,
	formData: FormData,
): Promise<AuthState> {
	const email = (formData.get("email") as string)?.trim().toLowerCase();
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Please provide both email and password." };
	}

	const clientMeta = await getClientMetadata();
	const emailRateLimit = checkRateLimit(`login:email:${email}`, 5, 15 * 60 * 1000);
	const ipRateLimit = checkRateLimit(`login:ip:${clientMeta.ipAddress}`, 10, 15 * 60 * 1000);

	if (!emailRateLimit.allowed || !ipRateLimit.allowed) {
		const retryMinutes = Math.ceil(
			Math.max(emailRateLimit.resetInSeconds, ipRateLimit.resetInSeconds) / 60,
		);
		await logAuditEvent({
			action: "auth.login.rate_limited",
			category: "SECURITY",
			severity: "CRITICAL",
			actorEmail: email,
			details: {
				reason: "Rate limit exceeded (brute-force protection)",
				ipAddress: clientMeta.ipAddress,
				retryMinutes,
			},
		});
		return {
			error: `Too many failed login attempts. For security reasons, please wait ${retryMinutes} minute(s) before trying again.`,
		};
	}

	const supabase = await createClient();

	// 1. Authenticate with Supabase Auth
	const { data: authData, error: authError } =
		await supabase.auth.signInWithPassword({
			email,
			password,
		});

	if (authError || !authData.user) {
		recordFailedAttempt(`login:email:${email}`);
		recordFailedAttempt(`login:ip:${clientMeta.ipAddress}`);

		await logAuditEvent({
			action: "auth.login.failed",
			category: "SECURITY",
			severity: "WARN",
			actorEmail: email,
			details: { reason: authError?.message || "Invalid credentials" },
		});
		return { error: authError?.message || "Invalid login credentials." };
	}

	// Clear rate limits on successful auth
	clearRateLimit(`login:email:${email}`);
	clearRateLimit(`login:ip:${clientMeta.ipAddress}`);

	// 2. Verify strict admin authorization: check app_metadata (tamper-proof) then user_metadata
	const role =
		authData.user.app_metadata?.role ||
		authData.user.user_metadata?.role;

	if (role !== "super_admin" && role !== "editor") {
		// Immediately sign out unauthorized account
		await supabase.auth.signOut();
		await logAuditEvent({
			action: "auth.login.blocked",
			category: "SECURITY",
			severity: "CRITICAL",
			actorId: authData.user.id,
			actorEmail: email,
			details: { reason: "User has no authorized admin role in metadata" },
		});
		return {
			error:
				"Access Denied: Your account is not authorized as an administrator. Please contact IEEE YP leadership.",
		};
	}

	// Log successful login
	await logAuditEvent({
		action: "auth.login.success",
		category: "AUTH",
		severity: "INFO",
		actorId: authData.user.id,
		actorEmail: email,
		actorRole: role,
		details: { method: "password" },
	});

	// 3. Initialize administrative session tracking cookies
	const cookieStore = await cookies();
	const isProd = process.env.NODE_ENV === "production";
	const nowStr = Date.now().toString();

	cookieStore.set(ADMIN_SESSION_CONFIG.COOKIE_SESSION_START, nowStr, {
		httpOnly: true,
		secure: isProd,
		sameSite: "lax",
		path: "/",
		maxAge: ADMIN_SESSION_CONFIG.ABSOLUTE_TIMEOUT_SECONDS,
	});
	cookieStore.set(ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE, nowStr, {
		httpOnly: true,
		secure: isProd,
		sameSite: "lax",
		path: "/",
		maxAge: ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS,
	});

	// 4. Successful login - redirect to admin dashboard
	redirect("/admin");
}

/**
 * Signs out the current admin user and clears the session cookie.
 */
export async function signOutAdmin() {
	const current = await getCurrentAdmin();
	if (current) {
		await logAuditEvent({
			action: "auth.logout",
			category: "AUTH",
			severity: "INFO",
			actorId: current.user.id,
			actorEmail: current.user.email,
			actorRole: current.profile.role,
		});
	}

	const cookieStore = await cookies();
	cookieStore.delete(ADMIN_SESSION_CONFIG.COOKIE_SESSION_START);
	cookieStore.delete(ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE);

	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/admin/login");
}

/**
 * Retrieves current admin profile and user data if authenticated.
 * Resolves role securely from app_metadata (server-controlled) and fallback to user_metadata.
 * Enforces session inactivity and absolute lifetime expiration checks.
 */
export async function getCurrentAdmin() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const role =
		user.app_metadata?.role ||
		user.user_metadata?.role;

	if (role !== "super_admin" && role !== "editor") {
		return null;
	}

	// Defense-in-depth: check administrative session expiration
	const cookieStore = await cookies();
	const lastActive = cookieStore.get(ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE)?.value;
	const sessionStart = cookieStore.get(ADMIN_SESSION_CONFIG.COOKIE_SESSION_START)?.value;

	const expiry = checkSessionExpiry(lastActive, sessionStart);
	if (expiry.isExpired) {
		await logAuditEvent({
			action: "auth.session.expired",
			category: "SECURITY",
			severity: "WARN",
			actorId: user.id,
			actorEmail: user.email,
			actorRole: role,
			details: {
				reason: expiry.reason,
				idleMinutes: expiry.idleMinutes,
			},
		});
		await supabase.auth.signOut();
		cookieStore.delete(ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE);
		cookieStore.delete(ADMIN_SESSION_CONFIG.COOKIE_SESSION_START);
		return null;
	}

	return {
		user,
		profile: {
			id: user.id,
			email: user.email || "",
			full_name: user.user_metadata?.full_name || user.email || "Admin",
			role: (role as "super_admin" | "editor") || "super_admin",
		},
	};
}
