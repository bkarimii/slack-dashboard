/* eslint-disable no-unused-vars */

import config from "../utils/config.cjs";
const { web } = config;

import { getAllUsers } from "./getAllUsers.js";
import { getMessagesFromChannel } from "./getMessagesfromChannel.js";

let allUsers = [];

// Fetch all users once at the start
async function initialize() {
	try {
		allUsers = await getAllUsers(web);
	} catch (error) {
		return [];
	}
}

export async function searchForUsersMessages(userId, channelId) {
	if (allUsers.length === 0) {
		await initialize();
	}
	const userProfile = allUsers.find((user) => user.userId === userId);
	const messagesOfChannel = await getMessagesFromChannel(web, channelId);

	let numOfThreads = 0;
	let numOfReplies = 0;
	let numOfReactions = 0;
	messagesOfChannel.forEach((message) => {
		// Count if the user posted the message
		if (message.user === userId) {
			numOfThreads++;
		}

		// Count if the user replied to the message (thread replies)
		if (message.replyUsers && message.replyUsers.includes(userId)) {
			numOfReplies++;
		}

		// Count if the user reacted to the message
		if (message.reactions && message.reactions.includes(userId)) {
			numOfReactions++;
		}
	});
	const totalActivity = numOfReactions + numOfReplies + numOfThreads;
	return {
		userId: userProfile.userId,
		name: userProfile.name,
		displayName: userProfile.displayName,
		realName: userProfile.realName,
		isBot: userProfile.isBot,
		numOfThreads,
		numOfReplies,
		numOfReactions,
		totalActivity: totalActivity,
	};
}
