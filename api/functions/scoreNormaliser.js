import { aggregateUserActivity } from "./aggregateUserActivity.js";
import { decideScore } from "./decideScore.js";

/**
 * Calculates the total score for a specific user based on their activity and configuration weights.
 *
 * @param {string|number} userId - The ID of the user.
 * @param {Object} userActivity - An object containing activity data for all users.
 * @param {Object} configTable - Configuration table with weights for messages, reactions, and reactions received.
 * @returns {number} - The total activity score for the user.
 */
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

/**
 * Normalises the activity scores of a list of users to a 0–100 scale,
 * where the highest score becomes 100 and others are scaled relative to it.
 *
 * Each returned object links the normalised score to its corresponding user ID.
 *
 * @param {Array<Object>} usersArray - Array of user objects, each containing at least a `user_id` property.
 * @param {Object} userActivity - An object containing raw activity data for users.
 * @param {Object} configTable - Configuration object that includes the weighting of each activity type.
 * @returns {Array<{userId: string|number, score: number}>} - An array of objects with userId and their normalised score (0–100).
 */
export const scoreNormaliser = (usersArray, userActivity, configTable) => {
	const scoreArray = [];
	for (const user of usersArray) {
		scoreArray.push({
			userId: user.user_id,
			score: decideTotalScore(user.user_id, userActivity, configTable),
		});
	}

	const maxScore = Math.max(...scoreArray.map((u) => u.score));
	const normalisedScores = scoreArray.map((user) => {
		return {
			userId: user.userId,
			score: Math.round((user.score / maxScore) * 100),
		};
	});

	return normalisedScores;
};
