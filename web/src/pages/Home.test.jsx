import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../setupTests.js";

import Home from "./Home.jsx";

describe("Home component", () => {
	beforeEach(() =>
		server.use(http.get("/api/message", () => HttpResponse.text(""))),
	);

	it("renders the login button", () => {
		render(<Home />);
		const headingElement = screen.getByText(/CYF Slack Dashboard/i);
		expect(headingElement).toBeInTheDocument();
	});
});
