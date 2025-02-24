/**
 * Decides a score for a userbased on the number of messages and reactions
 * @param {number} messages - The number of messages
 * @param {number} reactions - The number of reactions
 * @returns {number} The score
 */
export const decideScore = ({ messages, reactions }) => {
	if (!Number.isFinite(messages)) messages = 0;
	if (!Number.isFinite(reactions)) reactions = 0;

	if (messages > 0 && reactions > 0) {
		return messages * 3 + reactions;
	} else if (messages <= 0 && reactions <= 0) {
		return 0;
	} else if (!messages) {
		return reactions;
	} else if (!reactions) {
		return messages * 3;
	} else {
		return 0;
	}
};
