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
		pgm.createTable("all_users", {
			id: { type: "serial", primaryKey: true },
			userId: { type: "text", unique: true, notNull: true },
			realName: { type: "text", notNull: true },
			displayName: { type: "text" },
			firstname: { type: "text" },
			lastname: { type: "text" },
			isAdmin: { type: "boolean", default: false },
			isOwner: { type: "boolean", default: false },
			isBot: { type: "boolean", default: false },
			isAppUser: { type: "boolean", default: false },
			image_72: { type: "text" },
			image_192: { type: "text" },
			updated: { type: "timestamp", default: pgm.func("current_timestamp") },
		});
	},
	down(pgm) {
		pgm.dropTable("all_users");
	},
};

module.exports = migration;
