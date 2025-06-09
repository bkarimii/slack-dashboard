import logger from "../utils/logger.js";

/**
 * Determines the status of users based on their normalised scores.
 *
 * This function takes an array of normalised scores and compares each score with
 * the provided thresholds in the `configTable`. It categorises users into
 * different status groups: inactive, low, medium, and high activity based on
 * the score ranges defined in the `configTable`.
 *
 * @param {number[]} normalisedScores - An array of normalised scores representing user activity levels.
 * @param {Object} configTable - An object containing threshold values for determining user status.
 * @param {number} configTable.low_threshold - The threshold below which users are considered inactive.
 * @param {number} configTable.medium_threshold - The threshold for users to be categorised as low activity.
 * @param {number} configTable.high_threshold - The threshold above which users are considered to have high activity.
 *
 * @returns {Object} An object representing the count of users in each activity status category:
 *                   `inactive`, `low`, `medium`, and `high`.
 *                   Example: `{ inactive: 5, low: 10, medium: 15, high: 20 }`.
 *
 * @throws {Error} Throws an error if there is an issue during the status determination process.
 */
export const decideStatus = async (normalisedScores, configTable) => {
	try {
		const finalStatus = { low: 0, medium: 0, high: 0, inactive: 0 };
		for (const score of normalisedScores) {
			if (score < configTable.low_threshold) {
				finalStatus.inactive += 1;
			} else if (score < configTable.medium_threshold) {
				finalStatus.low += 1;
			} else if (score < configTable.high_threshold) {
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
