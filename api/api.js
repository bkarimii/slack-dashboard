import { Router } from "express";

import messageRouter from "./messages/messageRouter.js";

const api = Router();

api.use("/message", messageRouter);

api.post("/subscribe", async (req, res) => {
	const email = req.body.email;
	try {
		if (!email) {
			res.status(400).json({ sucess: false, message: "bad request" });
		}

		// const user = await lookupEmail(email);
		const user = null;

		if (user.ok) {
			// @todo Insert users data into DB here...

			res.redirect("/subscribe/confirmation");
		} else {
			// Redirect to error page with appropriate error status
			switch (user.error) {
				case "users not found":
					return res.redirect("/subscribe/error?status=not-found");
				case "A critical server error occurred.try again later.":
					return res.redirect("/subscribe/error?status=server-error");
				case "The request was missing or incomplete. check your input and try again.":
					return res.redirect("/subscribe/error?status=bad-request");
				case "The service is temporarily unavailable. Please try again later.":
					return res.redirect("/subscribe/error?status=service-unavailable");
				default:
					return res.redirect(`/subscribe/error?status=unknown-error&message`);
			}
		}
	} catch (error) {
		return res.redirect("/subscribe/error?status=server-error");
	}
});

export default api;
