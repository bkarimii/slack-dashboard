import { CheckCircleFilled } from "@ant-design/icons";
import { Typography, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const ConfirmationPage = () => {
	const navigate = useNavigate();

	return (
		<Row
			justify="center"
			align="middle"
			style={{ height: "100vh", background: "#f9f9f9", display: "flex" }}
		>
			<Col
				xs={22}
				sm={18}
				md={12}
				lg={10}
				xl={8}
				style={{
					padding: "24px",
					borderRadius: "8px",
					textAlign: "center",
				}}
			>
				<CheckCircleFilled
					style={{ fontSize: "60px", color: "#52c41a", marginBottom: "16px" }}
				/>

				<Title level={3} strong>
					Successfully subscribed!
				</Title>

				<Text>
					You should receive <b>an email confirmation</b> shortly.
				</Text>
				<br />
				<Text>
					We usually publish the newsletter on <b>every Monday</b>. Expect to
					receive your first newsletter <b>this upcoming Monday</b>.
				</Text>
				<div>
					<Button
						size="middle"
						onClick={() => navigate("/")}
						style={{
							marginTop: "15px",
						}}
					>
						Close
					</Button>
				</div>
			</Col>
		</Row>
	);
};
