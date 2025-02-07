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

		res.status(200).json({ sucess: true });
	} catch (error) {
		res.status(500).json({ message: "internal server error" });
	}
});

export default api;
