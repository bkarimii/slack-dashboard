import express from "express";

import apiRouter from "./api.js";
import db from "./db.js";
import config from "./utils/config.cjs";
import {
	asyncHandler,
	clientRouter,
	configuredHelmet,
	configuredMorgan,
	httpsOnly,
	logErrors,
} from "./utils/middleware.js";

const apiRoot = "/api";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(configuredHelmet());
app.use(configuredMorgan());

if (config.production) {
	app.enable("trust proxy");
	app.use(httpsOnly());
}

app.get(
	"/healthz",
	asyncHandler(async (_, res) => {
		await db.query("SELECT 1;");
		res.sendStatus(200);
	}),
);

app.use(apiRoot, apiRouter);

app.use(clientRouter(apiRoot));

app.use(logErrors());

export default app;
