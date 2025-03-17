/**
 * Template for
 * {@link https://salsita.github.io/node-pg-migrate/#/migrations?id=defining-migrations defining migrations}.
 *
 * @type {{
 *   down: (pgm: import("node-pg-migrate").MigrationBuilder) => void | Promise<void>;
 *   shorthands: Record<string, import("node-pg-migrate").ColumnDefinition>;
 *   up: (pgm: import("node-pg-migrate").MigrationBuilder) => void | Promise<void>;
 * }}
 */
const migration = {
	up(pgm) {
		pgm.createTable("slack_user_activity", {
			id: { type: "serial", primaryKey: true },
			date: { type: "date", notNull: true },
			user_id: {
				type: "text",
				notNull: true,
				references: "all_users(user_id)",
				onDelete: "CASCADE",
			},
			messages: { type: "integer", default: 0, notNull: true },
			reactions: { type: "integer", default: 0, notNull: true },
			reactions_received: { type: "integer", default: 0, notNull: true },
		});
	},

	down(pgm) {
		pgm.dropTable("slack_user_activity");
	},
};

module.exports = migration;
