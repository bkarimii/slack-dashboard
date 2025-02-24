import logger from "../utils/logger.js";

/**
 * Decides a score for a userbased on the number of messages and reactions
 * @param {number} messages - The number of messages
 * @param {number} reactions - The number of reactions
 * @returns {number} The score
 */
export const decideScore = ({ messages, reactions }) => {
	// @todo: Implement the logic to decide the score
	logger.debug(messages, reactions);
	return 50;
};
