/**
 * Processes messages to count how many messages, reactions, and reactions received each user has.
 *
 * @param {Array} jsonArray - An array of message objects. Each message includes:
 *   - `user`: The user who sent the message.
 *   - `reactions`: An array of users who reacted to the message.
 *
 * @returns {Object} An object with each user's message count, reaction count, and reactions received.
 */

export const refineContent = (jsonArray) => {
	const activityCounter = {};

	if (!jsonArray || !Array.isArray(jsonArray)) {
		return {};
	}

	try {
		jsonArray.forEach((eachMessage) => {
			if (!eachMessage || typeof eachMessage !== "object") {
				return; // Skip this iteration
			}

			const user = eachMessage.user;
			const reactions = eachMessage.reactions;

			if (!activityCounter[user]) {
				activityCounter[user] = {
					postedMessage: 0,
					givenReactions: 0,
					receivedReactions: 0,
				};
			}

			activityCounter[user].postedMessage++;
			if (Array.isArray(reactions) && reactions.length > 0) {
				reactions.forEach((eachReaction) => {
					if (!eachReaction || !Array.isArray(eachReaction.users)) {
						return;
					}
					eachReaction.users.forEach((reactingUser) => {
						if (!activityCounter[reactingUser]) {
							activityCounter[reactingUser] = {
								postedMessage: 0,
								givenReactions: 0,
								receivedReactions: 0,
							};
						}
						// skip self-reactions
						if (reactingUser !== user) {
							activityCounter[reactingUser].givenReactions++;
							activityCounter[user].receivedReactions++;
						}
					});
				});
			}
		});
	} catch (error) {
		return {};
	}

	return activityCounter;
};
