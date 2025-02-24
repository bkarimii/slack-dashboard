import logger from "../utils/logger.js";

/**
 * Updates the counts object with the messages and reactions from the slack data
 * @param {Object} counts - The counts object
 * @param {Object} slackData - The slack data
 * @returns {Object} The updated counts object
 */
export const updateCounts = ({ counts, slackData }) => {
	logger.debug(counts, slackData);
	// @todo Implement this function
	return {
		"01-02-2025": {
			U1234: {
				messages: 12,
				reactions: 22,
			},
			U5678: {
				messages: 3,
			},
		},
		"02-02-2025": {
			U1234: {
				messages: 33,
				reactions: 45,
			},
			U5678: {
				reactions: 11,
			},
		},
	};
};
