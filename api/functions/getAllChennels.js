export async function getAllChannels(web) {
	const allChannels = [];
	let nextCursor = null;

	try {
		do {
			const response = await web.conversations.list({
				types: "public_channel,private_channel",
				limit: 100, // Maximum channels per request
				cursor: nextCursor,
			});

			if (response.ok) {
				// Append the channels from the current response
				allChannels.push(...response.channels);

				// Update the cursor for pagination
				nextCursor = response.response_metadata?.next_cursor;
			} else {
				throw new Error(`Failed to fetch channels: ${response.error}`);
			}
		} while (nextCursor); // Continue fetching if there's more data

		const listOfChannels = [];
		allChannels.forEach((eachChannel) => {
			listOfChannels.push({
				channelId: eachChannel.id,
				channelName: eachChannel.name,
				isChannel: eachChannel.is_channel,
				isGroup: eachChannel.is_group,
				isPrivate: eachChannel.is_private,
				creationDateTime: eachChannel.created,
				numOfMembers: eachChannel.num_members,
			});
		});
		return listOfChannels;
	} catch (error) {
		return [];
	}
}
