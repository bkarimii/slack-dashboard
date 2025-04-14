import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";

import apiRouter from "./api.js";
import { getSessionStore } from "./authDb.js";
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
const sessionConfig = {
	cookie: {},
	resave: false,
	saveUninitialized: true,
	secret: config.sessionSecret,
	store: getSessionStore(),
};

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(configuredHelmet());
app.use(configuredMorgan());

if (config.production) {
	app.enable("trust proxy");
	sessionConfig.cookie.secure = true;
	app.use(httpsOnly());
}

app.use(session(sessionConfig));
app.use(passport.authenticate("session"));

app.get(
	"/healthz",
	asyncHandler(async (_, res) => {
		await db.query("SELECT 1;");
		res.sendStatus(200);
	}),
);

app.use(bodyParser.json());
app.use(apiRoot, apiRouter);

app.use(clientRouter(apiRoot));

app.use(logErrors());

export default app;
