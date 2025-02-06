import { Button, Input, Space, Flex, message } from "antd";

const SubscriptionFormHTML = () => {
	// Function to validate email before submission
	const validateEmail = (event) => {
		const email = event.target.emailInput.value;

		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailPattern.test(email)) {
			event.preventDefault();
			message.error("Please enter a valid email address");
		}
	};

	return (
		<Flex justify="center" align="center" style={{ height: "100vh" }}>
			<div>
				<form action="/api/subscribe" method="post" onSubmit={validateEmail}>
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
