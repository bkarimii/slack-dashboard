import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
const { Router } = express;

import db from "./db.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import { processImportFiles } from "./functions/processImportFiles.js";
import { updateDbUsers } from "./functions/updateDbUsers.js";
import { updateUsersActivity } from "./functions/updateUsersActivity.js";
import messageRouter from "./messages/messageRouter.js";
import { processUpload } from "./middlewares/processUpload.js";
import { zipExtractor } from "./middlewares/zipExtractor.js";
import { CLIENT_ID, CLIENT_SECRET } from "./utils/config.cjs";
import logger from "./utils/logger.js";
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();
const api = Router();
const app = express();

// Middleware to verify the token

// Middleware to verify the token
const verifyToken = async (req, res, next) => {
	const token = req.get("Authorization"); // Authorization: Bearer <token>

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Authorization token is required" });
	}

	try {
		const response = await fetch("https://api.github.com/user", {
			method: "GET",
			headers: {
				Authorization: token,
			},
		});

		if (response.ok) {
			const userData = await response.json();
			req.userData = userData; // Attach user data to the request
			next();
		} else {
			return res
				.status(401)
				.json({ success: false, message: "Invalid or expired token" });
		}
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Error verifying token", error });
	}
};

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);
app.use(bodyParser.json());

api.use("/message", messageRouter);

app.post("/getAccessToken", async (req, res) => {
	const { code } = req.body; // Get the code from the request body
	if (!code) {
		return res
			.status(400)
			.json({ success: false, message: "Code parameter is required" });
	}

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		code,
	});

	try {
		const response = await fetch(
			`https://github.com/login/oauth/access_token?${params.toString()}`,
			{
				method: "POST",
				headers: { Accept: "application/json" },
			},
		);

		const data = await response.json();

		if (data.access_token) {
			return res.json({ access_token: data.access_token });
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Failed to retrieve access token" });
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.toString(),
		});
	}
});

// Protected Route: Get User Data
api.get("/getUserData", verifyToken, async (req, res) => {
	try {
		const userData = req.userData;
		res.json(userData);
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Failed to get user data", error });
	}
});

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

api.post("/upload", processUpload, async (req, res) => {
	try {
		const slackZipBuffer = req.file.buffer;
		const extractedDir = zipExtractor(slackZipBuffer);

		const processedActivity = processImportFiles(extractedDir);

		const isUsersInserted = await updateDbUsers(extractedDir, db);

		if (!isUsersInserted.success) {
			return res.status(500).json({});
		}

		const isActivityInserted = await updateUsersActivity(processedActivity, db);

		if (!isActivityInserted.success) {
			return res.status(500).json({});
		}

		return res.status(200).json({});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({});
	}
});

export default api;
