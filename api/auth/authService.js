import * as usersService from "../users/usersService.js";

export async function deserialize(id) {
	return await usersService.getById(id);
}

export async function logIn(profile) {
	const existing = await usersService.findByGitHubId(profile.gitHubId);
	if (existing) {
		return existing;
	}
	return await usersService.create(profile);
}
