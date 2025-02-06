import { Button, Input, Space } from "antd";

const SubscriptionFormHTML = () => {
	return (
		<form action="/api/subscribe" method="post">
			<Space.Compact>
				<Input
					type="email"
					id="email"
					name="email"
					placeholder="Enter your email"
				/>
				<Button type="primary" htmlType="submit">
					Subscribe
				</Button>
			</Space.Compact>
		</form>
	);
};

export { SubscriptionFormHTML };
