/**
 * Utility functions for optimized image delivery.
 */

const OPTIMIZED_HOSTS = [
	"utfs.io",
	"ufs.sh",
	"supabase.co",
	"images.unsplash.com",
];

/**
 * Determines whether Next.js Image should optimize this URL.
 * Internal relative paths (/images/...) and recognized storage hosts are optimized.
 * Only unknown third-party domains will set unoptimized={true}.
 */
export function isOptimizableImageUrl(src?: string | null): boolean {
	if (!src) return false;

	// Local static assets (/images/...) can always be optimized
	if (src.startsWith("/")) {
		return true;
	}

	try {
		const parsed = new URL(src);
		return OPTIMIZED_HOSTS.some(
			(host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
		);
	} catch {
		return false;
	}
}

/**
 * Convenience helper returning { unoptimized: boolean } for Next.js <Image />
 */
export function shouldBeUnoptimized(src?: string | null): boolean {
	return !isOptimizableImageUrl(src);
}
