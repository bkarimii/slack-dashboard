import { Router } from "express";
import multer from "multer";

import db from "./db.js";
import { lookupEmail } from "./functions/lookupEmail.js";
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

// Multer setup for handling file upload
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
	// Accept only zip files
	if (file.mimetype === "application/zip") {
		cb(null, true);
	} else {
		cb(new Error("Only zip files are allowed"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max size
}).single("file");

api.post("/upload", async (req, res) => {
	try {
		upload(req, res, (err) => {
			if (err) {
				return res
					.status(400)
					.json({ message: `File upload error: ${err.message}` });
			}

			if (!req.file) {
				res.status(404).json({ message: "file not fund" });
			}

			if (req.file.mimetype !== "application/zip") {
				res.status(400).json({ message: "file must be a zip type" });
			}

			res.status(200).json({ message: "File uploaded successfully!" });
		});
	} catch (error) {
		res.status(500).json({ message: "internal server error" });
	}
});

export default api;
