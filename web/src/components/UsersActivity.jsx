import { useState } from "react";

export default function UsersActivity() {
	const [inputBoxValue, setInputBoxvalue] = useState("");
	const [userActivity, setUserActivity] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		setInputBoxvalue(e.target.value);
	};
	const url = "api/user-activity";

	const fetchUsersInfo = async (userId) => {
		setErrorMessage(null);
		setLoading(true);

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setUserActivity(data.user);
				} else {
					setErrorMessage("Unexpected response format!");
					setUserActivity(null);
				}
			} else if (response.status === 404) {
				setUserActivity(null);
				setErrorMessage("User not found!");
			} else {
				setErrorMessage(`Unexpected error: ${response.status}`);
			}
		} catch (error) {
			setErrorMessage("Something went wrong! Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedValue = inputBoxValue.trim();
		if (trimmedValue.length !== 0) {
			fetchUsersInfo(trimmedValue);
		} else {
			setErrorMessage("Empty user IDs are not allowed!");
			setUserActivity(null);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={inputBoxValue}
					onChange={handleInputChange}
					placeholder="Enter users ID"
					disabled={loading}
				/>
				<button type="submit" disabled={loading}>
					{loading ? "Loading..." : "Submit"}
				</button>
			</form>
			{userActivity && (
				<div>
					<p>userId:{userActivity.userId}</p>
					<p>Name: {userActivity.realName}</p>
				</div>
			)}
			{errorMessage && (
				<div>
					<p>{errorMessage}</p>
				</div>
			)}
		</>
	);
}
