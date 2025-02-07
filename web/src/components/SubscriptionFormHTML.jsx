import { Button, Input, Space } from "antd";

const SubscriptionFormHTML = () => {
	return (
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
	);
};

export { SubscriptionFormHTML };
