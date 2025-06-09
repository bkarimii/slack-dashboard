import logger from "../utils/logger.js";

/**
 * Updates the database with active users from a provided directory of JSON data.
 *
 * The function performs the following:
 * - Verifies the validity of the directory and contents of `users.json`.
 * - Filters out active users based on specific criteria.
 * - Performs a batch insert or update of user records into the `all_users` table.
 * - If any step fails, the function will throw an error and log relevant messages.
 *
 * @param {Array} extractedDir - Array of directory entries, each containing a `name` and `content` property.
 * @param {Object} db - Database client to execute queries (typically a `pg` client).
 *
 * @returns {Promise<boolean>} Resolves with `true` if users were successfully inserted into the database.
 *
 * @throws {Error} If any of the following occur:
 * - Invalid or missing `extractedDir`.
 * - Missing or invalid `users.json` file.
 * - Invalid or missing `users.json` content.
 * - Error parsing the `users.json` file.
 * - No active users found.
 * - Any database operation failure, which will trigger a rollback.
 */
export const updateDbUsers = async (extractedDir, db) => {
	try {
		// if directory passed is invalid
		if (!extractedDir) {
			throw Error("invalid passed directory");
		}

		// Find users.json file in the directory
		const usersFileEntry = extractedDir.find((entry) => {
			return entry.name === "users.json";
		});

		if (!usersFileEntry) {
			logger.error("users json file not found in the directory");

			throw Error("users json file not found in the directory");
		}

		const usersFileContent = usersFileEntry.content;

		if (!usersFileContent) {
			throw Error("users.json content is missing or invalid");
		}

		let usersList;
		try {
			usersList = JSON.parse(usersFileContent);
		} catch (error) {
			logger.error("Error parsing users.json");
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
