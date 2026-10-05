/**
 * A utility function to provide an image URL or a fallback image if the image doesn't exist
 * @param imagePath The path to the image
 * @returns A safe image URL
 */
export function getSafeImageUrl(imagePath: string): string {
	if (!imagePath) return "/images/events/web-development-intro.jpg";
	return imagePath;
}

export function getSafeTeamImageUrl(imagePath: string): string {
	if (!imagePath) return "/images/team/avatar.png";
	return imagePath;
}
