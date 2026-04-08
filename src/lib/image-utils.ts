/**
 * A utility function to provide an image URL or a fallback image if the image doesn't exist
 * @param imagePath The path to the image
 * @returns A safe image URL
 */
export function getSafeImageUrl(imagePath: string): string {
	// List of known image paths that exist in the public directory
	const knownImages = [
		"/images/events/git-version-control.jpg",
		"/images/events/html-css-basics.jpg",
		"/images/events/javascript-intro.jpg",
		"/images/events/react-app.jpg",
		"/images/events/web-development-intro.jpg",
	];

	// If the image path is in the list of known images, return it; otherwise, return a fallback
	return knownImages.includes(imagePath)
		? imagePath
		: "/images/events/web-development-intro.jpg"; // Use a default image as fallback
}

export function getSafeTeamImageUrl(imagePath: string): string {
	// List of known team images that exist in the public directory
	const knownTeamImages = [
		"/images/team/chamod.png",
		"/images/team/yasas.png",
		"/images/team/pamuda.png",
		"/images/team/dilmith.png",
		"/images/team/oneli.png",
		"/images/team/ovindu.png",
		"/images/team/santhush.png",
		"/images/team/sandali.png",
		"/images/team/manusha.png",
		"/images/team/kaveen.png",
		"/images/team/harini.png",
		"/images/team/navodhya.png",
		"/images/team/charunda.png",
		"/images/team/kavishka.png",
		"/images/team/shageeshan.png",
		"/images/team/pawara.png",
	];

	// If the image path is in the list of known team images, return it; otherwise, return a fallback
	return knownTeamImages.includes(imagePath)
		? imagePath
		: "/images/team/avatar.jpg"; // Use a default image as fallback
}
