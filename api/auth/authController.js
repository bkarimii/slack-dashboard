import { Router } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import { authOnly, methodNotAllowed } from "../utils/authMiddleware.js";
import config from "../utils/config.cjs";

import * as service from "./authService.js";

const router = Router();

passport.use(
	"github",
	new GitHubStrategy(
		{
			...config.oauth,
			// callbackURL: "http://localhost:3100/api/auth/callback"
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await service.logIn({
					email: profile.emails?.[0]?.value,
					gitHubId: profile.id,
					name: profile.displayName ?? profile.username,
				});
				done(null, user);
			} catch (err) {
				done(err);
			}
		},
	),
);

passport.deserializeUser(async (user, done) => {
	try {
		done(null, await service.deserialize(user));
	} catch (err) {
		done(err);
	}
});

passport.serializeUser((user, done) => done(null, user.id));

router
	.route("/callback")
	.get(
		passport.authenticate("github", {
			successRedirect: "/",
			failureRedirect: "/",
		}),
	)
	.all(methodNotAllowed);

router
	.route("/login")
	.get((req, res, next) => {
		passport.authenticate("github")(req, res, next);
	})
	.all(methodNotAllowed);

router
	.route("/logout")
	.post((req, res, next) => {
		req.logout((err) => {
			if (err) {
				return next(err);
			}
			res.redirect("/");
		});
	})
	.all(methodNotAllowed);

router
	.route("/principal")
	.get(authOnly, (req, res) => res.json(req.user))
	.all(methodNotAllowed);

export default router;
