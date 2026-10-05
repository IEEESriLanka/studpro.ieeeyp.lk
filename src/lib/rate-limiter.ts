/**
 * In-memory sliding window rate limiter for protecting sensitive endpoints
 * (e.g. admin authentication, password reset, sensitive mutations).
 */

interface RateLimitRecord {
	attempts: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup to prevent memory leaks every 10 minutes
if (typeof setInterval !== "undefined") {
	setInterval(() => {
		const now = Date.now();
		for (const [key, record] of rateLimitMap.entries()) {
			// Remove timestamps older than 1 hour
			record.attempts = record.attempts.filter((ts) => now - ts < 3600 * 1000);
			if (record.attempts.length === 0) {
				rateLimitMap.delete(key);
			}
		}
	}, 10 * 60 * 1000);
}

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetInSeconds: number;
}

/**
 * Checks if a given identifier has exceeded the max allowed attempts within a window.
 *
 * @param key Unique key for the rate-limiting scope (e.g. `login:ip:1.2.3.4` or `login:email:user@ieee.org`)
 * @param maxAttempts Max number of attempts permitted in the window
 * @param windowMs Window duration in milliseconds (e.g. 15 * 60 * 1000 for 15 minutes)
 */
export function checkRateLimit(
	key: string,
	maxAttempts: number = 5,
	windowMs: number = 15 * 60 * 1000,
): RateLimitResult {
	const now = Date.now();
	const record = rateLimitMap.get(key) || { attempts: [] };

	// Filter attempts that fall within the current sliding window
	const validAttempts = record.attempts.filter((ts) => now - ts < windowMs);
	record.attempts = validAttempts;
	rateLimitMap.set(key, record);

	if (validAttempts.length >= maxAttempts) {
		const oldestAttempt = validAttempts[0];
		const resetInSeconds = Math.ceil((oldestAttempt + windowMs - now) / 1000);
		return {
			allowed: false,
			remaining: 0,
			resetInSeconds: Math.max(resetInSeconds, 1),
		};
	}

	return {
		allowed: true,
		remaining: maxAttempts - validAttempts.length,
		resetInSeconds: Math.ceil(windowMs / 1000),
	};
}

/**
 * Records a failed attempt for an identifier.
 */
export function recordFailedAttempt(key: string): void {
	const record = rateLimitMap.get(key) || { attempts: [] };
	record.attempts.push(Date.now());
	rateLimitMap.set(key, record);
}

/**
 * Clears recorded attempts upon successful verification/action.
 */
export function clearRateLimit(key: string): void {
	rateLimitMap.delete(key);
}
