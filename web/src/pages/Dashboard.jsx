import { GithubFilled, UserOutlined } from "@ant-design/icons";
import { Typography, Avatar, Card, Button, Flex } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePrincipal } from "../AuthContext";

const Dashboard = () => {
	const principal = usePrincipal();
	const navigate = useNavigate();

	useEffect(() => {
		if (!principal?.email) {
			navigate("/login");
		}
	}, [principal, navigate]);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("userData");
		// setUserData(null);
		navigate("/");
	};

	return (
		<>
			{principal ? (
				<Flex
					align="center"
					justify="center"
					style={{ height: "100vh", padding: "20px" }}
				>
					<Card
						style={{
							maxWidth: 400,
							width: "100%",
							textAlign: "center",
							padding: "20px",
							borderRadius: "10px",
							boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
						}}
					>
						<Avatar
							size={80}
							// src={principal?.avatar_url}
							icon={<UserOutlined />}
							style={{
								border: "2px solid #1890ff",
								boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
								marginBottom: "10px",
							}}
						/>
						<Typography.Title level={4} style={{ margin: "10px 0" }}>
							Hey, {principal?.name}!
						</Typography.Title>
						<Typography.Text type="secondary">
							Welcome to your dashboard.
						</Typography.Text>
						<Flex justify="center" style={{ marginTop: "20px" }}>
							<Button
								type="primary"
								onClick={handleLogout}
								icon={<GithubFilled />}
								danger
							>
								Log Out
							</Button>
						</Flex>
					</Card>
				</Flex>
			) : (
				navigate("/login")
			)}
		</>
	);
};

export default Dashboard;
