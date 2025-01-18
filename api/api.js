/* eslint-disable no-console */

import { Router } from "express";

import { getMessagesFromChannel } from "./functions/getMessagesfromChannel.js";
import { searchForUsersMessages } from "./functions/searchUsersMessages.js";
import messageRouter from "./messages/messageRouter.js";

const api = Router();

api.use("/message", messageRouter);

api.get("/user-messages", async (req, res) => {
	const { userId, channelId } = req.body;
	console.log(userId, "==============");

	try {
		const messagesAndUsers = await searchForUsersMessages(userId, channelId);
		console.log(messagesAndUsers, "<---------------Variable");
		console.log(getMessagesFromChannel(userId), "<---------FUNCTION");
		res.status(200).json(messagesAndUsers);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: err });
	}
});

export default api;
