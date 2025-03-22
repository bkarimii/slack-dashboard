import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code) {
			fetch(`http://localhost:3000/getAccessToken?code=${code}`)
				.then((response) => {
					// Log the raw response
					console.log("Response:", response);
					return response.json();
				})
				.then((data) => {
					try {
						const jsonData = JSON.parse(data); // Attempt to parse as JSON
						if (jsonData.access_token) {
							localStorage.setItem("accessToken", jsonData.access_token);
							navigate("/"); // Redirect to a protected page
						} else {
							navigate("/login"); // Redirect to login on error
						}
					} catch (error) {
						console.error("Error parsing response:", error);
						navigate("/login"); // Handle the error case
					}
				})
				.catch((error) => {
					console.error("Error during authentication", error);
					navigate("/login"); // Handle the error case
				});
		} else {
			navigate("/login"); // Handle missing code
		}
	}, [navigate]);

	return (
		<div>
			<p>Authenticating...</p>
		</div>
	);
}

export default AuthCallback;
