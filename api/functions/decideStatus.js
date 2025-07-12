import logger from "../utils/logger.js";

/**
 * Determines the activity status of users based on their normalised scores.
 *
 * This function takes an array of user objects (each containing `userId` and normalised `score`)
 * and categorises them into activity levels based on threshold values provided in the `configTable`.
 * The categories are: `inactive`, `low`, `medium`, and `high`.
 *
 * @param {Array<{userId: string|number, score: number}>} normalisedUser -
 *        An array of user objects with userId and their normalised score (0–100).
 * @param {Object} configTable - Configuration object containing threshold values for activity levels.
 * @param {number} configTable.low_threshold - Scores below this are considered 'inactive'.
 * @param {number} configTable.medium_threshold - Scores between `low` and this are 'low' activity.
 * @param {number} configTable.high_threshold - Scores between `medium` and this are 'medium' activity;
 *                                              scores above this are 'high' activity.
 *
 * @returns {Object} An object representing the count of users in each activity status category:
 *                   `{ inactive: number, low: number, medium: number, high: number }`
 *
 * @throws {Error} Throws an error if status determination fails.
 */
export const decideStatus = async (normalisedUser, configTable) => {
	try {
		const finalStatus = { low: 0, medium: 0, high: 0, inactive: 0 };
		for (const user of normalisedUser) {
			if (user.score < configTable.low_threshold) {
				finalStatus.inactive += 1;
			} else if (user.score < configTable.medium_threshold) {
				finalStatus.low += 1;
			} else if (user.score < configTable.high_threshold) {
				finalStatus.medium += 1;
			} else {
				finalStatus.high += 1;
			}
		}

		return finalStatus;
	} catch (error) {
		logger.error(error);
		throw error;
	}
};
