import { useState } from "react";

function SubscribtionForm() {
	const [subscribedUserEmail, setSubscribedUserEmail] = useState("");
	const [successfulFetch, setSuccessfulFetch] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const url = "/api/user-subscribtion";

	const fetchUsersSubscribtion = async () => {
		try {
			// Clear previous error messages
			setErrorMessage("");
			const postedEmail = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: subscribedUserEmail.trim() }),
			});
			if (postedEmail.ok) {
				setSuccessfulFetch(true);
				setSubscribedUserEmail("");
			} else {
				let responseData;
				try {
					responseData = await postedEmail.json();
				} catch {
					responseData = { message: "Unexpected response format" };
				}
				setErrorMessage(responseData.message || "An error occurred");
				setSuccessfulFetch(false);
			}
		} catch (error) {
			setErrorMessage(error.message);
			setSuccessfulFetch(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchUsersSubscribtion();
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Enter your Email address."
					value={subscribedUserEmail}
					onChange={(e) => setSubscribedUserEmail(e.target.value)}
					required
				/>
				<button type="submit" disabled={successfulFetch}>
					Subscribe
				</button>
			</form>
			<div>
				{successfulFetch ? (
					<p>Subscribed Successfully!</p>
				) : (
					errorMessage && <p>{errorMessage}</p>
				)}
			</div>
		</>
	);
}

export { SubscribtionForm };
