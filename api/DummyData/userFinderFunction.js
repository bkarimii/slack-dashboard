import { USERS } from "../../constants/USERS.js";

export function userFinderFunction(id) {
	const foundUser = USERS.find((user) => user.userId === id);

	if (foundUser) {
		return { success: true, user: foundUser };
	} else {
		return { success: false, error: "user not found" };
	}
}
