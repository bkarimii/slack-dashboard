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
			return { success: false, message: "Invalid or empty activity data" };
		}

		await db.query("BEGIN");

		const entries = [];

		for (const date in processedActivity) {
			const usersActivityPerDate = processedActivity[date];

			for (const userId in usersActivityPerDate) {
				const { messages, reactions, reactionsReceived } = date[userId];
				entries.push([date, userId, messages, reactions, reactionsReceived]);
			}
		}

		if (entries.length === 0) {
			db.query("ROLLBACK");
			return { success: false, message: "no valid data to insert" };
		}

		const insertQuery = `
            INSERT INTO slack_user_activity (date, user_id, messages, reactions, reactions_received)
            VALUES ${entries
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

		const queryValues = entries.flat();

		await db.query(insertQuery, queryValues);

		await db.query("COMMIT");

		return { success: true };
	} catch (error) {
		await db.query("ROLLBACK");
		logger.debug("Error inserting user activity:", error);
		return { success: false, message: error.message };
	}
};
