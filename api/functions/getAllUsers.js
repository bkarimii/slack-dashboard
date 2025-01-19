import { callWithRetry } from "../utils/throttling.js";

export async function getAllUsers(web) {
	const allUsers = [];
	try {
		// Fetch the list of users with retry logic
		const response = await callWithRetry(web.users.list.bind(web), {});

		if (response.ok) {
			const users = response.members;

			users.forEach((eachUser) => {
				allUsers.push({
					userId: eachUser.id,
					title: eachUser.profile.title,
					name: eachUser.name,
					realName: eachUser.real_name,
					realNameNormalised: eachUser.profile.real_name_normalized,
					displayName: eachUser.display_name,
					displayNameNormalised: eachUser.profile.display_name_normalized,
					firstname: eachUser.profile.first_name,
					lastname: eachUser.profile.last_name,
					isAdmin: eachUser.is_admin,
					isOwner: eachUser.is_owner,
					isBot: eachUser.is_bot,
					isAppUser: eachUser.is_app_user,
				});
			});

			return allUsers;
		} else {
			throw new Error({ message: response.error });
		}
	} catch (error) {
		return { message: error };
	}
}
