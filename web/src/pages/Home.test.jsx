import { render } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { server } from "../setupTests.js";

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
	beforeEach(() => {
		server.use(http.get("/api/message", () => HttpResponse.text("")));
		mockNavigate.mockClear();
	});

	it("redirects to login page", () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		);
		expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
	});

	it("renders the login button", () => {
		render(<Home />);
		const headingElement = screen.getByText(/CYF Slack/i);
		expect(headingElement).toBeInTheDocument();
	});
});
