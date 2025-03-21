import logger from "../utils/logger";

import { aggregateUserActivity } from "./aggregateUserActivity.js";
import { decideScore } from "./decideScore.js";

export const decideStatus = async (db, userId, startDate, endDate) => {
	try {
		const result = await db.query("SELECT * FROM config_table");

		const configTable = result.rows[0];

		const aggregatedActivity = await aggregateUserActivity(
			db,
			userId,
			startDate,
			endDate,
		);

		if (aggregatedActivity.success) {
			const usersScore = decideScore(
				aggregatedActivity.usersCount.messagesCount,
				aggregatedActivity.usersCount.reactionsCount,
			);

			if (usersScore < configTable.low_threshold) {
				return "inactive";
			} else if (usersScore < configTable.medium_threshold) {
				return "low";
			} else if (usersScore < configTable.high_threshold) {
				return "medium";
			} else {
				return "high";
			}
		}
	} catch (error) {
		logger.error(error);
		return { success: false, message: "failled to return user status" };
	}
};
