import { aggregateUserActivity } from "./aggregateUserActivity.js";
import { decideScore } from "./decideScore.js";

const decideTotalScore = (userId, userActivity, configTable) => {
	const aggregatedActivity = aggregateUserActivity(userId, userActivity);
	const totalScore = decideScore({
		messages: aggregatedActivity.countActivity.messagesCount,
		reactions: aggregatedActivity.countActivity.reactionsCount,
		reactionsReceived: aggregatedActivity.countActivity.reactionsReceivedCount,
		configTable,
	});
	return totalScore;
};

export const scoreNormaliser = (usersArray, userActivity, configTable) => {
	const scoreArray = [];
	for (const user of usersArray) {
		scoreArray.push(decideTotalScore(user.user_id, userActivity, configTable));
	}

	const maxScore = Math.max(...scoreArray);
	const normalisedScores = scoreArray.map((score) => (score / maxScore) * 100);

	return normalisedScores;
};
