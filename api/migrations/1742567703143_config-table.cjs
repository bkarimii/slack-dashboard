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
		pgm.createTable("config_table", {
			id: { type: "serial", primaryKey: true },
			low_threshold: { type: "integer", notNull: true, default: 1 },
			medium_threshold: { type: "integer", notNull: true, default: 5 },
			high_threshold: { type: "integer", notNull: true, default: 10 },
			message_weighting: { type: "float", notNull: true, default: 3 },
			reactions_weighting: { type: "float", notNull: true, default: 1 },
			reactions_received_weighting: {
				type: "float",
				notNull: true,
				default: 1,
			},
		});
	},
	down(pgm) {
		pgm.dropTable("config_table");
	},
	shorthands: undefined,
};

module.exports = migration;
