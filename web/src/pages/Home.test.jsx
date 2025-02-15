import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../setupTests.js";

import Home from "./Home.jsx";

describe("Home component", () => {
	beforeEach(() =>
		server.use(http.get("/api/message", () => HttpResponse.text(""))),
	);

	it("renders the heading", () => {
		render(<Home />);
		const heading = screen.getByRole("heading", {
			name: /CYF Slack Dashboard/i,
		});
		expect(heading).toBeInTheDocument();
	});
});
