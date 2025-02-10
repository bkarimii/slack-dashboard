import { Flex, Typography } from "antd";

import { SubscriptionLogo } from "../components/SubscriptionLogo";

function Subscribe() {
	return (
		<Flex vertical align="center">
			<div style={{ width: "260px", height: "183px", overflow: "hidden" }}>
				<SubscriptionLogo />
			</div>

			<Flex vertical gap={24} align="center">
				<Typography.Title level={2}>
					Get early access to insights on your Slack activity
				</Typography.Title>
				<Typography.Title level={5} type="secondary">
					Get a weekly engagement score reflecting your activity and involvement
					on Slack and get insights to track your contributions and stay
					motivated.
				</Typography.Title>
			</Flex>

			<Flex vertical gap={24}>
				{/* TODO: Add subscription form */}
				<Typography.Paragraph type="secondary">
					Subscribe now and help shape a tool that empowers you to succeed! 🚀
				</Typography.Paragraph>
			</Flex>
		</Flex>
	);
}

export default Subscribe;
