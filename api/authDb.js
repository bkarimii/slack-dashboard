import pgSession from "connect-pg-simple";
import session, { MemoryStore } from "express-session";
import pg from "pg";
import format from "pg-format";

import config from "./utils/config.cjs";
import logger from "./utils/logger.js";

/** @type {pg.Pool} */
let pool;

/**
 * @param {import("pg").ClientConfig} config
 */
export const connectDb = async (config) => {
	pool = new pg.Pool(config);
	pool.on("error", (err) => logger.error("%O", err));
	const client = await pool.connect();
	logger.info("connected to %s", client.database);
	client.release();
};

export const disconnectDb = async () => {
	if (pool) {
		await pool.end();
	}
};

export default {
	query(...args) {
		if (!config.production) {
			logger.debug("Postgres querying %O", args);
		} else {
			logger.debug("Postgres querying %s", args[0]);
		}
		return pool.query.apply(pool, args);
	},
};

/**
 * Access this with `import db from "path/to/db";` then use it with
 * `await db.query("<SQL>", [...<variables>])`.
 */

export const ErrorCodes = {
	UNIQUE_VIOLATION: "23505",
};

export const getSessionStore = () => {
	const store = config.sessionStore;
	switch (store) {
		case "memory":
			return new MemoryStore();
		case "postgres":
			return new (pgSession(session))({ pool, tableName: "sessions" });
		default:
			throw new Error(`unknown store type: ${store}`);
	}
};

/**
 * Create an insert query for the given table name and columns.
 * @param {string} tableName
 * @param {string[]} columns
 * @returns {string}
 */
export function insertQuery(tableName, columns) {
	return format(
		"INSERT INTO %I (%s) VALUES (%s) RETURNING *;",
		tableName,
		columns.map((column) => format.ident(column)).join(", "),
		columns.map((_, index) => `$${index + 1}`).join(", "),
	);
}

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates Tagged template}
 * to turn a mutliline query in backticks into a single line.
 * @example
 * const myQuery = singleLine`
 *     SELECT *
 *     FROM some_table
 *     WHERE some_field = $1;
 * `;
 * @param {string[]} strings
 * @param {string[]} replacements
 * @returns {string}
 */
export function singleLine(strings, ...replacements) {
	return strings
		.flatMap((string, index) => [string, replacements[index]])
		.join(" ")
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line !== "")
		.join(" ");
}
/**
 * Create an update query for the given table name and columns.
 * @param {string} tableName
 * @param {string[]} columns
 * @returns {string}
 */
export function updateQuery(tableName, columns) {
	return format(
		"UPDATE %I SET %s WHERE id = $1 RETURNING *;",
		tableName,
		columns
			.map((column, index) => `${format.ident(column)} = $${index + 2}`)
			.join(", "),
	);
}
