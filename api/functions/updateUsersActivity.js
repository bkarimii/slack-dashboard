import logger from "../utils/logger.js";

/**
 * Updates user activity data in the database.
 *
 * @param {Object} processedActivity - An object containing user activity data.
 * @param {Object} db - The database connection object.
 *
 * @example
 * const processedActivity = {
 *   "2025-01-14": {
 *     "U04NG9G5SD7": { messages: 6, reactions: 7, reactionsReceived: 0 },
 *     "U088NRXR8QK": { messages: 6, reactions: 0, reactionsReceived: 7 }
 *   },
 *   "2025-02-24": {
 *     "U04NG9G5SD7": { messages: 3, reactions: 0, reactionsReceived: 0 }
 *   }
 * };
 * await updateUsersActivity(processedActivity, db);
 *
 * @returns {Promise<Object>} - Returns a success status if the operation completes successfully.
 */
export const updateUsersActivity = async (processedActivity, db) => {
	try {
		if (!processedActivity || Object.keys(processedActivity).length === 0) {
			logger.error("invalid or empty activity data");
			return { success: false, message: "invalid or empty activity data" };
		}

		// retrieve all the users in database as they are real users
		const realUsers = await db.query("SELECT user_id FROM all_users");

		const realUserIds = new Set(realUsers.rows.map((user) => user.user_id));

		const realUsersActivity = {};

		// Filter bots and apps from users activity
		for (const date in processedActivity) {
			const usersActivityPerDate = processedActivity[date];

			realUsersActivity[date] = {};

			for (const userId in usersActivityPerDate) {
				if (realUserIds.has(userId)) {
					realUsersActivity[date][userId] = usersActivityPerDate[userId];
				}
			}
		}

		await db.query("BEGIN");

		const usersActivity = [];
		// Process the filtered activity and prepare it for insertion
		for (const date in realUsersActivity) {
			const usersActivityPerDate = realUsersActivity[date];

			for (const userId in usersActivityPerDate) {
				const { messages, reactions, reactionsReceived } =
					usersActivityPerDate[userId];
				usersActivity.push([
					date,
					userId,
					messages,
					reactions,
					reactionsReceived,
				]);
			}
		}

		if (usersActivity.length === 0) {
			await db.query("COMMIT");
			logger.warn("no user activity was found to be instrted.");
			return { success: true };
		}

		const insertQuery = `
            INSERT INTO slack_user_activity (date, user_id, messages, reactions, reactions_received)
            VALUES ${usersActivity
							.map(
								(_, i) =>
									`($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`,
							)
							.join(", ")}
            ON CONFLICT (date, user_id) 
            DO UPDATE SET 
                messages = EXCLUDED.messages,
                reactions = EXCLUDED.reactions,
                reactions_received = EXCLUDED.reactions_received
        `;

		const queryValues = usersActivity.flat();

		await db.query(insertQuery, queryValues);

		await db.query("COMMIT");

		return { success: true };
	} catch (error) {
		await db.query("ROLLBACK");
		logger.debug("Error inserting user activity:", error);
		return { success: false, message: error.message };
	}
};
