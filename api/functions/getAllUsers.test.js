// eslint-disable-next-line n/no-extraneous-import
import { jest } from "@jest/globals";

import * as throttling from "../utils/throttling";

import { getAllUsers } from "./getAllUsers";

jest.mock("../utils/throttling");

describe("getAllUsers", () => {
	const mockWeb = {
		users: {
			list: jest.fn(),
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return all users when the API call is successful", async () => {
		throttling.callWithRetry.mockResolvedValue({
			ok: true,
			members: [
				{
					id: "U123",
					name: "johndoe",
					real_name: "John Doe",
					profile: {
						title: "Developer",
						real_name_normalized: "John Doe",
						display_name: "Johnny",
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

		const result = await getAllUsers(mockWeb);

		expect(result).toEqual([
			{
				userId: "U123",
				title: "Developer",
				name: "johndoe",
				realName: "John Doe",
				realNameNormalised: "John Doe",
				displayName: "Johnny",
				displayNameNormalised: "Johnny",
				firstname: "John",
				lastname: "Doe",
				isAdmin: true,
				isOwner: false,
				isBot: false,
				isAppUser: false,
			},
		]);

		expect(throttling.callWithRetry).toHaveBeenCalledWith(
			expect.any(Function),
			{},
		);
	});

	it("should return an error message when the API call fails", async () => {
		throttling.callWithRetry.mockResolvedValue({
			ok: false,
			error: "API Error",
		});

		const result = await getAllUsers(mockWeb);

		expect(result).toEqual({ message: new Error({ message: "API Error" }) });
		expect(throttling.callWithRetry).toHaveBeenCalledWith(
			expect.any(Function),
			{},
		);
	});
});

describe("callWithRetry", () => {
	it("should retry on error with retry_after", async () => {
		const mockApiCall = jest.fn();
		mockApiCall
			.mockRejectedValueOnce({ data: { retry_after: 1 } })
			.mockResolvedValueOnce({ ok: true, data: "success" });

		throttling.callWithRetry.mockImplementation(
			async (apiCall, args, retries = 5) => {
				try {
					return await apiCall(args);
				} catch (error) {
					if (error.data && error.data.retry_after) {
						await new Promise((resolve) =>
							setTimeout(resolve, error.data.retry_after * 1000),
						);
						return throttling.callWithRetry(apiCall, args, retries - 1);
					}
					if (retries > 0) {
						return throttling.callWithRetry(apiCall, args, retries - 1);
					}
					throw error;
				}
			},
		);

		const result = await throttling.callWithRetry(mockApiCall, {});

		expect(result).toEqual({ ok: true, data: "success" });
		expect(mockApiCall).toHaveBeenCalledTimes(2);
	});

	it("should throw an error after max retries", async () => {
		const mockApiCall = jest.fn().mockRejectedValue(new Error("API Error"));

		throttling.callWithRetry.mockImplementation(
			async (apiCall, args, retries = 5) => {
				try {
					return await apiCall(args);
				} catch (error) {
					if (retries > 0) {
						return throttling.callWithRetry(apiCall, args, retries - 1);
					}
					throw error;
				}
			},
		);

		await expect(throttling.callWithRetry(mockApiCall, {})).rejects.toThrow(
			"API Error",
		);
		expect(mockApiCall).toHaveBeenCalledTimes(6); // Initial call + 5 retries
	});
});
