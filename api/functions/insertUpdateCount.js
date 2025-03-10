/* 
 @param {object} data - The object returned by the updateCount function 
 @return {boolean} - Returns true if the insertion was successful, false otherwise
 */

export const insertUpdateCount = async (data, db) => {
	try {
		await db.query("BEGIN");

		// Collect all the values for insertion
		const values = [];
		const insertValues = [];

		for (const channel in data) {
			for (const date in data[channel]) {
				for (const userId in data[channel][date]) {
					const { messages, reactions, reactionsReceived } =
						data[channel][date][userId];

					// Prepare the values for batch insert
					values.push(
						channel,
						date,
						userId,
						messages,
						reactions,
						reactionsReceived,
					);

					// Prepare the insert query for each record
					insertValues.push(
						`($${values.length - 5}, $${values.length - 4}, $${values.length - 3}, $${values.length - 2}, $${values.length - 1}, $${values.length})`,
					);
				}
			}
		}

		if (insertValues.length > 0) {
			// Create a batch insert query using the prepared values
			const insertQuery = `
                INSERT INTO slack_user_activity (channel, date, user_id, messages, reactions, reactions_received)
                VALUES ${insertValues.join(", ")}
                ON CONFLICT (channel, date, user_id)
                DO UPDATE SET 
                  messages = EXCLUDED.messages , 
                  reactions = EXCLUDED.reactions, 
                  reactions_received = EXCLUDED.reactions_received;
            `;

			await db.query(insertQuery, values);
		}

		await db.query("COMMIT");

		return { success: true };
	} catch (error) {
		await db.query("ROLLBACK");
		return { success: false };
	}
};
