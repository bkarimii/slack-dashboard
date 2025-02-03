import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../setupTests.js";

import Home from "./Home.jsx";

describe("Home component", () => {
	beforeEach(() =>
		server.use(http.get("/api/message", () => HttpResponse.text(""))),
	);

	it("renders the submit button", () => {
		render(<Home />);
		const submit = screen.getByRole("button", { name: /Subscribe/i });
		expect(submit).toBeInTheDocument();
	});
});
