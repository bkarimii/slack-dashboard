import { Router } from "express";

import { searchForUsersMessages } from "./functions/searchUsersMessages.js";
import messageRouter from "./messages/messageRouter.js";

const api = Router();

api.use("/message", messageRouter);

api.get("/user-messages", async (req, res) => {
	const { userId, channelId } = req.body;

	try {
		const messagesAndUsers = await searchForUsersMessages(userId, channelId);
		res.status(200).json(messagesAndUsers);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

export default api;
