import logger from "../utils/logger";

import { aggregateUserActivity } from "./aggregateUserActivity.js";
import { decideScore } from "./decideScore.js";

export const decideStatus = async (configTable, userId, userActivity) => {
	try {
		const aggregatedActivity = aggregateUserActivity(userId, userActivity);

		// @todo updated version of decideScore should be replaced when it was mreged
		if (aggregatedActivity.success) {
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
		} else {
			return {
				success: false,
				status: "activity has not been fetched correctly",
			};
		}
	} catch (error) {
		logger.error(error);
		return { success: false, status: "unknown error happened" };
	}
};
