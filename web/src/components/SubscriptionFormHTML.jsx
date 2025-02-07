import { Button, Input, Space, Flex } from "antd";

const SubscriptionFormHTML = () => {
	return (
		<Flex justify="center" align="center" style={{ height: "100vh" }}>
			<div>
				<form action="/api/subscribe" method="post">
					<Space.Compact>
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="Enter your email"
							required
						/>
						<Button type="primary" htmlType="submit">
							Subscribe
						</Button>
					</Space.Compact>
				</form>
			</div>
		</Flex>
	);
};

export { SubscriptionFormHTML };
