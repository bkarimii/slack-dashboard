import logger from "../utils/logger.js";

/**
 * Calculates the score for a user based on their activity within a specified time period.
 * If no time period is provided, it calculates the score using all available data.
 * If only a start date is provided, it calculates the score from the given start date to the latest available date.
 * If only an end date is provided, it calculates the score from the earliest available date to the given end date.
 * If both start and end dates are provided, it calculates the score for the period between the two dates.
 *
 * @param {object} db - The database connection object used to query the database.
 * @param {text} userId - The ID of the user whose score is being calculated.
 * @param {date|null} [startDate=null] - The optional start date for the activity period (in YYYY-MM-DD format).
 * @param {date|null} [endDate=null] - The optional end date for the activity period (in YYYY-MM-DD format).
 *
 * @returns {Promise<object>} The result of the score calculation, containing the success status and user score.
 *   - success (boolean): Whether the operation was successful.
 *   - userScore (number|null): The calculated score based on user activity.
 *   - message (string|null): An error message if no activity is found or another issue occurs.
 */
export const calculateScore = async (
	db,
	userId,
	startDate = null,
	endDate = null,
) => {
	try {
		// It handles the scenario where the start and end dates are not provided. In this case,
		// it calculates from the earliest to the latest date available in the database.

		if (!startDate && !endDate) {
			// date is not applied. default query.
			let query =
				"select messages, reactions,reactions_received  from slack_users_activity where user_id=$1";
			const userActivities = await db.query(query, userId);

			if (userActivities.rows.length === 0) {
				logger.warn(`No activity available for user: ${userId}`);
				return { success: false, message: "activity not found" };
			}

			const usersCount = userActivities.rows.reduce(
				(acc, row) => {
					acc.messagesCount += row.messages || 0;
					acc.reactionsCount += row.reactions || 0;
					acc.reactionsReceived += row.reactions_received || 0;
					return acc;
				},
				{ messagesCount: 0, reactionsCount: 0, reactionsReceived: 0 },
			);

			return { success: true, userCount: usersCount };
		}

		// If the end date is not provided, it calculates the score from the start date to the latest available date in the database.
		if (startDate && !endDate) {
			let query =
				"SELECT messages , reactions FROM slack_user_activity WHERE user_id=$1 AND date>$2";

			const userActivities = await db.query(query, [userId, startDate]);

			if (userActivities.rows.length === 0) {
				logger.warn(`user activity did not find after date: ${startDate}`);
				return {
					success: false,
					message: "no activity found for the given user and time period",
				};
			}

			const usersCount = userActivities.rows.reduce(
				(acc, row) => {
					acc.messagesCount += row.messages || 0;
					acc.reactionsCount += row.reactions || 0;
					acc.reactionsReceived += row.reactions_received || 0;
					return acc;
				},
				{ messagesCount: 0, reactionsCount: 0, reactionsReceived: 0 },
			);

			return { success: true, userScore: usersCount };
		}

		// If the end date is provided, it calculates the score from the start date to the provided end date, using data up to the earliest available date in the database.
		if (!startDate && endDate) {
			const query =
				"SELECT messages , reactions FROM slack_user_activity WHERE user_id=$1 AND date<$2";

			const userActivities = await db.query(query, [userId, endDate]);

			if (userActivities.rows.length === 0) {
				logger.warn(`user activity did not find before date: ${endDate}`);
				return {
					success: false,
					message: "no activity found for the given user and time period",
				};
			}

			const usersCount = userActivities.rows.reduce(
				(acc, row) => {
					acc.messagesCount += row.messages || 0;
					acc.reactionsCount += row.reactions || 0;
					acc.reactionsReceived += row.reactions_received || 0;
					return acc;
				},
				{ messagesCount: 0, reactionsCount: 0, reactionsReceived: 0 },
			);

			return { success: true, userCount: usersCount };
		}

		// Finally, if both the start and end dates are provided, it calculates the score for the specified period of time between the two dates.
		const query =
			"SELECT messages , reactions FROM slack_user_activity WHERE user_id=$1 AND date between $2 AND $3";

		const userActivities = await db.query(query, [userId, startDate, endDate]);

		if (userActivities.rows.length === 0) {
			logger.warn(
				`No user activity found for user ${userId} between ${startDate} and ${endDate}`,
			);

			return {
				success: false,
				message: "no activity found for the given user and time period",
			};
		}

		const usersCount = userActivities.rows.reduce(
			(acc, row) => {
				acc.messagesCount += row.messages || 0;
				acc.reactionsCount += row.reactions || 0;
				acc.reactionsReceived += row.reactions_received || 0;
				return acc;
			},
			{ messagesCount: 0, reactionsCount: 0, reactionsReceived: 0 },
		);

		return { success: true, usersCount: usersCount };
	} catch (error) {
		logger.error(error);
		return false;
	}
};
