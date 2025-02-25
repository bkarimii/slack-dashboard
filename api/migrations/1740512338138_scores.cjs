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
		pgm.createTable("scores", {
			id: { type: "serial", primaryKey: true },
			user_id: { type: "integer", notNull: true },
			score_date: { type: "date", notNull: true },
			score: { type: "integer", notNull: true },
		});
		pgm.addConstraint("scores", "unique_user_score_date", {
			unique: ["user_id", "score_date"],
		});

		pgm.addConstraint("scores", "fk_user", {
			foreignKeys: {
				columns: "user_id",
				references: "users(id)",
				onDelete: "CASCADE",
			},
		});
	},
	down(pgm) {
		pgm.dropTable("scores");
	},
};

module.exports = migration;
