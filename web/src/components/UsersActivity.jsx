import { useState } from "react";

import { FRONT_END_RESPONSE } from "./../../../constants/FRONT_END_RESPONSE.js";
import "./UserActivity.css";

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
			const offline = true;
			if (offline) {
				setUserActivity(FRONT_END_RESPONSE);
				console.log(userActivity, "user activity ------");
			} else {
				fetchUsersInfo(trimmedValue);
			}
		} else {
			setErrorMessage("Empty user IDs are not allowed!");
			setUserActivity(null);
		}
	};

	return (
		<>
			<form className="user-form" onSubmit={handleSubmit}>
				<input
					className="user-input"
					type="text"
					value={inputBoxValue}
					onChange={handleInputChange}
					placeholder="Enter users ID"
					disabled={loading}
				/>
				<button className="user-button" type="submit" disabled={loading}>
					{loading ? "Loading..." : "Submit"}
				</button>
			</form>
			{userActivity && (
				<div className="user-activity-container">
					<h3 className="user-activity-title">User Activity Details</h3>
					<p>
						<strong>User ID:</strong> {userActivity.data[0].userId}
					</p>
					<p>
						<strong>Name:</strong> {userActivity.data[0].name}
					</p>
					<p>
						<strong>Real Name:</strong> {userActivity.data[0].realName}
					</p>
					<p>
						<strong>Number of Threads:</strong>{" "}
						{userActivity.data[0].numOfThreads}
					</p>
					<p>
						<strong>Number of Replies:</strong>{" "}
						{userActivity.data[0].numOfReplies}
					</p>
					<p>
						<strong>Number of Reactions:</strong>{" "}
						{userActivity.data[0].numOfReactions}
					</p>
					<p>
						<strong>Total Activity:</strong>{" "}
						{userActivity.data[0].totalActivity}
					</p>
				</div>
			)}
			{errorMessage && (
				<div className="error-message">
					<p>{errorMessage}</p>
				</div>
			)}
		</>
	);
}
