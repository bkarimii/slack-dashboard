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
					title: eachUser.profile.title ?? undefined,
					name: eachUser.name ?? undefined,
					realName: eachUser.real_name ?? undefined,
					realNameNormalised:
						eachUser.profile.real_name_normalized ?? undefined,
					displayName: eachUser.display_name ?? undefined,
					displayNameNormalised:
						eachUser.profile.display_name_normalized ?? undefined,
					firstname: eachUser.profile.first_name ?? undefined,
					lastname: eachUser.profile.last_name ?? undefined,
					isAdmin: eachUser.is_admin ?? undefined,
					isOwner: eachUser.is_owner ?? undefined,
					isBot: eachUser.is_bot ?? undefined,
					isAppUser: eachUser.is_app_user ?? undefined,
					image_72: eachUser.profile.image_72 ?? undefined,
					image_192: eachUser.profile.image_192 ?? undefined,
				});
			});

			return allUsers;
		} else {
			return { message: response.error };
		}
	} catch (error) {
		return { message: error };
	}
}
