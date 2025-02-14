/**
 * Migration for creating the subscriptions table.
 *
 * @type {{
 *   down: (pgm: import("node-pg-migrate").MigrationBuilder) => void | Promise<void>;
 *   shorthands: Record<string, import("node-pg-migrate").ColumnDefinition>;
 *   up: (pgm: import("node-pg-migrate").MigrationBuilder) => void | Promise<void>;
 * }}
 */
const migration = {
	up(pgm) {
		pgm.createTable("subscriptions", {
			id: {
				type: "uuid",
				default: pgm.func("gen_random_uuid()"),
				primaryKey: true,
			},
			email: {
				type: "text",
				notNull: true,
				unique: true,
			},
			subscribed_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("CURRENT_TIMESTAMP"),
			},
		});

		pgm.sql(`
			INSERT INTO subscriptions (email) 
			VALUES ('test@example.com')
			ON CONFLICT (email) DO NOTHING;
		`);
	},

	down(pgm) {
		pgm.dropTable("subscriptions");
	},
};

module.exports = migration;
