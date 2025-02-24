import { Flex, Typography } from "antd";

import { SubscriptionFormHTML } from "../components/SubscriptionFormHTML";
import { SubscriptionLogo } from "../components/SubscriptionLogo";

function Subscribe() {
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
						Get early access to insights on your Slack activity
					</Typography.Title>
					<Typography.Title
						level={5}
						type="secondary"
						style={{ textAlign: "center" }}
					>
						Get a weekly engagement score reflecting your activity and
						involvement on Slack and get insights to track your contributions
						and stay motivated.
					</Typography.Title>
				</Flex>

				<Flex vertical gap={24} style={{ width: "100%" }}>
					<SubscriptionFormHTML />
					<Typography.Paragraph
						type="secondary"
						style={{ textAlign: "center" }}
					>
						Subscribe now and help shape a tool that empowers you to succeed!{" "}
						<Typography.Text type="primary">🚀</Typography.Text>
					</Typography.Paragraph>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default Subscribe;
