// This function searches for users in a static list of users
import { USERS } from "../../constants/USERS.js";

export function userFinderFromList(userId) {
	const foundUser = USERS.find((user) => user.userId === userId);
	if (foundUser) {
		return { success: true, user: foundUser };
	} else {
		return { success: false, user: "user not found" };
	}
}

// Added to the branch
