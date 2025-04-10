import { Typography, Flex, Card } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../components/AuthContext";
import { ThemedButton } from "../components/ThemedButton";

function Home() {
	const { userData } = useContext(AuthContext) || {};
	const navigate = useNavigate();

	return (
		<Flex
			align="center"
			justify="center"
			style={{
				height: "100vh",
				padding: "20px",
				color: "#fff",
			}}
		>
			<Card
				style={{
					maxWidth: 400,
					width: "100%",
					textAlign: "center",
					padding: "30px",
					borderRadius: "12px",
					boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
				}}
			>
				<Typography.Title level={2} style={{ marginBottom: "20px" }}>
					CYF Slack
				</Typography.Title>
				<Typography.Text type="secondary">
					Stay connected and explore your engagement with CYF.
				</Typography.Text>

				<Flex justify="center" style={{ marginTop: "30px" }}>
					{userData?.login ? (
						<ThemedButton type="primary" onClick={() => navigate("/dashboard")}>
							<Typography.Title level={5} style={{ color: "#fff", margin: 0 }}>
								Dashboard
							</Typography.Title>
						</ThemedButton>
					) : (
						<ThemedButton type="primary" onClick={() => navigate("/login")}>
							<Typography.Title level={5} style={{ color: "#fff", margin: 0 }}>
								Login
							</Typography.Title>
						</ThemedButton>
					)}
				</Flex>
			</Card>
		</Flex>
	);
}

export default Home;
