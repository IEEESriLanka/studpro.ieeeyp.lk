/**
 * Administrative Session & Authentication Security Configurations
 */

export const ADMIN_SESSION_CONFIG = {
	/**
	 * Idle Inactivity Timeout: If no administrative activity occurs within this window,
	 * the session automatically expires (Default: 2 hours).
	 */
	IDLE_TIMEOUT_SECONDS: 2 * 60 * 60, // 7,200 seconds (2 hours)

	/**
	 * Absolute Maximum Session Lifetime: Regardless of user activity, the session must
	 * re-authenticate after this duration for security compliance (Default: 12 hours).
	 */
	ABSOLUTE_TIMEOUT_SECONDS: 12 * 60 * 60, // 43,200 seconds (12 hours)

	/**
	 * Cookie Max-Age: Hardened against default 400-day expiration (Default: 12 hours).
	 */
	COOKIE_MAX_AGE_SECONDS: 12 * 60 * 60, // 43,200 seconds (12 hours)

	/** Cookie tracking timestamp of last activity */
	COOKIE_LAST_ACTIVE: "studpro_admin_last_active",

	/** Cookie tracking timestamp of initial session creation */
	COOKIE_SESSION_START: "studpro_admin_session_start",
} as const;

export interface SessionExpiryStatus {
	isExpired: boolean;
	reason?: "idle_timeout" | "absolute_timeout";
	idleMinutes?: number;
}

/**
 * Evaluates whether an admin session has expired due to inactivity or exceeding max lifetime.
 */
export function checkSessionExpiry(
	lastActiveStr?: string | null,
	sessionStartStr?: string | null,
	now: number = Date.now(),
): SessionExpiryStatus {
	if (!lastActiveStr) {
		return { isExpired: false };
	}

	const lastActive = parseInt(lastActiveStr, 10);
	if (isNaN(lastActive)) {
		return { isExpired: false };
	}

	// 1. Idle timeout check
	const idleMs = now - lastActive;
	if (idleMs > ADMIN_SESSION_CONFIG.IDLE_TIMEOUT_SECONDS * 1000) {
		return {
			isExpired: true,
			reason: "idle_timeout",
			idleMinutes: Math.round(idleMs / (60 * 1000)),
		};
	}

	// 2. Absolute lifetime check
	if (sessionStartStr) {
		const sessionStart = parseInt(sessionStartStr, 10);
		if (!isNaN(sessionStart)) {
			const totalMs = now - sessionStart;
			if (totalMs > ADMIN_SESSION_CONFIG.ABSOLUTE_TIMEOUT_SECONDS * 1000) {
				return {
					isExpired: true,
					reason: "absolute_timeout",
				};
			}
		}
	}

	return { isExpired: false };
}
