import { userFinderFromList } from "./userFinderFromList.js";

describe("userFinderFromList", () => {
	const mockUsers = [
		{
			userId: "USLACKBOT",
			title: "",
			name: "slackbot",
			realName: "Slackbot",
			realNameNormalised: "Slackbot",
			displayName: undefined,
			displayNameNormalised: "Slackbot",
			firstname: "slackbot",
			lastname: "",
			isAdmin: false,
			isOwner: false,
			isBot: false,
			isAppUser: false,
			image_72: "https://a.slack-edge.com/80588/img/slackbot_72.png",
			image_192:
				"https://a.slack-edge.com/80588/marketing/img/avatars/slackbot/avatar-slackbot.png",
		},
		{
			userId: "U04NG9G5SD7",
			title: "",
			name: "behrouzkarimi1993",
			realName: "Behrouz Karimi",
			realNameNormalised: "Behrouz Karimi",
			displayName: undefined,
			displayNameNormalised: "Karimi",
			firstname: "Behrouz",
			lastname: "Karimi",
			isAdmin: true,
			isOwner: true,
			isBot: false,
			isAppUser: false,
			image_72:
				"https://secure.gravatar.com/avatar/ce3344fe05fdbcd891b38878b1a7c5d4.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-72.png",
			image_192:
				"https://secure.gravatar.com/avatar/ce3344fe05fdbcd891b38878b1a7c5d4.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-192.png",
		},
	];

	it("should return success and the correct user when the user is found", () => {
		const result = userFinderFromList("U04NG9G5SD7", mockUsers);
		expect(result).toEqual({
			success: true,
			user: {
				userId: "U04NG9G5SD7",
				title: "",
				name: "behrouzkarimi1993",
				realName: "Behrouz Karimi",
				realNameNormalised: "Behrouz Karimi",
				displayName: undefined,
				displayNameNormalised: "Karimi",
				firstname: "Behrouz",
				lastname: "Karimi",
				isAdmin: true,
				isOwner: true,
				isBot: false,
				isAppUser: false,
				image_72:
					"https://secure.gravatar.com/avatar/ce3344fe05fdbcd891b38878b1a7c5d4.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-72.png",
				image_192:
					"https://secure.gravatar.com/avatar/ce3344fe05fdbcd891b38878b1a7c5d4.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-192.png",
			},
		});
	});

	it("should return failure when the user is not found", () => {
		const result = userFinderFromList("NON_EXISTENT", mockUsers);
		expect(result).toEqual({
			success: false,
			user: "user not found",
		});
	});
});
