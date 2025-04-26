/* eslint-disable no-restricted-syntax */
const { join, resolve } = require("node:path");

const { WebClient } = require("@slack/web-api");
const { configDotenv } = require("dotenv");

const dotenvPath = resolve(
	join(__dirname, "..", "..", process.env.DOTENV_CONFIG_PATH ?? ".env"),
);

configDotenv({ path: dotenvPath });

requireArgs(["DATABASE_URL", "SLACK_TOKEN"]);

const databaseUrl = new URL(process.env.DATABASE_URL);
const slackToken = process.env.SLACK_TOKEN;
const web = new WebClient(slackToken);

const localDb = [
	"0.0.0.0",
	"127.0.0.1",
	"localhost",
	"host.docker.internal",
].includes(databaseUrl.hostname);
const sslMode = ["prefer", "require", "verify-ca", "verify-full"].includes(
	databaseUrl.searchParams.get("sslmode") ?? process.env.PGSSLMODE,
);

/**
 * @property {import("pg").ClientConfig} dbConfig
 * @property {string} dotenvPath
 * @property {string} logLevel
 * @property {number} port
 * @property {boolean} production
 */
module.exports = {
	dbConfig: {
		connectionString: databaseUrl.toString(),
		connectionTimeoutMillis: 5_000,
		ssl: localDb ? false : { rejectUnauthorized: sslMode },
	},
	dotenvPath,
	logLevel: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
	port: parseInt(process.env.PORT ?? "3000", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	web,
};

function requireArgs(required) {
	const missing = required.filter((variable) => !process.env[variable]);
	if (missing.length > 0) {
		process.exitCode = 1;
		throw new Error(
			`missing required environment variable(s): ${missing.join(", ")}`,
		);
	}
}

module.exports.CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
module.exports.CLIENT_ID = process.env.GITHUB_CLIENT_ID;
