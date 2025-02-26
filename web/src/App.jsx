import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import About from "./pages/About.jsx";
import { ConfirmationPage } from "./pages/ConfirmationPage.jsx";
import { ErrorOnSubscribe } from "./pages/ErrorOnSubscribe.jsx";
import { FileUploading } from "./pages/FileUploading.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import { theme } from "./theme.js";

function App() {
	return (
		<ConfigProvider theme={theme}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/nested/about/path" element={<About />} />
				<Route path="/login" element={<Login />} />
				<Route path="/subscribe" element={<Subscribe />} />
				<Route path="/subscribe/confirmation" element={<ConfirmationPage />} />
				<Route path="/subscribe/error" element={<ErrorOnSubscribe />} />
				<Route path="/upload/FileUploading" element={<FileUploading />} />
			</Routes>
		</ConfigProvider>
	);
}

export default App;
