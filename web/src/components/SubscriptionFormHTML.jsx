import { Button, Input, Space, message } from "antd";
import { useEffect, useState } from "react";

const SubscriptionFormHTML = () => {
	const [errorState, setErrorState] = useState({
		isError: false,
		errorType: "",
	});

	// Handles setErrorState to prevent the no-unused-vars ESLint error
	// @todo After adding response handling for the POST request, this should be removed and placed in the submit handler.
	useEffect(() => {
		setErrorState({ isError: false, errorType: "" });
	}, []);

	useEffect(() => {
		if (errorState.isError) {
			message.error(errorState.errorType);
		}
	}, [errorState]);
	return (
		<div>
			<form action="/api/subscribe" method="post" id="subscription-form">
				<Space.Compact>
					<Input
						type="email"
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
