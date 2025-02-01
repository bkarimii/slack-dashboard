import { useState } from "react";

function SubscribtionForm() {
	const [subscribedUserEmail, setSubscribedUserEmail] = useState("");
	const [successfulFetch, setSuccessfulFetch] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const url = "api/subscribtion";
	const fetchUsersSubscribtion = async () => {
		try {
			const postedEmail = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscribedUserEmail),
			});
			if (postedEmail.ok) {
				setSuccessfulFetch(true);
			} else {
				const responseData = await postedEmail.json();
				setErrorMessage(responseData);
				setSuccessfulFetch(false);
			}
		} catch (error) {
			setErrorMessage(error.message);
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
				></input>
				<button type="submit">Subscribe</button>
			</form>
			<div>
				{successfulFetch ? (
					<p>Subscribed Successfully!</p>
				) : (
					<p>{errorMessage}</p>
				)}
			</div>
		</>
	);
}

export { SubscribtionForm };
