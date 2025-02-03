import { render, screen } from "@testing-library/react";

import { SubscriptionForm } from "./SubscribtionForm";

describe("SubscriptionForm component", () => {
	it("renders the email input box", () => {
		render(<SubscriptionForm />);
		const inputBox = screen.getByPlaceholderText(/enter your email address/i);
		expect(inputBox).toBeInTheDocument();
		expect(inputBox).toHaveAttribute("type", "email");
	});

	it("renders the subscribe button", () => {
		render(<SubscriptionForm />);
		const submitButton = screen.getByRole("button", { name: /subscribe/i });
		expect(submitButton).toBeInTheDocument();
	});
});
