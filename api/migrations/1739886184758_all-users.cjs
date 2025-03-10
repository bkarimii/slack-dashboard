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
			display_name: { type: "text", notNull: true },
			display_name_normalised: { type: "text", notNull: true },
			is_admin: { type: "boolean", notNull: true },
			email: { type: "text", unique: true, notNull: true },
		});
	},

	down(pgm) {
		pgm.dropTable("all_users");
	},
};

module.exports = migration;
