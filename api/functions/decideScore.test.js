import { decideScore } from "./decideScore.js";

describe("decideScore", () => {
	it("should return 0 when non-numeric arguments are passed to the function", () => {
		const score = decideScore({ messages: "3", reactions: "4" });
		expect(score).toBe(0);
	});

	it("should return 13 when there are 3 messages and 4 reactions", () => {
		const score = decideScore({ messages: 3, reactions: 4 });
		expect(score).toBe(13);
	});

	it("should return 69 when there are 22 messages and 3 reactions", () => {
		const score = decideScore({ messages: 22, reactions: 3 });
		expect(score).toBe(69);
	});

	it("should return 45 when there are 10 messages and 10 reactions and reactionsReceived = 5", () => {
		const score = decideScore({
			messages: 10,
			reactions: 10,
			reactionsReceived: 5,
		});
		expect(score).toBe(45);
	});

	it("should handle when there are no messages and reactions", () => {
		const score = decideScore({ messages: 0, reactions: 0 });
		expect(score).toBe(0);
	});

	it("should return score based on reactionsReceived when no messages and no reactions", () => {
		const score = decideScore({
			messages: 0,
			reactions: 0,
			reactionsReceived: Math.floor(Math.random() * 10),
		});
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
		const score = decideScore({ messages: 3 });
		expect(score).toBe(9);
	});

	it("should handle if reactions are not provided", () => {
		const score = decideScore({ messages: 3, reactionsReceived: 5 });
		expect(score).toBe(14);
	});

	it("should handle when only reactions are provided", () => {
		const score = decideScore({ reactions: 3 });
		expect(score).toBe(3);
	});

	it("should handle when reactionsReceived are provided but no messages", () => {
		const score = decideScore({ reactionsReceived: 4 });
		expect(score).toBe(0);
	});

	it("should return the correct weighted score when weighting parameters are customized", () => {
		const score = decideScore({
			messages: 5,
			reactions: 2,
			reactionsReceived: 3,
			messageWeight: 4,
			reactionWeight: 2,
			reactionsReceivedWeight: 1,
		});
		expect(score).toBe(27); // (4*5 + 2*2 + 1*3)
	});

	it("should return the correct weighted score when only reactionWeight is customized", () => {
		const score = decideScore({
			messages: 5,
			reactions: 2,
			reactionsReceived: 3,
			messageWeight: 3, // Only messageWeight customized
		});
		expect(score).toBe(20); // (3*5 + 1*2 + 1*3)
	});

	it("should return the correct weighted score when only reactionsReceivedWeight is customized", () => {
		const score = decideScore({
			messages: 5,
			reactions: 2,
			reactionsReceived: 3,
			reactionWeight: 2, // Only reactionsWeight customized
		});
		expect(score).toBe(22); // (3*5 + 2*2 + 1*3)
	});

	it("should return the correct weighted score when only messages and reactions are provided", () => {
		const score = decideScore({
			messages: 5,
			reactions: 2,
			// Default weights will be used: messageWeight=3, reactionWeight=1, reactionsReceivedWeight=1
		});
		expect(score).toBe(17); // (3*5 + 1*2 + 1*0)
	});

	it("should return the correct weighted score when only messages and reactionsReceived are provided", () => {
		const score = decideScore({
			messages: 5,
			reactionsReceived: 3,
			// Default weights will be used: messageWeight=3, reactionWeight=1, reactionsReceivedWeight=1
		});
		expect(score).toBe(18); // (3*5 + 1*0 + 1*3)
	});

	it("should return the correct weighted score when only reactions and reactionsReceived are provided", () => {
		const score = decideScore({
			reactions: 2,
			reactionsReceived: 3,
			// Default weights will be used: messageWeight=3, reactionWeight=1, reactionsReceivedWeight=1
		});
		expect(score).toBe(2); // ( 1*2) When messages is not provided reactionsReceived is ignored
	});
});
