import logger from "../utils/logger.js";

import { aggregateUserActivity } from "./aggregateUserActivity.js";
import { decideScore } from "./decideScore.js";

/**
 * Determines the status of a user based on their activity and the provided configuration table.
 * 
 * This function aggregates the user's activity, calculates a score based on messages and reactions,
 * and then returns a status based on predefined threshold values. If any part of the process fails, 
 * an error message will be returned. This is an asynchronous function.
 * 
 * @param {Array<Object>} configTable - An array of configuration objects, each containing thresholds and weights for score calculation. retrieved from DB.
 * @param {number} configTable[].low_threshold - The threshold for the "inactive" status.
 * @param {number} configTable[].medium_threshold - The threshold for the "low" status.
 * @param {number} configTable[].high_threshold - The threshold for the "medium" status.
 * @param {number} configTable[].message_weighting - The weight given to messages in the score calculation.
 * @param {number} configTable[].reactions_weighting - The weight given to reactions in the score calculation.
 * 
 * @param {string} userId - The ID of the user whose status is to be determined.
 * @param {Array<Object>} userActivity - The array of user activity objects returned from another function.
 * @param {string} userActivity[].user_id - The user ID associated with the activity.
 * @param {number} userActivity[].messages - The number of messages sent by the user.
 * @param {number} userActivity[].reactions - The number of reactions sent by the user.
 * @param {number} userActivity[].reactions_received - The number of reactions received by the user.
 * 
 * @returns {Object} An object containing the success status and the user's activity status.
 * @returns {boolean} return.success - Whether the operation was successful.
 * @returns {string} return.status - The status of the user: "inactive", "low", "medium", or "high", or an error message if the process failed.
 
 */
export const decideStatus = async (configTable, userId, userActivity) => {
	try {
		const aggregatedActivity = aggregateUserActivity(userId, userActivity);

		// @todo updated version of decideScore should be replaced when it was merged
		if (!aggregatedActivity.success) {
			return {
				success: false,
				status: "activity has not been fetched correctly",
			};
		}

		const score = decideScore({
			messages: aggregatedActivity.countActivity.messagesCount,
			reactions: aggregatedActivity.countActivity.reactionsCount,
			messageWeight: configTable.message_weighting,
			reactionWeight: configTable.reactions_weighting,
		});

		if (score < configTable.low_threshold) {
			return { success: true, status: "inactive" };
		} else if (score < configTable.medium_threshold) {
			return { success: true, status: "low" };
		} else if (score < configTable.high_threshold) {
			return { success: true, status: "medium" };
		} else {
			return { success: true, status: "high" };
		}
	} catch (error) {
		logger.error(error);
		return { success: false, status: "unknown error happened" };
	}
};
