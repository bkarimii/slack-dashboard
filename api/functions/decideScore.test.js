import { decideScore } from "./decideScore.js";

describe("decideScore", () => {
	it("should return 0 when non-numeric arguments are passed to the function", () => {
		const score = decideScore({ messages: "3", reactions: "4" });
		expect(score).toBe(0);
	});

	it("should return 50 when there are 3 message and 4 reactions", () => {
		const score = decideScore({ messages: 3, reactions: 4 });
		expect(score).toBe(13);
	});

	it("should return 100 when there are 22 messages and 3 reactions", () => {
		const score = decideScore({ messages: 22, reactions: 3 });
		expect(score).toBe(69);
	});

	it("should handle when there are no messages", () => {
		const score = decideScore({ messages: 0, reactions: 3 });
		expect(score).toBe(3);
	});

	it("should handle when there are no reactions", () => {
		const score = decideScore({ messages: 22, reactions: 0 });
		expect(score).toBe(66);
	});

	it("should handle when there are no messages and no reactions", () => {
		const score = decideScore({ messages: 0, reactions: 0 });
		expect(score).toBe(0);
	});

	it("should handle when messages and reactions are negative", () => {
		const score = decideScore({ messages: -1, reactions: -1 });
		expect(score).toBe(0);
	});

	it("should handle when messages and reactions are null or undefined", () => {
		const score = decideScore({ messages: null, reactions: undefined });
		expect(score).toBe(0);
	});

	it("should handle when only messages are provided", () => {
		const score = decideScore({ reactions: 4 });
		expect(score).toBe(4);
	});

	it("should handle if reactions are not provided", () => {
		const score = decideScore({ messages: 3 });
		expect(score).toBe(9);
	});
});
