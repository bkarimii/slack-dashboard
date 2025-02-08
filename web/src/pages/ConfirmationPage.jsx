// import { CheckCircleOutlined } from "@ant-design/icons";
// import { Typography, Button, Row, Col } from "antd";

// import "./ConfirmationPage.css";

// const { Title, Text } = Typography;

// const ConfirmationPage = () => {
// 	return (
// 		<div className="confirmation-container">
// 			{/* Success Icon */}
// 			<Row justify="center">
// 				<Col>
// 					<CheckCircleOutlined className="success-icon" />
// 				</Col>
// 			</Row>

// 			{/* Success Message */}
// 			<Row justify="center">
// 				<Col
// 					xs={22}
// 					sm={18}
// 					md={12}
// 					lg={10}
// 					xl={8}
// 					className="confirmation-box"
// 				>
// 					<Title level={3} className="success-title">
// 						Successfully subscribed!
// 					</Title>
// 					<Text className="success-text">
// 						You should receive <b>an email confirmation</b> shortly.
// 					</Text>
// 					<br />
// 					<Text className="success-text">
// 						We usually publish the newsletter on <b>every Monday</b>. Expect to
// 						receive your first newsletter <b>this upcoming Monday</b>.
// 					</Text>

// 					{/* Close Button */}
// 					<Button type="primary" size="large" className="close-button">
// 						Close
// 					</Button>
// 				</Col>
// 			</Row>
// 		</div>
// 	);
// };

// export default ConfirmationPage;

import { CheckCircleFilled } from "@ant-design/icons";
import { Typography, Button, Row, Col } from "antd";

const { Title, Text } = Typography;

const ConfirmationPage = () => {
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
				{/* Success Icon */}
				<CheckCircleFilled
					style={{ fontSize: "60px", color: "#52c41a", marginBottom: "16px" }}
				/>

				{/* Title */}
				<Title level={3} strong>
					Successfully subscribed!
				</Title>

				{/* Text */}
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
						style={{
							marginTop: "14px",
						}}
					>
						Close
					</Button>
				</div>
			</Col>
		</Row>
	);
};

export default ConfirmationPage;
