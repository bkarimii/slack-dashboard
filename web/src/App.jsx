import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import About from "./pages/About.jsx";
import { ConfirmationPage } from "./pages/ConfirmationPage.jsx";
import Home from "./pages/Home.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import { theme } from "./theme.js";

function App() {
	return (
		<ConfigProvider theme={theme}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/nested/about/path" element={<About />} />
				<Route path="/subscribe/confirmation" element={<ConfirmationPage />} />
				<Route path="/subscribe" element={<Subscribe />} />
			</Routes>
		</ConfigProvider>
	);
}

export default App;
