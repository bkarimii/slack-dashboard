import { GithubFilled, UserOutlined } from "@ant-design/icons";
import { Typography, Avatar, Space, Card, Button, Flex } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePrincipal } from "../authHooks.js";

const Dashboard = () => {
	const principal = usePrincipal();
	const navigate = useNavigate();

	useEffect(() => {
		if (!principal) {
			navigate("/login");
		}
	}, [principal, navigate]);

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
						<Space direction="vertical" size={20}>
							<Typography.Text style={{ margin: "10px 0" }}>
								{principal?.email}
							</Typography.Text>
							<Typography.Text type="secondary">
								Welcome to your dashboard.
							</Typography.Text>
							<Button
								size="middle"
								onClick={() => navigate("/upload")}
								style={{
									marginTop: "15px",
								}}
							>
								Upload
							</Button>
							<form
								action="/api/auth/logout"
								aria-labelledby="logout-button"
								method="POST"
							>
								<Button
									type="primary"
									icon={<GithubFilled />}
									danger
									htmlType="submit"
								>
									<Typography.Link level={5} style={{ color: "#fff" }}>
										Logout
									</Typography.Link>
								</Button>
							</form>
						</Space>
					</Card>
				</Flex>
			) : (
				navigate("/login")
			)}
		</>
	);
};

export default Dashboard;
