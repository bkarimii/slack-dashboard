/**
 * Calculates a user score based on activity, considering messages, reactions, and reactions received.
 *
 * The score is determined by a weighted combination of the number of messages, reactions, and reactions received.
 * This helps measure engagement, where reactions and reactions received may indicate higher interaction quality.
 *
 * @param {Object} params - The parameters for calculating the score.
 * @param {number} params.messages - The number of messages sent by the user.
 * @param {number} params.reactions - The number of reactions received on messages.
 * @param {number} params.reactionsReceived - The number of reactions the user has received on their messages.
 * @param {number} [params.messageWeight=3] - The weight applied to the number of messages.
 * @param {number} [params.reactionWeight=1] - The weight applied to the number of reactions.
 * @param {number} [params.reactionsReceivedWeight=1] - The weight applied to the number of reactions received.
 *
 * @returns {number} The calculated engagement score.
 *   - If both messages and reactions are greater than 0, the score is calculated as:
 *     `messageWeight * messages + reactionWeight * reactions + reactionsReceivedWeight * reactionsReceived`
 *   - If only messages are provided, the score is calculated as `messageWeight * messages + reactionsReceivedWeight * reactionsReceived`.
 *   - If only reactions are provided, the score is calculated as `reactionWeight * reactions`.
 *   - If no valid messages or reactions are provided, the score will be 0.
 */
export const decideScore = ({
	messages,
	reactions,
	reactionsReceived,
	messageWeight = 3,
	reactionWeight = 1,
	reactionsReceivedWeight = 1,
}) => {
	if (!Number.isFinite(messages)) messages = 0;
	if (!Number.isFinite(reactions)) reactions = 0;
	if (!Number.isFinite(reactionsReceived)) reactionsReceived = 0;

	if (messages > 0 && reactions > 0) {
		return (
			messageWeight * messages +
			reactionWeight * reactions +
			reactionsReceivedWeight * reactionsReceived
		);
	}

	if (messages <= 0 && reactions <= 0) return 0;

	// If there are no messages, ignore reactionsReceived.
	if (!messages) {
		return reactionWeight * reactions;
	}

	if (!reactions) {
		return (
			messageWeight * messages + reactionsReceivedWeight * reactionsReceived
		);
	}
};
