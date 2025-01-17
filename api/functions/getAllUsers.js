export async function getAllUsers(web) {
	const allUsersArray = [];
	try {
		// Fetch the list of users
		const response = await web.users.list();
		if (response.ok) {
			const allUsers = response.members;

			allUsers.forEach((eachUser) => {
				allUsersArray.push({
					userId: eachUser.id,
					title: eachUser.profile.title,
					name: eachUser.name,
					realName: eachUser.real_name,
					realNameNormalised: eachUser.profile.real_name_normalized,
					displayNameNormalised: eachUser.profile.display_name_normalized,
					firstname: eachUser.profile.first_name,
					lastname: eachUser.profile.last_name,
					isAdmin: eachUser.is_admin,
					isOwner: eachUser.is_owner,
					isBot: eachUser.is_bot,
					isAppUser: eachUser.is_app_user,
				});
			});

			return allUsersArray;
		} else {
			throw new Error(`Failed to fetch users: ${response.error}`);
		}
	} catch (error) {
		return [];
	}
}
