import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AuthContext } from "../components/AuthContext";

import Home from "./Home.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("Home component", () => {
	afterEach(() => {
		mockNavigate.mockClear();
	});

	it("renders the login button when user is not authenticated", () => {
		render(
			<AuthContext.Provider value={null}>
				<MemoryRouter>
					<Home />
				</MemoryRouter>
			</AuthContext.Provider>,
		);

		expect(screen.getByText(/CYF Slack/i)).toBeInTheDocument();

		const loginButton = screen.getByRole("button", { name: /login/i });
		expect(loginButton).toBeInTheDocument();
	});

	it("navigates to login page when login button is clicked", () => {
		render(
			<AuthContext.Provider value={null}>
				<MemoryRouter>
					<Home />
				</MemoryRouter>
			</AuthContext.Provider>,
		);

		const loginButton = screen.getByRole("button", { name: /login/i });
		fireEvent.click(loginButton);

		expect(mockNavigate).toHaveBeenCalledWith("/login");
	});

	it("navigates to dashboard when user is authenticated and clicks the dashboard button", () => {
		const mockUser = { login: "testUser" };
		render(
			<AuthContext.Provider value={{ userData: mockUser }}>
				<MemoryRouter>
					<Home />
				</MemoryRouter>
			</AuthContext.Provider>,
		);
		const dashboardButton = screen.getByRole("button", { name: /dashboard/i });

		fireEvent.click(dashboardButton);

		expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
	});
});
