// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";

import { callWithRetry } from "../utils/throttling";

import { getAllUsers } from "./getAllUsers.js";

jest.mock("../utils/throttling");

describe("getAllUsers", () => {
	let web;

	beforeEach(() => {
		web = {
			users: {
				list: jest.fn(),
			},
		};
	});

	it("should return all users when the API call is successful", async () => {
		// Mock the callWithRetry to return a successful response
		callWithRetry.mockResolvedValue({
			ok: true,
			members: [
				{
					id: "U01",
					name: "john",
					real_name: "John Doe",
					profile: {
						title: "Engineer",
						real_name_normalized: "John Doe",
						display_name: "johnny",
						display_name_normalized: "Johnny",
						first_name: "John",
						last_name: "Doe",
					},
					is_admin: true,
					is_owner: false,
					is_bot: false,
					is_app_user: false,
				},
			],
		});

		const result = await getAllUsers(web);

		expect(result).toEqual([
			{
				userId: "U01",
				title: "Engineer",
				name: "john",
				realName: "John Doe",
				realNameNormalised: "John Doe",
				displayName: "johnny",
				displayNameNormalised: "Johnny",
				firstname: "John",
				lastname: "Doe",
				isAdmin: true,
				isOwner: false,
				isBot: false,
				isAppUser: false,
			},
		]);
		expect(callWithRetry).toHaveBeenCalledWith(web.users.list.bind(web), {});
	});

	it("should throw an error with a message when the API call fails", async () => {
		callWithRetry.mockResolvedValue({
			ok: false,
			error: "auth error",
		});

		await expect(getAllUsers(web)).rejects.toThrow(
			new Error({ message: "auth error" }),
		);

		expect(callWithRetry).toHaveBeenCalledWith(web.users.list.bind(web), {});
	});
});
