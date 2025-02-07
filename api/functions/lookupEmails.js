import config from "../utils/config.cjs";

async function lookupEmail(email) {
	try {
		const response = await config.web.users.lookupByEmail({ email });
		return response;
	} catch (error) {
		return { ok: false, message: "error happened" };
	}
}

export { lookupEmail };
