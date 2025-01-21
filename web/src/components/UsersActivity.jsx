import { useState } from "react";

export default function UsersActivity() {
	const [inputBoxValue, setInputBoxvalue] = useState("");
	const [userActivity, setUserActivity] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (e) => {
		setInputBoxvalue(e.target.value);
	};
	const url = "api/user-activity";

	const fetchUsersInfo = async (userId) => {
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
					console.log(userActivity, "<-----user");
				} else {
					setErrorMessage("User not found!");
				}
			}
		} catch (error) {
			setErrorMessage("something went wrong!");
		}
	};

	const handleSubmit = (e) => {
		fetchUsersInfo(inputBoxValue);
		e.preventDefault();
	};

	return (
		<>
			<form>
				<input
					type="text"
					value={inputBoxValue}
					onChange={handleInputChange}
					placeholder="Enter users ID"
				/>
				<button onClick={handleSubmit}>Submit</button>
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
