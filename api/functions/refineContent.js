/**
 * Processes messages to count how many messages, reactions, and reactions received each user has.
 *
 * @param {Array} jsonArray - An array of message objects. Each message includes:
 *   - `user`: The user who sent the message.
 *   - `reactions`: An array of users who reacted to the message.
 *
 * @returns {Object} An object with each user's message count, reaction count, and reactions received.
 */

function refineContent(jsonArray) {
	const refined = {};

	jsonArray.forEach((message) => {
		const { user, reactions } = message;

		if (!refined[user]) {
			refined[user] = {
				messageCount: 0,
				reactionCount: 0,
				reactionsReceived: 0, // To count how many reactions the user received
			};
		}

		refined[user].messageCount++;

		if (Array.isArray(reactions) && reactions.length > 0) {
			reactions.forEach((reaction) => {
				// Count how many reactions this user received for this message
				if (reaction.users.includes(user)) {
					refined[user].reactionCount++;
				}

				// Count how many reactions the user gave across all messages
				reaction.users.forEach((reactingUser) => {
					if (reactingUser === user) {
						refined[user].reactionCount++;
					} else {
						refined[reactingUser] = refined[reactingUser] || {
							reactionCount: 0,
						};
						refined[reactingUser].reactionsReceived++;
					}
				});
			});
		}
	});

	return refined;
}

export { refineContent };
