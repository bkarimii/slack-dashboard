import { Router } from "express";

import db from "./db.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import { lookupEmail } from "./functions/lookupEmail.js";
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
			// Check if the user is already subscribed
			const existingUser = await db.query(
				"SELECT * FROM subscriptions WHERE email = $1",
				[email],
			);

			if (existingUser.rowCount > 0) {
				return res.redirect("/subscribe/error?status=duplicate");
			}

			// Insert user into the database
			await db.query(
				"INSERT INTO subscriptions (email, created_at) VALUES ($1, NOW())",
				[email],
			);

			res.redirect("/subscribe/confirmation");
		}
	} catch (error) {
		return res.redirect("/subscribe/error?status=server-error");
	}
});

export default api;
