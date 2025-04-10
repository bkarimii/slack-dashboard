import logger from "../utils/logger.js";

/**
 * Aggregates user activity data for a specific user.
 *
 * This function iterates over an array of user activity data and aggregates the messages,
 * reactions, and reactions received for a specific user identified by `userId`.
 *
 * @param {string|number} userId - The unique identifier for the user whose activity is being aggregated.
 * @param {Array<Object>} userActivities - An array of activity data objects for users, where each object
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
 *
 * @returns {object} - If an error occurs during the aggregation process, an error is logged and
 *  object containing a boolean with false and a message is returned.
 */
export const aggregateUserActivity = (userId, userActivities) => {
	if (userActivities.length === 0) {
		const message = "array of user activity is empty";
		logger.error(message);

		return { success: false, message: message };
	}
	try {
		const countActivity = userActivities.reduce(
			(acc, { user_id, messages, reactions, reactions_received }) => {
				if (user_id !== userId) {
					return acc;
				}

				return {
					...acc,
					messagesCount: acc.messagesCount + (messages || 0),
					reactionsCount: acc.reactionsCount + (reactions || 0),
					reactionsReceivedCount:
						acc.reactionsReceivedCount + (reactions_received || 0),
				};
			},
			{
				messagesCount: 0,
				reactionsCount: 0,
				reactionsReceivedCount: 0,
			},
		);

		return { success: true, countActivity: countActivity };
	} catch (error) {
		logger.error(error);
		return { success: false, messages: "unknown error happened" };
	}
};
