import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/../types/database.types";
import { ADMIN_SESSION_CONFIG, checkSessionExpiry } from "@/lib/constants/auth";

/**
 * Updates user session cookie on incoming requests to keep auth token active,
 * enforces administrative session timeouts (idle and absolute),
 * and guards admin routes with strict RBAC whitelist.
 */
export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookieOptions: {
				maxAge: ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, {
							...options,
							maxAge: ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS,
						}),
					);
				},
			},
		},
	);

	// Refresh session if expired and retrieve current authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isAccessingAdmin = request.nextUrl.pathname.startsWith("/admin");
	const isLoginPage = request.nextUrl.pathname === "/admin/login";

	const userRole =
		user?.app_metadata?.role ||
		user?.user_metadata?.role;
	const isAuthorizedAdmin =
		user && (userRole === "super_admin" || userRole === "editor");

	// 1. Session Expiration & Idle Inactivity Guard for Admin Users
	if (user && isAccessingAdmin) {
		const lastActiveCookie = request.cookies.get(
			ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE,
		)?.value;
		const sessionStartCookie = request.cookies.get(
			ADMIN_SESSION_CONFIG.COOKIE_SESSION_START,
		)?.value;

		const expiry = checkSessionExpiry(lastActiveCookie, sessionStartCookie);

		if (expiry.isExpired) {
			// Session has expired due to idle inactivity or absolute duration limit
			await supabase.auth.signOut();

			if (!isLoginPage) {
				const url = request.nextUrl.clone();
				url.pathname = "/admin/login";
				url.searchParams.set("error", "session_expired");
				if (expiry.reason) {
					url.searchParams.set("reason", expiry.reason);
				}

				const redirectResponse = NextResponse.redirect(url);
				redirectResponse.cookies.delete(ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE);
				redirectResponse.cookies.delete(ADMIN_SESSION_CONFIG.COOKIE_SESSION_START);
				request.cookies.getAll().forEach((cookie) => {
					if (cookie.name.includes("sb-") || cookie.name.includes("auth-token")) {
						redirectResponse.cookies.delete(cookie.name);
					}
				});
				return redirectResponse;
			} else {
				// Already on login page, wipe stale cookies
				supabaseResponse.cookies.delete(ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE);
				supabaseResponse.cookies.delete(ADMIN_SESSION_CONFIG.COOKIE_SESSION_START);
				request.cookies.getAll().forEach((cookie) => {
					if (cookie.name.includes("sb-") || cookie.name.includes("auth-token")) {
						supabaseResponse.cookies.delete(cookie.name);
					}
				});
				return supabaseResponse;
			}
		}

		// Only slide inactivity window on actual admin operations (not on login page)
		if (!isLoginPage) {
			const nowStr = Date.now().toString();
			const isProd = process.env.NODE_ENV === "production";

			supabaseResponse.cookies.set(
				ADMIN_SESSION_CONFIG.COOKIE_LAST_ACTIVE,
				nowStr,
				{
					httpOnly: true,
					secure: isProd,
					sameSite: "lax",
					path: "/",
					maxAge: ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS,
				},
			);

			if (!sessionStartCookie) {
				supabaseResponse.cookies.set(
					ADMIN_SESSION_CONFIG.COOKIE_SESSION_START,
					nowStr,
					{
						httpOnly: true,
						secure: isProd,
						sameSite: "lax",
						path: "/",
						maxAge: ADMIN_SESSION_CONFIG.ABSOLUTE_TIMEOUT_SECONDS,
					},
				);
			}
		}
	}

	// 2. If already authenticated with valid admin role and visits login page, redirect to /admin
	if (isLoginPage && isAuthorizedAdmin) {
		const url = request.nextUrl.clone();
		url.pathname = "/admin";
		return NextResponse.redirect(url);
	}

	// 3. Protected routes guard for /admin (excluding /admin/login)
	if (isAccessingAdmin && !isLoginPage) {
		if (!user) {
			const url = request.nextUrl.clone();
			url.pathname = "/admin/login";
			return NextResponse.redirect(url);
		}

		if (!isAuthorizedAdmin) {
			// User exists in auth.users but does not have super_admin or editor role
			const url = request.nextUrl.clone();
			url.pathname = "/admin/login";
			url.searchParams.set("error", "unauthorized");
			return NextResponse.redirect(url);
		}
	}

	return supabaseResponse;
}
