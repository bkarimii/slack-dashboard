import logger from "../utils/logger.js";

import { decideScore } from "./decideScore.js";

export const calculateScore = async (db, userId) => {
	try {
		const query =
			"select messages, reactions from slack_users_activity where user_id=$1";
		const { messages, reactions } = await db.query(query, [userId]);
		const userScore = decideScore(messages, reactions);
		return userScore;
	} catch (error) {
		logger.error(error);
		return false;
	}
};
