import logger from "../utils/logger.js";

/**
 * Updates the users in the database by processing the users.json file from the extracted directory.
 * Filters out invalid users, and performs a batch upsert into the 'all_users' table.
 *
 * @param {Array} extractedDir - An array of directory entries (files and folders) extracted from a zip.
 * @param {Object} db - The database client used to interact with the database.
 * @returns {Object} - Returns an object indicating success or failure with a message.
 */
export const updateDbUsers = async (extractedDir, db) => {
	try {
		// if directory passed is invalid
		if (!extractedDir) {
			throw Error("invalid passed directory");
			// return { success: false, message: "invalid passed directory" };
		}

		// Find users.json file in the directory
		const usersFileEntry = extractedDir.find((entry) => {
			return entry.name === "users.json";
		});

		if (!usersFileEntry) {
			logger.error("users json file not found in the directory");
			// return {
			// 	success: false,
			// 	message: "users json file not found in the directory",
			// };

			throw Error("users json file not found in the directory");
		}

		const usersFileContent = usersFileEntry.content;

		if (!usersFileContent) {
			// return {
			// 	success: false,
			// 	message: "users.json content is missing or invalid",
			// };

			throw Error("users.json content is missing or invalid");
		}

		let usersList;
		try {
			usersList = JSON.parse(usersFileContent);
		} catch (error) {
			logger.error("Error parsing users.json");
			// return { success: false, message: "Error in parsing users.json" };
			throw Error("Error in parsing users.json");
		}

		const activeUsers = usersList.filter(
			(user) =>
				!user.deleted &&
				user.id &&
				user.profile.display_name &&
				user.profile.display_name_normalized &&
				user.profile.email &&
				user.is_admin !== undefined,
		);

		if (activeUsers.length === 0) {
			logger.error("active user is empty.something is wrong");
			throw Error("error happened, active users is empty");
		}

		await db.query("BEGIN");

		// Batch upsert query
		const insertQuery = `
            INSERT INTO all_users (user_id, display_name, display_name_normalised, is_admin, email)
            VALUES ${activeUsers.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                display_name = EXCLUDED.display_name,
                display_name_normalised = EXCLUDED.display_name_normalised,
                is_admin = EXCLUDED.is_admin,
                email = EXCLUDED.email
        `;

		const queryValues = activeUsers.flatMap((user) => [
			user.id,
			user.profile.display_name,
			user.profile.display_name_normalized,
			user.is_admin ?? false,
			user.profile.email,
		]);

		// Insert all users in a single query
		await db.query(insertQuery, queryValues);

		await db.query("COMMIT");

		logger.info("users inserted into database successfully");
		return true;
	} catch (error) {
		await db.query("ROLLBACK");
		logger.error(error);
		throw error;
	}
};
