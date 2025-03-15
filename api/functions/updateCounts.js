import { refineContent } from "./refineContent.js";

/**
 * Updates the counts object with the messages and reactions from the slack data
 * @param {Object} zipBuffer - files buffer object
 * @returns {Object} The updated counts object
 */

export const updateCounts = (extractedDir) => {
	// Use zipExtractor to extract the zip file in memory
	try {
		const userActivityPerDay = {};

		const channels = extractedDir
			.filter((entry) => entry.isDirectory)
			.map((entry) => entry.name);

		channels.forEach((channel) => {
			// Filter the files that belong to this channel
			const channelContent = extractedDir.filter(
				(entry) =>
					entry.name.startsWith(channel) && entry.name.endsWith(".json"),
			);

			channelContent.forEach((entry) => {
				const fileDate = entry.name.split("/").pop().split(".json")[0];
				const fileContent = JSON.parse(entry.content);
				const refined = refineContent(fileContent);

				if (!userActivityPerDay[fileDate]) {
					userActivityPerDay[fileDate] = {};
				}

				for (const user in refined) {
					if (!userActivityPerDay[fileDate][user]) {
						userActivityPerDay[fileDate][user] = {
							messages: 0,
							reactions: 0,
							reactionsReceived: 0,
						};
					}

					// Aggregate messages and reactions for each user on the specific date
					userActivityPerDay[fileDate][user].messages +=
						refined[user].messageCount;
					userActivityPerDay[fileDate][user].reactions +=
						refined[user].reactionCount;
					userActivityPerDay[fileDate][user].reactionsReceived +=
						refined[user].reactionsReceived;
				}
			});
		});

		return userActivityPerDay;
	} catch (error) {
		return [];
	}
};
