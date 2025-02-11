import { Router } from "express";

import { lookupEmail } from "./functions/lookupEmail.js";
import { lookupEmail } from "./functions/lookupEmail.js";
import messageRouter from "./messages/messageRouter.js";

const api = Router();

api.use("/message", messageRouter);

api.post("/subscribe", async (req, res) => {
	const email = req.body.email;

	try {
		if (!email) {
			res.status(400).json({ sucess: false, message: "bad request" });
		}

		const user = await lookupEmail(email);

		if (user.ok) {
			// @todo Insert users data into DB here...
			// @todo Insert users data into DB here...

			res.redirect("/subscribe/confirmation");
		}
		if (user.error === "An API error occurred: users_not_found") {
			return res.redirect("/subscribe/error?status=not-found");
		} else if (user.error === "An API error occurred: unauthorised") {
			return res.redirect("/subscribe/error?status=unauthorised");
		} else {
			return res.redirect("/subscribe/error?status=something-went-wrong");
		}
	} catch (error) {
		return res.redirect("/subscribe/error?status=internal-error");
	}
});

export default api;
