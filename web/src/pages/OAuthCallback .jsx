import { useEffect, useState } from "react";

// OAuthCallback component handles the callback URL after user authorization
export default function OAuthCallback() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	// Fetch the code parameter from the URL and exchange it for an access token
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code) {
			exchangeCodeForToken(code);
		} else {
			setErrorMessage("Authorization code missing.");
			setLoading(false);
		}
	}, []);

	// Exchange the authorization code for an access token
	const exchangeCodeForToken = async (code) => {
		console.log(code);
		try {
			const response = await fetch(`/api/auth-callback?code=${code}`);
			const data = await response.json();

			if (data.access_token) {
				// Save the token in localStorage or sessionStorage
				localStorage.setItem("accessToken", data.access_token);
				window.location.href = "/"; // Redirect to homepage or desired route
			} else {
				setErrorMessage("GitHub authentication failed.");
			}
		} catch (error) {
			setErrorMessage("Error exchanging code for token. Please try again.");
		}
		setLoading(false);
	};

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<p>{errorMessage || "Authentication complete!"}</p>
			)}
		</div>
	);
}
