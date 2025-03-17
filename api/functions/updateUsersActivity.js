import logger from "../utils/logger.js";

export const updateUsersActivity = async (processedActivity, db) => {
	try {
		await db.query("BEGIN");
	} catch (error) {
		logger.debug(error);
	}
};
