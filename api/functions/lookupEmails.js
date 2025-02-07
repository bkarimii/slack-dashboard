import config from "../utils/config.cjs";
import { callWithRetry } from "../utils/throttling.js";

async function lookupEmail(email) {
	try {
		// Use callWithRetry to handle rate limits
		const response = await callWithRetry(config.web.users.lookupByEmail, {
			email,
		});

		// Check if response is valid
		if (!response || !response.ok) {
			const errorType = response?.error || "unknown_error";

			// List of important error provided by slack
			const fatalErrors = ["fatal_error", "internal_error"];
			const requestErrors = ["request_timeout"];
			const serviceErrors = ["service_unavailable"];

			if (fatalErrors.includes(errorType)) {
				return {
					ok: false,
					error: "A critical server error occurred.try again later.",
				};
			} else if (requestErrors.includes(errorType)) {
				return {
					ok: false,
					error:
						"The request was missing or incomplete. check your input and try again.",
				};
			} else if (serviceErrors.includes(errorType)) {
				return {
					ok: false,
					error:
						"The service is temporarily unavailable. Please try again later.",
				};
			} else if (errorType === "users_not_found") {
				return { ok: false, error: "User not found." };
			} else {
				return { ok: false, error: `An unknown error occurred: ${errorType}` };
			}
		}

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
