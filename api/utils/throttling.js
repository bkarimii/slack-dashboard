/* eslint-disable no-console */
// utils/throttling.js
export async function callWithRetry(apiCall, args, retries = 5) {
	try {
		return await apiCall(args);
	} catch (error) {
		if (error.data && error.data.retry_after) {
			const retryAfter = error.data.retry_after * 1000; // Convert seconds to ms
			console.log(`Rate limited. Retrying after ${retryAfter}ms...`);
			await new Promise((resolve) => setTimeout(resolve, retryAfter));
			return callWithRetry(apiCall, args, retries - 1);
		}
		if (retries > 0) {
			console.log(`Retrying... ${retries} attempts left.`);
			return callWithRetry(apiCall, args, retries - 1);
		}
		throw error;
	}
}
