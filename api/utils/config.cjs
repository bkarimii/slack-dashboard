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
	oauth: {
		authorizationURL: oauthUrl("OAUTH_AUTHORIZE_ENDPOINT", "/authorize"),
		clientID: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_CALLBACK_URL,
		tokenURL: oauthUrl("OAUTH_ACCESS_TOKEN_ENDPOINT", "/access_token"),
		userAgent: "bkarimii/slack-dashboard",
		userEmailURL: apiUrl("GH_API_BASE_URL", "/user/emails"),
		userProfileURL: apiUrl("GH_API_BASE_URL", "/user"),
	},
	dbConfig: {
		connectionString: databaseUrl.toString(),
		connectionTimeoutMillis: 5_000,
		ssl: localDb ? false : { rejectUnauthorized: sslMode },
	},
	dotenvPath,
	logLevel: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
	port: parseInt(process.env.PORT ?? "3000", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	sessionSecret: process.env.SESSION_SECRET.split(","),
	sessionStore: process.env.SESSION_STORE ?? "postgres",
	sudoToken: process.env.SUDO_TOKEN,
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

function apiUrl(envVar, endpoint) {
	return process.env[envVar] && `${process.env[envVar]}${endpoint}`;
}

/**
 * Determine URLs for OAuth connections
 * @param {string} envVar - environment variable to use if available
 * @param {string} endpoint - endpoint on OAUTH_BASE_URL otherwise
 * @returns {string}
 */
function oauthUrl(envVar, endpoint) {
	if (process.env[envVar]) {
		return process.env[envVar];
	}
	return (
		process.env.OAUTH_BASE_URL && `${process.env.OAUTH_BASE_URL}${endpoint}`
	);
}
