import AdmZip from "adm-zip";
/**
 * Extracts files from a ZIP buffer.
 * @param {Buffer} zipBuffer - The ZIP file buffer.
 */
export const zipExtractor = (zipBuffer) => {
	try {
		const zip = new AdmZip(zipBuffer); // Load ZIP from memory
		const zipEntries = zip.getEntries(); // Get list of files/folders in ZIP

		const extractedFiles = zipEntries.map((entry) => {
			let content = null;
			if (!entry.isDirectory) {
				content = entry.getData().toString();
			}

			return {
				name: entry.entryName,
				isDirectory: entry.isDirectory,
				content,
			};
		});

		return extractedFiles;
	} catch (error) {
		throw new Error("Error extracting ZIP file: " + error.message);
	}
};
