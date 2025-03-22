import { GithubFilled } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { useEffect, useState } from "react";

import { SubscriptionLogo } from "../components/SubscriptionLogo";
import { ThemedButton } from "../components/ThemedButton";

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export default function Login() {
	const [rerender, setRerender] = useState(false);
	const [userData, setUserData] = useState({});
	async function getAccessToken(codeParam) {
		await fetch("http://localhost:3000/auth-callback?code=" + codeParam, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (data.access_token) {
					localStorage.setItem("accessToken", data.access_token);
					setRerender(!rerender);
				}
			});
	}
	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const codeParam = urlParams.get("code");

		if (codeParam && localStorage.getItem("accessToken") === null) {
			getAccessToken(codeParam);
		} else {
			getUserData();
		}
	});

	// Function to fetch user data
	async function getUserData() {
		if (localStorage.getItem("accessToken")) {
			await fetch("http://localhost:3000/getUserData", {
				method: "GET",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("accessToken"),
				},
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					setUserData(data);
				})
				.catch((error) => {
					console.error("Error fetching user data:", error);
				});
		}
	}

	const handleGitHubLogin = () => {
		window.location.assign(
			"https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID,
		);
	};

	return (
		<Flex
			align="center"
			justify="center"
			style={{ height: "100vh", padding: "0 40px" }}
		>
			<Flex
				vertical
				align="center"
				justify="center"
				gap={44}
				style={{ maxWidth: "662px" }}
			>
				<div style={{ width: "260px", height: "183px", overflow: "hidden" }}>
					<SubscriptionLogo />
				</div>

				<Flex vertical gap={24} align="center">
					<Typography.Title level={2} style={{ textAlign: "center" }}>
						Discover your CodeYourFuture Slack engagement.
					</Typography.Title>
					<Typography.Title
						level={5}
						type="secondary"
						style={{ textAlign: "center" }}
					>
						Sign in with your GitHub account.
					</Typography.Title>
					{localStorage.getItem("accessToken") ? (
						<>
							<ThemedButton
								type="primary"
								onClick={() => {
									localStorage.removeItem("accessToken");
									setRerender(!rerender);
								}}
								icon={<GithubFilled />}
							>
								<Typography.Title level={5} style={{ color: "#fff" }}>
									Log Out
								</Typography.Title>
							</ThemedButton>
							{Object.keys(userData).length !== 0 ? (
								<Typography.Text>Hey {userData.login}!</Typography.Text>
							) : null}
						</>
					) : (
						<ThemedButton
							type="primary"
							onClick={handleGitHubLogin}
							icon={<GithubFilled />}
						>
							<Typography.Title level={5} style={{ color: "#fff" }}>
								Login with GitHub
							</Typography.Title>
						</ThemedButton>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}
