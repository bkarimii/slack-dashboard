import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
const { Router } = express;

import db from "./db.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import messageRouter from "./messages/messageRouter.js";
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();
const api = Router();
const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);
app.use(bodyParser.json());

api.use("/message", messageRouter);

api.get("/getUserData", async (req, res) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return res.status(401).json({ error: "Authorization token missing" });
	}

	try {
		const response = await fetch("https://api.github.com/user", {
			method: "GET",
			headers: {
				Authorization: authHeader,
			},
		});

		const data = await response.json();

		if (response.ok) {
			res.json(data);
		} else {
			res
				.status(500)
				.json({ error: data.message || "Failed to fetch user data" });
		}
	} catch (error) {
		res.status(500).json({ error });
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

export default api;
