import { Router } from "express";

import db from "./db.js";
import { decideStatus } from "./functions/decideStatus.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import { processImportFiles } from "./functions/processImportFiles.js";
import { updateDbUsers } from "./functions/updateDbUsers.js";
import { updateUsersActivity } from "./functions/updateUsersActivity.js";
import messageRouter from "./messages/messageRouter.js";
import { processUpload } from "./middlewares/processUpload.js";
import { zipExtractor } from "./middlewares/zipExtractor.js";
import logger from "./utils/logger.js";

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

api.get("/users/status-counts", async (req, res) => {
	const startDate = req.query.start_date;
	const endDate = req.query.end_date;
	try {
		const dbFetchedActivity = await db.query(
			"select user_id , messages , reactions , reactions_received FROM slack_user_activity WHERE date BETWEEN $1 AND $2 ",
			[startDate, endDate],
		);
		const userActivities = dbFetchedActivity.rows;

		const rawUsers = await db.query("SELECT user_id FROM all_users");
		const allusers = rawUsers.rows;

		const rawConfigTable = await db.query("SELECT * FROM config_table");
		const configTable = rawConfigTable.rows[0];

		const overalStatus = { low: 0, medium: 0, high: 0, inactive: 0 };

		for (const user of allusers) {
			const status = await decideStatus(
				configTable,
				user.user_id,
				userActivities,
			);

			if (status.success) {
				overalStatus[status.status] += 1;
			} else {
				logger.warn(status.message);
				return res.status(404).json({});
			}
		}

		return res.status(200).json({ status: overalStatus });
	} catch (error) {
		res.status(500).json({ msg: "server error" });
	}
});

api.put("/config", async (req, res) => {
	const {
		lowTreshholds,
		mediumTreshholds,
		highTreshHolds,
		messagesWeighting,
		reactionsWeighting,
		reactionsReceivedWeighting,
	} = req.body;

	if (
		!Number.isInteger(lowTreshholds) ||
		!Number.isInteger(mediumTreshholds) ||
		!Number.isInteger(highTreshHolds) ||
		!Number.isFinite(messagesWeighting) ||
		!Number.isFinite(reactionsWeighting) ||
		!Number.isFinite(reactionsReceivedWeighting)
	) {
		return res.status(400).json({});
	}

	try {
		const updateQuery = `
      UPDATE config_table 
      SET 
        low_threshold = $1, 
        medium_threshold = $2, 
        high_threshold = $3,
        message_weighting = $4,
        reactions_weighting = $5,
        reactions_received_weighting = $6
      WHERE id = 1
    `;
		const updatedConfigs = await db.query(updateQuery, [
			lowTreshholds,
			mediumTreshholds,
			highTreshHolds,
			messagesWeighting,
			reactionsWeighting,
			reactionsReceivedWeighting,
		]);

		if (updatedConfigs.rowCount === 0) {
			return res.status(404).json({});
		}

		return res.status(200).json({});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({});
	}
});

export default api;
