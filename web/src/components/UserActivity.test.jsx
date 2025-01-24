import { render, screen, fireEvent } from "@testing-library/react";

import UsersActivity from "./UsersActivity";

describe("UsersActivity Component", () => {
	test("renders input field and submit button", () => {
		render(<UsersActivity />);

		const inputElement = screen.getByPlaceholderText(/Enter users ID/i);
		const buttonElement = screen.getByRole("button", { name: /submit/i });

		expect(inputElement).toBeInTheDocument();
		expect(buttonElement).toBeInTheDocument();
	});

	test("displays an error message when submitting an empty input", () => {
		render(<UsersActivity />);

		const buttonElement = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(buttonElement);

		const errorMessage = screen.getByText(/Empty user IDs are not allowed!/i);
		expect(errorMessage).toBeInTheDocument();
	});
});
