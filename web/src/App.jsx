import { Route, Routes } from "react-router-dom";

import "./App.css";
import About from "./pages/About.jsx";
import { ConfirmationPage } from "./pages/ConfirmationPage.jsx";
import Home from "./pages/Home.jsx";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/nested/about/path" element={<About />} />
			<Route path="/subscribe/confirmation" element={<ConfirmationPage />} />
		</Routes>
	);
}

export default App;
