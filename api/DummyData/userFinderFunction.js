import { getAllUsersReturn } from "./getAllUsersFuncReturn.js";

export function userFinderFunction(id) {
	const foundUser = getAllUsersReturn.find((user) => user.userId === id);

	if (foundUser) {
		return { success: true, user: foundUser };
	} else {
		return { success: false, error: "user not found" };
	}
}
