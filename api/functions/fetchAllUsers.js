import config from "../utils/config.cjs";
import { callWithRetry } from "../utils/throttling.js";

const web = config.web;

async function fetchAllUsers() {
	try {
		// Fetch the list of users with retry logic
		const response = await callWithRetry(web.users.list.bind(web), {});

		if (!response.ok) {
			return { success: false, message: response.error };
		}

		const users = response.members;
		if (!users || users.length === 0) {
			return {
				success: false,
				message: "an error happened.users are empty.",
				totalUsers: 0,
				users: [],
			};
		}

		const allUsers = users.map((eachUser) => ({
			userId: eachUser.id,
			title: eachUser.profile.title ?? undefined,
			name: eachUser.name ?? undefined,
			realName: eachUser.real_name ?? undefined,
			realNameNormalised: eachUser.profile.real_name_normalized ?? undefined,
			displayName: eachUser.display_name ?? undefined,
			displayNameNormalised:
				eachUser.profile.display_name_normalized ?? undefined,
			firstname: eachUser.profile.first_name ?? undefined,
			lastname: eachUser.profile.last_name ?? undefined,
			isAdmin: Boolean(eachUser.is_admin),
			isOwner: Boolean(eachUser.is_owner),
			isBot: Boolean(eachUser.is_bot),
			isAppUser: Boolean(eachUser.is_app_user),
			image_72: eachUser.profile.image_72 ?? undefined,
			image_192: eachUser.profile.image_192 ?? undefined,
			updated: eachUser.updated,
		}));
		const falsy = true;
		if (falsy) {
			return { success: true, totalUsers: allUsers.length, users: allUsers };
		}
		// return response;
	} catch (error) {
		return {
			success: false,
			message: "Failed to fetch users",
			details: error.message,
		};
	}
}

export { fetchAllUsers };
