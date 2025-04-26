import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../components/AuthContext";

function AuthCallback() {
	const { setUserData } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		const authenticateUser = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");

			if (code) {
				try {
					const response = await fetch(`/api/getAccessToken`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ code }),
					});

					const data = await response.json();

					if (data.access_token) {
						localStorage.setItem("accessToken", data.access_token);

						const userDataResponse = await fetch(`/api/getUserData`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ access_token: data.access_token }),
						});

						const userData = await userDataResponse.json();

						if (userData.user) {
							setUserData(userData.user);
							navigate("/dashboard");
						} else {
							navigate("/login");
						}
					} else {
						navigate("/login");
					}
				} catch (error) {
					console.error(
						"Error during authentication or fetching user data",
						error,
					);
					navigate("/login");
				}
			} else {
				navigate("/login");
			}
		};

		authenticateUser();
	}, [setUserData, navigate]);

	return (
		<div>
			<p>Authenticating...</p>
		</div>
	);
}

export default AuthCallback;
