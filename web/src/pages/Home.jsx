import { Typography, Flex, Card } from "antd";
import { useNavigate } from "react-router-dom";

import { usePrincipal } from "../AuthContext";
import { ThemedButton } from "../components/ThemedButton";

function Home() {
	const navigate = useNavigate();
	const principal = usePrincipal();

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
					{principal ? (
						<ThemedButton type="primary" onClick={() => navigate("/dashboard")}>
							<Typography.Title level={5} style={{ color: "#fff", margin: 0 }}>
								Dashboard
							</Typography.Title>
						</ThemedButton>
					) : (
						<Typography.Title level={5} style={{ color: "#fff", margin: 0 }}>
							<a href={`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`}>
								Log In
							</a>
						</Typography.Title>
					)}
				</Flex>
			</Card>
		</Flex>
	);
}

export default Home;

// 	return (
// 		<>
// 			<h2>Account</h2>
// 			<table>
// 				<tbody>
// 					<tr>
// 						<th>Name</th>
// 						<td>{principal?.name}</td>
// 					</tr>
// 					<tr>
// 						<th>Email</th>
// 						<td>{principal?.email ?? <em>N/A</em>}</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 			<form
// 				action="/api/auth/logout"
// 				aria-labelledby="logout-button"
// 				method="POST"
// 			>
// 				<Button id="logout-button" style="secondary">
// 					Log out
// 				</Button>
// 			</form>
// 		</>
// 	);
// }
