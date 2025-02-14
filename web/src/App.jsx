import { Route, Routes } from "react-router-dom";

import "./App.css";
import About from "./pages/About.jsx";
import { ConfirmationPage } from "./pages/ConfirmationPage.jsx";
import { ErrorOnSubscribe } from "./pages/ErrorOnSubscribe.jsx";
import Home from "./pages/Home.jsx";
import { Subscription } from "./pages/Subscription.jsx";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/nested/about/path" element={<About />} />
			<Route path="/subscribe/confirmation" element={<ConfirmationPage />} />
			<Route path="/subscribe/error" element={<ErrorOnSubscribe />} />
			<Route path="/subscribe" element={<Subscription />} />
		</Routes>
	);
}

export default App;
