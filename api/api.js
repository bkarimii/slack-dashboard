import { Router } from "express";

import { userFinderFunction } from "./DummyData/userFinderFunction.js";
import messageRouter from "./messages/messageRouter.js";

const api = Router();

api.use("/message", messageRouter);

api.post("/user-activity", async (req, res) => {
	const { userId } = req.body;

	try {
		const foundUser = userFinderFunction(userId);
		if (foundUser.success) {
			res.status(200).json(foundUser);
		} else {
			res.status(404).json({ message: "user not found" });
		}
	} catch (error) {
		res.status(500).json({ err: error });
	}
});

export default api;
