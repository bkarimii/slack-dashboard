import { Router } from "express";

import db from "./db.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import { updateCounts } from "./functions/updateCounts.js";
import messageRouter from "./messages/messageRouter.js";
import { slackUploadMiddleware } from "./middleWares/multerConfig.js";
import { zipExtractor } from "./middleWares/zipExtractor.js";

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
				"INSERT INTO subscriptions (email, subscribed_at) VALUES ($1, NOW())",
				[email],
			);

			res.redirect("/subscribe/confirmation");
		} else {
			// Redirect to error page with appropriate error status
			switch (user.error) {
				case "An API error occurred: users_not_found":
					return res.redirect("/subscribe/error?status=not-found");
				case "A critical server error occurred.try again later.":
					return res.redirect("/subscribe/error?status=server-error");
				case "The request was missing or incomplete. check your input and try again.":
					return res.redirect("/subscribe/error?status=bad-request");
				case "The service is temporarily unavailable. Please try again later.":
					return res.redirect("/subscribe/error?status=service-unavailable");
				default:
					return res.redirect(`/subscribe/error?status=unknown-error&message`);
			}
		}
	} catch (error) {
		return res.redirect("/subscribe/error?status=server-error");
	}
});

api.get("/fetch-users", async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM all_users");

		if (!result.rows.length === 0) {
			res.status(404).json({ success: false, message: "User not fund" });
		} else {
			res.status(200).json(result.rows);
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

api.post("/upload", slackUploadMiddleware, async (req, res) => {
	try {
		const slackZipBuffer = req.file.buffer;
		const extractedDir = zipExtractor(slackZipBuffer);
		// eslint-disable-next-line no-unused-vars
		const usersActivityAnalysis = updateCounts(extractedDir);

		// @todo insert userActivity into database

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ message: "internal server error" });
	}
});

export default api;
