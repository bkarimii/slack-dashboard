// import { dirname, join } from "node:path";
// import { fileURLToPath } from "node:url";

// import express, { Router } from "express";
// import helmet from "helmet";
// import morgan from "morgan";

// import logger from "./logger.js";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// export const asyncHandler = (handler) => {
// 	/** @type {import("express").RequestHandler} */
// 	return async (req, res, next) => {
// 		try {
// 			await handler(req, res, next);
// 		} catch (err) {
// 			next(err);
// 		}
// 	};
// };

// export const authenticateWithGitHub = async (req, res, next) => {
// 	const token = req.headers.authorization?.split(" ")[1]; // Bearer token

// 	if (!token) {
// 		return res.status(401).json({ error: "Unauthorized: No token provided" });
// 	}

// 	try {
// 		const userResponse = await fetch("https://api.github.com/user", {
// 			method: "GET",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		});
// 		const userData = await userResponse.json();

// 		if (userResponse.status !== 200) {
// 			return res.status(401).json({ error: "Unauthorized: Invalid token" });
// 		}

// 		// Attach user data to the request for later use
// 		req.user = userData;
// 		next();
// 	} catch (error) {
// 		return res
// 			.status(500)
// 			.json({ error: "Server error during GitHub authentication" });
// 	}
// };

// export const clientRouter = (apiRoot) => {
// 	const staticDir = join(__dirname, "..", "static");
// 	const router = Router();
// 	router.use(express.static(staticDir));
// 	router.use((req, res, next) => {
// 		if (req.method === "GET" && !req.url.startsWith(apiRoot)) {
// 			return res.sendFile(join(staticDir, "index.html"));
// 		}
// 		next();
// 	});
// 	return router;
// };

// export const configuredHelmet = () => helmet({ contentSecurityPolicy: false });

// export const configuredMorgan = () =>
// 	morgan("dev", {
// 		stream: { write: (message) => logger.info(message.trim()) },
// 	});

// export const httpsOnly = () => (req, res, next) => {
// 	if (!req.secure) {
// 		return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
// 	}
// 	next();
// };

// /** @type {() => import("express").ErrorRequestHandler} */
// export const logErrors = () => (err, _, res, next) => {
// 	if (res.headersSent) {
// 		return next(err);
// 	}
// 	logger.error("%O", err);
// 	res.sendStatus(500);
// };
