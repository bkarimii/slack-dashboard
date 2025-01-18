import { callWithRetry } from "../utils/throttling.js";

export async function getMessagesFromChannel(web, channelId) {
	try {
		let allMessages = [];
		let hasMore = true;
		let cursor;

		// Fetch all messages, handling pagination
		while (hasMore) {
			const result = await callWithRetry(web.conversations.history.bind(web), {
				channel: channelId,
				cursor: cursor, // This is for pagination
			});

			result.messages.filter((eachMessage) => {
				if (!eachMessage.bot_id) {
					allMessages.push({
						user: eachMessage.user,
						messageText: eachMessage.text,
						replyCount: eachMessage.replyCount ? eachMessage.replyCount : 0,
						replyUsersCount: eachMessage.reply_users_count
							? eachMessage.reply_users_count
							: 0,
						replyUsers: eachMessage.reply_users ? eachMessage.reply_users : [],
						ts: eachMessage.ts,
						reactions: eachMessage.reactions
							? gatherUsersFromReactions(eachMessage.reactions)
							: [],
					});
				}
			});

			// Check if there are more messages to fetch (pagination)
			cursor = result.response_metadata.next_cursor;
			hasMore = Boolean(cursor);
		}

		return allMessages;
	} catch (error) {
		return { message: error };
	}
}

// This function prepare messages reactions in an approperiate format
function gatherUsersFromReactions(reactions) {
	const userIds = [];
	try {
		reactions.forEach((reaction) => {
			if (reaction.users && Array.isArray(reaction.users)) {
				userIds.push(...reaction.users);
			}
		});

		return [...new Set(userIds)];
	} catch {
		return [];
	}
}
