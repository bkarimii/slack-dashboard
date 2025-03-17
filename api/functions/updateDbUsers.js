export const updateDbUsers = async (usersFile, db) => {
	try {
		if (!usersFile) {
			return { success: false, message: "invalid uploaded users" };
		}

		await db.query("BEGIN");

		const activeUsers = usersFile.filter(
			(user) =>
				!user.deleted &&
				user.id &&
				user.display_name &&
				user.display_name_normalized &&
				user.email &&
				user.is_admin !== undefined,
		);

		if (activeUsers.length === 0) {
			await db.query("ROLLBACK");
			return {
				success: false,
				message: "active user is empty.something is wrong",
			};
		}

		// Batch upsert query
		const insertQuery = `
            INSERT INTO all_users (user_id, display_name, display_name_normalised, is_admin, email)
            VALUES ${activeUsers.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                display_name = EXCLUDED.display_name,
                display_name_normalised = EXCLUDED.display_name_normalised,
                is_admin = EXCLUDED.is_admin,
                email = EXCLUDED.email
        `;

		const queryValues = activeUsers.flatMap((user) => [
			user.id,
			user.profile.display_name,
			user.profile.display_name_normalized,
			user.is_admin ?? false,
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
