import { updateCounts } from "./updateCounts";

// @todo: Implement the updateCounts function and unskip these tests
// eslint-disable-next-line jest/no-disabled-tests
describe.skip("updateCounts", () => {
	it("initiliases the counts object if it isn't provided", () => {
		const result = updateCounts({ counts: undefined, slackData: [] });
		expect(result).toBe({});
	});

	it("returns the counts object provided if no slack data is provided", () => {
		const result = updateCounts({
			counts: { "01-02-2025": {} },
			slackData: [],
		});
		expect(result).toBe({ "01-02-2025": {} });
	});

	it("updates the counts object with the messages and reactions from the slack data", () => {
		const result = updateCounts({
			counts: { "01-02-2025": {} },
			slackData: [
				{
					ts: "1714000000",
					reactions: [
						{
							name: "astonished",
							count: 1,
							users: ["U1234"],
						},
						{
							name: "facepalm",
							count: 2,
							users: ["U1234", "U5678"],
						},
					],
					user: "U1234",
				},
			],
		});
		expect(result).toBe({
			"01-02-2025": { U1234: { messages: 1, reactions: 1 } },
		});
	});

	it("handles multiple messages from the same user on the same day", () => {
		const result = updateCounts({
			counts: { "01-02-2025": {} },
			slackData: [
				{
					ts: "1714000000",
					reactions: [
						{
							name: "astonished",
							count: 1,
							users: ["U1234"],
						},
						{
							name: "facepalm",
							count: 2,
							users: ["U1234", "U5678"],
						},
					],
					user: "U1234",
				},
				{
					ts: "1714000000",
					reactions: [
						{
							name: "astonished",
							count: 1,
							users: ["U1234"],
						},
						{
							name: "facepalm",
							count: 2,
							users: ["U1234", "U5678"],
						},
					],
					user: "U1234",
				},
			],
		});
		expect(result).toBe({
			"01-02-2025": { U1234: { messages: 2, reactions: 2 } },
		});
	});

	it("handles multiple messages from different users on the same day", () => {
		const result = updateCounts({
			counts: { "01-02-2025": {} },
			slackData: [
				{
					ts: "1714000000",
					reactions: [
						{
							name: "astonished",
							count: 1,
							users: ["U1234"],
						},
						{
							name: "facepalm",
							count: 2,
							users: ["U1234", "U5678"],
						},
					],
					user: "U1234",
				},
				{
					ts: "1714000000",
					reactions: [
						{
							name: "astonished",
							count: 1,
							users: ["U1234"],
						},
						{
							name: "facepalm",
							count: 2,
							users: ["U1234", "U5678"],
						},
					],
					user: "U5678",
				},
			],
		});
		expect(result).toBe({
			"01-02-2025": {
				U1234: { messages: 1, reactions: 1 },
				U5678: { messages: 1, reactions: 1 },
			},
		});
	});

	it("resets the data for a particulr day if an entry already exists for that day", () => {
		const result = updateCounts({
			counts: { "01-02-2025": { U1234: { messages: 5, reactions: 10 } } },
			slackData: [
				{
					ts: "1714000000",
					user: "U1234",
					reactions: [
						{
							name: "astonished",
							count: 1,
							users: ["U1234"],
						},
					],
				},
			],
		});
		expect(result).toBe({
			"01-02-2025": { U1234: { messages: 1, reactions: 1 } },
		});
	});
});
