import { Typography } from "antd";

import { ThemedButton } from "./ThemedButton";
import { ThemedInput } from "./ThemedInput";

import "./SubscriptionFormHTML.css";

const SubscriptionFormHTML = () => {
	return (
		<div className="subscription-form__container">
			<form action="/api/subscribe" method="post" id="subscription-form">
				<div className="subscription-form__layout">
					<ThemedInput
						type="email"
						name="email"
						placeholder="Enter your email linked to CYF Slack"
						required
					/>
					<ThemedButton type="primary" htmlType="submit">
						<Typography.Title
							level={5}
							style={{ color: "#fff", fontStyle: "italic" }}
						>
							Subscribe
						</Typography.Title>
					</ThemedButton>
				</div>
			</form>
		</div>
	);
};

export { SubscriptionFormHTML };
