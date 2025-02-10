import config from "../utils/config.cjs";

async function lookupEmail(email) {
	try {
		// @todo Use callWithRetry to handle rate limits
		const response = await config.web.users.lookupByEmail({ email });

		// Extract and format user data
		const user = response.user;
		if (!user) {
			return { ok: false, error: "User not found in response." };
		}

		const formattedUser = {
			userId: user.id,
			title: user.profile?.title ?? undefined,
			name: user.name ?? undefined,
			realName: user.real_name ?? undefined,
			realNameNormalised: user.profile?.real_name_normalized ?? undefined,
			displayName: user.display_name ?? undefined,
			displayNameNormalised: user.profile?.display_name_normalized ?? undefined,
			firstname: user.profile?.first_name ?? undefined,
			lastname: user.profile?.last_name ?? undefined,
			isAdmin: user.is_admin ?? undefined,
			isOwner: user.is_owner ?? undefined,
			isBot: user.is_bot ?? undefined,
			isAppUser: user.is_app_user ?? undefined,
			image_72: user.profile?.image_72 ?? undefined,
			image_192: user.profile?.image_192 ?? undefined,
		};

		return { ok: true, user: formattedUser };
	} catch (error) {
		return { ok: false, error: error.message || "Unexpected error occurred." };
	}
}

export { lookupEmail };
