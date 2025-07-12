import { Router } from "express";

import db from "./db.js";
import { decideStatus } from "./functions/decideStatus.js";
import { getBoxPlotData } from "./functions/getBoxPlotData.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import { processImportFiles } from "./functions/processImportFiles.js";
import { scoreNormaliser } from "./functions/scoreNormaliser.js";
import { updateDbUsers } from "./functions/updateDbUsers.js";
import { updateUsersActivity } from "./functions/updateUsersActivity.js";
import messageRouter from "./messages/messageRouter.js";
import { processUpload } from "./middlewares/processUpload.js";
import { zipExtractor } from "./middlewares/zipExtractor.js";
import logger from "./utils/logger.js";

const api = Router();

api.use("/message", messageRouter);

/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: Subscribe a user by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@email.com
 *     responses:
 *       302:
 *         description: Redirects on success or failure
 */
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

/**
 * @swagger
 * /fetch-users:
 *   get:
 *     summary: Retrieve all users from the database
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
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

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload and process a Slack export file
 *     description: Accepts a Slack export ZIP file, extracts its contents, processes the data, and updates the database with user and activity information.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Slack export ZIP file to upload and process.
 *     responses:
 *       200:
 *         description: The file was successfully processed, and the database was updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request. The uploaded file is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid file upload.
 *       500:
 *         description: Internal server error. An error occurred while processing the file or updating the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error.
 */
api.post("/upload", processUpload, async (req, res) => {
	try {
		const slackZipBuffer = req.file.buffer;
		const extractedDir = zipExtractor(slackZipBuffer);

		const processedActivity = processImportFiles(extractedDir);

		await updateDbUsers(extractedDir, db);

		const isActivityInserted = await updateUsersActivity(processedActivity, db);

		if (isActivityInserted) {
			logger.info(
				"isActivityInserted in the upload endpoint? => inserted successfully",
			);
			return res.status(200).json({});
		}

		return res.status(500).json({});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({});
	}
});

/**
 * @swagger
 * /users/status-counts:
 *   get:
 *     summary: Get user activity status counts
 *     description: Retrieves user activity data within a specified date range, normalizes the scores, and calculates the status and box plot data.
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for the activity data (YYYY-MM-DD).
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for the activity data (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Successfully retrieved user activity status counts and box plot data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                         description: The ID of the user.
 *                       status:
 *                         type: string
 *                         description: The calculated status of the user.
 *                 boxPlotData:
 *                   type: object
 *                   description: Data for generating a box plot of normalized scores.
 *       400:
 *         description: Bad request. Missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid query parameters.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: server error.
 */
api.get("/users/status-counts", async (req, res) => {
	const startDate = req.query.start_date;
	const endDate = req.query.end_date;
	try {
		const dbFetchedActivity = await db.query(
			"select user_id , messages , reactions , reactions_received FROM slack_user_activity WHERE date BETWEEN $1 AND $2 ",
			[startDate, endDate],
		);
		const userActivities = dbFetchedActivity.rows;

		const rawUsers = await db.query(
			"SELECT user_id,display_name_normalised,email FROM all_users",
		);
		const allusers = rawUsers.rows;

		const rawConfigTable = await db.query("SELECT * FROM config_table");
		const configTable = rawConfigTable.rows[0];

		const normalisedScores = scoreNormaliser(
			allusers,
			userActivities,
			configTable,
		);

		const boxPlotData = getBoxPlotData(normalisedScores);
		const totalStatus = await decideStatus(normalisedScores, configTable);

		return res
			.status(200)
			.json({ status: totalStatus, boxPlotData: boxPlotData });
	} catch (error) {
		res.status(500).json({ msg: "server error" });
	}
});

/**
 * @swagger
 * /config:
 *   put:
 *     summary: Update configuration settings
 *     description: Updates the thresholds and weightings for the application configuration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lowTreshholds:
 *                 type: integer
 *                 description: The low threshold value.
 *                 example: 10
 *               mediumTreshholds:
 *                 type: integer
 *                 description: The medium threshold value.
 *                 example: 20
 *               highTreshHolds:
 *                 type: integer
 *                 description: The high threshold value.
 *                 example: 30
 *               messagesWeighting:
 *                 type: number
 *                 description: The weighting for messages.
 *                 example: 1.5
 *               reactionsWeighting:
 *                 type: number
 *                 description: The weighting for reactions.
 *                 example: 2.0
 *               reactionsReceivedWeighting:
 *                 type: number
 *                 description: The weighting for reactions received.
 *                 example: 2.5
 *     responses:
 *       200:
 *         description: Configuration updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request. Invalid or missing input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *       404:
 *         description: Configuration not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Configuration not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error.
 */
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
		logger.error("input values are inavalid");
		return res.status(400).json({ message: "total weight must be 100" });
	}

	const totalWeights =
		messagesWeighting + reactionsWeighting + reactionsReceivedWeighting;

	if (totalWeights !== 100) {
		res.status(400).json({});
	}

	if (lowTreshholds + mediumTreshholds + highTreshHolds !== 100) {
		logger.error("Thresholds must add up to 100.");
		return res.status(400).json({});
	}

	if (
		!(lowTreshholds < mediumTreshholds && mediumTreshholds < highTreshHolds)
	) {
		logger.error(
			"Thresholds must be in increasing order: low < medium < high.",
		);
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
