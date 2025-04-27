const { PgLiteral } = require("node-pg-migrate");

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
	shorthands: {
		uuid: {
			type: "UUID",
			default: PgLiteral.create("gen_random_uuid()"),
			primaryKey: true,
		},
	},

	up(pgm) {
		pgm.createTable("sessions", {
			expire: { type: "timestamp(6)", notNull: true },
			sess: { type: "json", notNull: true },
			sid: { type: "varchar", notNull: true },
		});

		pgm.createConstraint("sessions", "session_pkey", {
			primaryKey: "sid",
		});

		pgm.createIndex("sessions", "expire");

		pgm.createTable("users", {
			id: "uuid",
			email: { type: "text", notNull: true, unique: true },
			github_id: "int",
			name: "text",
		});
	},

	down(pgm) {
		pgm.dropTable("users");
		pgm.dropIndex("sessions", "expire");
		pgm.dropConstraint("sessions", "session_pkey");
		pgm.dropTable("sessions");
	},
};

module.exports = migration;
