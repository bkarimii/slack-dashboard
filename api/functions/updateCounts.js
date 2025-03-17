import logger from "../utils/logger";

/**
 * Processes messages to count how many messages, reactions, and reactions received each user has.
 *
 * @param {Array} messages - An array of message objects. Each message includes:
 *   - `user`: The user who sent the message.
 *   - `reactions`: An array of users who reacted to the message.
 *
 * @returns {Object} An object with each user's message count, reaction count, and reactions received.
 */
export const updateCounts = (messages) => {
	const activity = {};

	if (!messages || !Array.isArray(messages)) {
		return {};
	}

	try {
		messages.forEach((message) => {
			if (!message || typeof message !== "object") {
				return; // Skip this iteration
			}

			const user = message.user;
			const reactions = message.reactions;

			if (!activity[user]) {
				activity[user] = {
					messages: 0,
					reactions: 0,
					reactionsReceived: 0,
				};
			}

			activity[user].messages++;
			if (Array.isArray(reactions) && reactions.length > 0) {
				reactions.forEach((eachReaction) => {
					if (!eachReaction || !Array.isArray(eachReaction.users)) {
						return;
					}
					eachReaction.users.forEach((reactingUser) => {
						if (!activity[reactingUser]) {
							activity[reactingUser] = {
								messages: 0,
								reactions: 0,
								reactionsReceived: 0,
							};
						}
						// skip self-reactions
						if (reactingUser !== user) {
							activity[reactingUser].reactions++;
							activity[user].reactionsReceived++;
						}
					});
				});
			}
		});
	} catch (error) {
		logger.debug("Error i update count function: ", error);
		return {};
	}

	return activity;
};
