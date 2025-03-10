export const updateDbUsers = async (usersFile, db) => {
	try {
		await db.query("BEGIN");

		await db.query("DELETE FROM all_users");

		const activeUsers = usersFile.filter((user) => !user.deleted);

		if (activeUsers.length === 0) {
			db.query("ROLLBACK");
			return {
				success: false,
				message: "active user is empty.something is wrong",
			};
		}

		// batch insert query
		const insertQuery = `
            INSERT INTO all_users (user_id, display_name, display_name_normalised, is_admin, email)
            VALUES ${activeUsers.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
        `;

		const queryValues = activeUsers.flatMap((user) => [
			user.id,
			user.profile.display_name,
			user.profile.display_name_normalized,
			user.is_admin,
			user.profile.email,
		]);

		// Insert all users in a single query
		await db.query(insertQuery, queryValues);

		await db.query("COMMIT");

		return { success: true };
	} catch (error) {
		await db.query("ROLLBACK");
		return { success: false };
	}
};
