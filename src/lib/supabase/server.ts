import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/../types/database.types";
import { ADMIN_SESSION_CONFIG } from "@/lib/constants/auth";

/**
 * Creates a Supabase client for use in Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient<Database>(
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
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, {
								...options,
								maxAge: ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS,
							}),
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing user sessions.
					}
				},
			},
		},
	);
}

/**
 * Creates a Supabase client with admin/service-role privileges for background scripts & seeding.
 * CAUTION: Never expose this to client components or public API routes.
 */
export function createAdminClient() {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			cookies: {
				getAll() {
					return [];
				},
				setAll() {},
			},
		},
	);
}
