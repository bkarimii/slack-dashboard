import * as repository from "./messageRepository.js";

export async function getMessage() {
	const [first] = await repository.getAll();
	if (!first) {
		throw new Error("No message found in the database.");
	}
	return first.content;
}
