import { Router } from "express";

import { lookupEmail } from "./functions/lookupEmails.js";
import messageRouter from "./messages/messageRouter.js";

const api = Router();

api.use("/message", messageRouter);

api.post("/subscribe", async (req, res) => {
	const email = req.body.email;

	try {
		if (!email) {
			res.status(400).json({ sucess: false, message: "bad request" });
		}

		const user = await lookupEmail(email);

		if (user.ok) {
			// Insert users data into DB here...

			res.status(200).json({ sucess: true });
		}
	} catch (error) {
		res.status(500).json({ message: "internal server error" });
	}
});

export default api;
