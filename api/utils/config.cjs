/* eslint-disable no-restricted-syntax */
const { join, resolve } = require("node:path");

const { WebClient } = require("@slack/web-api");
const { configDotenv } = require("dotenv");
require("dotenv-expand/config");

const dotenvPath = resolve(
	join(__dirname, "..", "..", process.env.DOTENV_CONFIG_PATH ?? ".env"),
);

configDotenv({ path: dotenvPath });

requireArgs([
	"DATABASE_URL",
	"SLACK_TOKEN",
	"OAUTH_CLIENT_ID",
	"OAUTH_CLIENT_SECRET",
	"SESSION_SECRET",
	"SUDO_TOKEN",
]);

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
	port: parseInt(process.env.PORT ?? "3100", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	web,
	sessionSecret: process.env.SESSION_SECRET.split(","),
	sessionStore: process.env.SESSION_STORE ?? "postgres",
	sudoToken: process.env.SUDO_TOKEN,
	oauth: {
		authorizationURL: oauthUrl("OAUTH_AUTHORIZE_ENDPOINT", "/authorize"),
		clientID: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_CALLBACK_URL,
		tokenURL: oauthUrl("OAUTH_ACCESS_TOKEN_ENDPOINT", "/access_token"),
		userAgent: "CodeYourFuture/tech-products-demo",
		userEmailURL: apiUrl("GH_API_BASE_URL", "/user/emails"),
		userProfileURL: apiUrl("GH_API_BASE_URL", "/user"),
	},
	CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};

function requireArgs(required) {
	const missing = required.filter((envVar) => !process.env[envVar]);
	if (missing.length > 0) {
		const message = `Missing required env var${
			missing.length > 1 ? "s" : ""
		}: ${missing.join(", ")}`;
		throw new Error(message);
	}
}

function apiUrl(envVar, endpoint) {
	return process.env[envVar] && `${process.env[envVar]}${endpoint}`;
}

function oauthUrl(envVar, endpoint) {
	if (process.env[envVar]) {
		return process.env[envVar];
	}
	return (
		process.env.OAUTH_BASE_URL && `${process.env.OAUTH_BASE_URL}${endpoint}`
	);
}
