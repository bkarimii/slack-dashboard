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
			user_id: { type: "text", unique: true, notNull: true },
			title: { type: "text" },
			name: { type: "text" },
			real_name: { type: "text", notNull: true },
			real_name_normalised: { type: "text" },
			display_name: { type: "text" },
			display_name_normalised: { type: "text" },
			firstname: { type: "text" },
			lastname: { type: "text" },
			is_admin: { type: "boolean", default: false },
			is_owner: { type: "boolean", default: false },
			is_bot: { type: "boolean", default: false },
			is_app_user: { type: "boolean", default: false },
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
