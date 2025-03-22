import logger from "../utils/logger.js";

/**
 * Aggregates user activity data for a specific user.
 *
 * This function iterates over an array of user activity data and aggregates the messages,
 * reactions, and reactions received for a specific user identified by `userId`.
 *
 * @param {string|number} userId - The unique identifier for the user whose activity is being aggregated.
 * @param {Array<Object>} userActivity - An array of activity data objects for users, where each object
 * contains properties like `user_id`, `messages`, `reactions`,
 *and `reactions_received`.
 *
 * @returns {Object} - The result object contains the following:
 *- `success` (boolean): Indicates whether the aggregation was successful.
 *- `countActivity` (Object): An object containing the aggregated activity counts:
 *- `messagesCount` (number): The total number of messages for the user.
 *- `reactionsCount` (number): The total number of reactions by the user.
 *- `reactionsReceivedCount` (number): The total number of reactions received by the user.
 *
 * @returns {object} - If an error occurs during the aggregation process, an error is logged and
 *  object containing a boolean with false and a message is returned.
 */
export const aggregateUserActivity = (userId, userActivity) => {
	const countActivity = {
		messagesCount: 0,
		reactionsCount: 0,
		reactionsReceivedCount: 0,
	};

	if (userActivity.length === 0) {
		logger.error("array of user activity is empty");

		return { success: false, message: "array of user activity is empty" };
	}
	try {
		userActivity.forEach((userActivityPerDate) => {
			if (userActivityPerDate.user_id === userId) {
				countActivity.messagesCount += userActivityPerDate.messages || 0;
				countActivity.reactionsCount += userActivityPerDate.reactions || 0;
				countActivity.reactionsReceivedCount +=
					userActivityPerDate.reactions_received || 0;
			}
		});

		return { success: true, countActivity: countActivity };
	} catch (error) {
		logger.error(error);
		return { success: false, messages: "unknown error happened" };
	}
};
