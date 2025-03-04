import { GithubFilled } from "@ant-design/icons";
import { Flex, Typography } from "antd";

import { SubscriptionLogo } from "../components/SubscriptionLogo";
import { ThemedButton } from "../components/ThemedButton";

export default function Login() {
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
						Discover your CodeYourFutre Slack engagement.
					</Typography.Title>
					<Typography.Title
						level={5}
						type="secondary"
						style={{ textAlign: "center" }}
					>
						Sign in with your GitHub account.
					</Typography.Title>
					<ThemedButton icon={<GithubFilled />}>
						<Typography.Title level={5} style={{ color: "#fff" }}>
							Login with GitHub
						</Typography.Title>
					</ThemedButton>
				</Flex>
			</Flex>
		</Flex>
	);
}
