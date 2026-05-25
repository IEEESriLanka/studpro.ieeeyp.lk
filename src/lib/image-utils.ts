const EVENT_FALLBACK = "/images/events/web-development-intro.jpg";
const TEAM_FALLBACK = "/images/team/avatar.jpg";

/**
 * Returns a safe image URL for an event image.
 * Accepts:
 *  - Public MEGA URLs (https://mega.nz/...)
 *  - Absolute URLs from any trusted HTTPS source
 *  - Legacy relative paths from the /public directory
 *
 * Falls back to a default event image when the value is empty/invalid.
 *
 * @param url - The image URL (MEGA link, absolute URL, or relative path)
 * @returns   A renderable image URL
 */
export function getSafeImageUrl(
	url?: string | null,
	fallback: string = EVENT_FALLBACK,
): string {
	if (!url || url.trim() === "") return fallback;
	// Accept any valid HTTPS URL (covers MEGA and other CDNs)
	if (url.startsWith("https://")) return url;
	// Accept legacy relative paths starting with /
	if (url.startsWith("/")) return url;
	return fallback;
}

/**
 * Returns a safe image URL for a team/OC member photo.
 * Accepts the same formats as getSafeImageUrl().
 *
 * Falls back to a default avatar image when the value is empty/invalid.
 *
 * @param url - The image URL (MEGA link, absolute URL, or relative path)
 * @returns   A renderable image URL
 */
export function getSafeTeamImageUrl(
	url?: string | null,
	fallback: string = TEAM_FALLBACK,
): string {
	return getSafeImageUrl(url, fallback);
}
