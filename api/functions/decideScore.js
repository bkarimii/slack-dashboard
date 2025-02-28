/**
 * Calculates a user score based on activity, considering both messages and reactions that are sent.
 *
 * The score is determined by a weighted combination of the number of messages and reactions.
 * This helps measure engagement, where reactions may indicate higher interaction quality.
 *
 * @param {number} messages - The number of messages sent by the user.
 * @param {number} reactions - The number of reactions received on messages.
 * @returns {number} The calculated engagement score.
 */

export const decideScore = ({ messages, reactions }) => {
	if (!Number.isFinite(messages)) messages = 0;
	if (!Number.isFinite(reactions)) reactions = 0;

	if (messages > 0 && reactions > 0) return messages * 3 + reactions;

	if (messages <= 0 && reactions <= 0) return 0;

	if (!messages) return reactions;

	if (!reactions) return messages * 3;
};
