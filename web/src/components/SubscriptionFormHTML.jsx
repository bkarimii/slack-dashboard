import { Button, Input, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionFormHTML = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const form = document.querySelector("#subscription-form");

		const handleSubmit = async (event) => {
			event.preventDefault();
			setLoading(true);

			const email = form.querySelector("[name=email]").value;

			try {
				const response = await fetch(form.action, {
					method: form.method,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({ email }),
				});

				if (response.ok) {
					message.success("Subscription successful!");
					form.reset();
					setTimeout(() => navigate("/subscription/confirmation"), 1500);
				}
			} catch (error) {
				message.error("An unexpected error occurred. Try again later.");
			} finally {
				setLoading(false);
			}
		};

		form.addEventListener("submit", handleSubmit);

		return () => {
			form.removeEventListener("submit", handleSubmit);
		};
	}, [navigate]);

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
					<Button type="primary" htmlType="submit" disabled={loading}>
						{loading ? "Subscribing..." : "Subscribe"}
					</Button>
				</Space.Compact>
			</form>
		</div>
	);
};

export { SubscriptionFormHTML };
