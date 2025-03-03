import { zipExtractor } from "../middleWares/zipExtractor.js";

import { refineContent } from "./refineContent.js";

/**
 * Updates the counts object with the messages and reactions from the slack data
 * @param {Object} zipBuffer - files buffer object
 * @returns {Object} The updated counts object
 */
function updateCounts(zipBuffer) {
	// Use zipExtractor to extract the zip file in memory
	try {
		const extractedDir = zipExtractor(zipBuffer);

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

			if (!channelFiles[channel]) {
				channelFiles[channel] = {};
			}

			channelContent.forEach((entry) => {
				const fileDate = entry.name.split("/").pop().split(".json")[0];
				const fileContent = JSON.parse(entry.content);
				const refined = refineContent(fileContent);

				if (!channelFiles[channel][fileDate]) {
					channelFiles[channel][fileDate] = {};
				}

				for (const user in refined) {
					if (!channelFiles[channel][fileDate][user]) {
						channelFiles[channel][fileDate][user] = {
							messages: 0,
							reactions: 0,
							reactionsReceived: 0,
						};
					}

					// Aggregate messages and reactions for each user on the specific date
					channelFiles[channel][fileDate][user].messages +=
						refined[user].messageCount;
					channelFiles[channel][fileDate][user].reactions +=
						refined[user].reactionCount;
					channelFiles[channel][fileDate][user].reactionsReceived +=
						refined[user].reactionsReceived;
				}
			});
		});

		return channelFiles;
	} catch (error) {
		return [];
	}
}

export { updateCounts };
