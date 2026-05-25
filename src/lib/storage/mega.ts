import * as megajs from "megajs";

const { Storage } = megajs;
type MutableFile = megajs.MutableFile;

// ---------------------------------------------------------------------------
// Singleton MEGA login (cached across hot-reloads in dev)
// ---------------------------------------------------------------------------

declare global {
	// eslint-disable-next-line no-var
	var megaStorage: {
		instance: megajs.Storage | null;
		promise: Promise<megajs.Storage> | null;
	};
}

global.megaStorage = global.megaStorage || { instance: null, promise: null };

/**
 * Returns a logged-in MEGA Storage instance.
 * Reuses the connection across requests (singleton / cached pattern,
 * matching the connectToDatabase() pattern used in this project).
 */
export async function getMegaStorage(): Promise<megajs.Storage> {
	// Return cached instance if already logged in
	if (global.megaStorage.instance) {
		return global.megaStorage.instance;
	}

	const email = process.env.MEGA_EMAIL;
	const password = process.env.MEGA_PASSWORD;

	if (!email) throw new Error("MEGA_EMAIL environment variable is not set.");
	if (!password)
		throw new Error("MEGA_PASSWORD environment variable is not set.");

	if (!global.megaStorage.promise) {
		const storage = new Storage({ email, password });
		// storage.ready is a Promise<Storage> that resolves once logged in
		global.megaStorage.promise = storage.ready.then((s) => {
			global.megaStorage.instance = s;
			return s;
		});
	}

	global.megaStorage.instance = await global.megaStorage.promise;
	return global.megaStorage.instance;
}

// ---------------------------------------------------------------------------
// Folder helpers
// ---------------------------------------------------------------------------

/**
 * Returns (or creates) the upload folder inside the logged-in MEGA account.
 * Folder name is read from MEGA_BASE_FOLDER env var (default: "studpro-uploads").
 */
async function getUploadFolder(storage: megajs.Storage): Promise<MutableFile> {
	const folderName = process.env.MEGA_BASE_FOLDER ?? "studpro-uploads";

	// Look for an existing top-level directory with that name
	const existing = storage.root.children?.find(
		(f): f is MutableFile => f.directory && f.name === folderName,
	);

	if (existing) return existing;

	// Create it if it doesn't exist
	return storage.root.mkdir(folderName);
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Uploads a Buffer to MEGA and returns a public shareable URL.
 *
 * @param buffer    Raw file bytes
 * @param filename  Desired filename in MEGA (e.g. "event-banner-1234.jpg")
 * @returns         Public MEGA URL (https://mega.nz/file/...)
 */
export async function uploadFile(
	buffer: Buffer,
	filename: string,
): Promise<string> {
	const storage = await getMegaStorage();
	const folder = await getUploadFolder(storage);

	// folder.upload() accepts a Buffer directly and returns an UploadStream
	// whose .complete promise resolves to a MutableFile once done.
	const uploadStream = folder.upload(
		{ name: filename, size: buffer.length },
		buffer,
	);

	const file = await uploadStream.complete;

	// link() generates a public shareable URL; pass empty opts object for defaults
	const url = await file.link({});
	return url;
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Deletes a file from MEGA by its public URL.
 * Searches the upload folder for a node whose link matches.
 *
 * @param fileUrl  The public MEGA URL returned by uploadFile()
 */
export async function deleteFile(fileUrl: string): Promise<void> {
	const storage = await getMegaStorage();
	const folder = await getUploadFolder(storage);

	if (!folder.children) return;

	for (const child of folder.children) {
		if (child.directory) continue;
		try {
			const link = await (child as MutableFile).link({});
			if (link === fileUrl) {
				await (child as MutableFile).delete(true);
				return;
			}
		} catch {
			// skip files that can't be linked
		}
	}

	console.warn(`[mega] File not found for URL: ${fileUrl} — skipping delete.`);
}
