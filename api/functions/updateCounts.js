import { refineContent } from "./refineContent.js";

/**
 * Updates the counts object with the messages and reactions from the slack data
 * @param {Object} zipBuffer - files buffer object
 * @returns {Object} The updated counts object
 */

export const updateCounts = (extractedDir) => {
	// Use zipExtractor to extract the zip file in memory
	try {
		const channelFiles = {};

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

				if (!channelFiles[fileDate]) {
					channelFiles[fileDate] = {};
				}

				for (const user in refined) {
					if (!channelFiles[fileDate][user]) {
						channelFiles[fileDate][user] = {
							messages: 0,
							reactions: 0,
							reactionsReceived: 0,
						};
					}

					// Aggregate messages and reactions for each user on the specific date
					channelFiles[fileDate][user].messages += refined[user].messageCount;
					channelFiles[fileDate][user].reactions += refined[user].reactionCount;
					channelFiles[fileDate][user].reactionsReceived +=
						refined[user].reactionsReceived;
				}
			});
		});

		return channelFiles;
	} catch (error) {
		return [];
	}
};
