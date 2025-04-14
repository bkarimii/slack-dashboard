import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";

import "./App.css";
// import { AuthProvider } from "./components/AuthProvider.jsx";
import About from "./pages/About.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
// import Authenticated  from "./pages/Authenticated";
import { ConfirmationPage } from "./pages/ConfirmationPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { ErrorOnSubscribe } from "./pages/ErrorOnSubscribe.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound";
import Subscribe from "./pages/Subscribe.jsx";
import { FileUploading } from "./pages/Upload.jsx";
import { theme } from "./theme.js";

function App() {
	return (
		// <AuthProvider>
		<ConfigProvider theme={theme}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/nested/about/path" element={<About />} />
				{/* <Route path="/login" element={<Authenticated />} /> */}
				<Route path="/subscribe" element={<Subscribe />} />
				<Route path="/subscribe/confirmation" element={<ConfirmationPage />} />
				<Route path="/subscribe/error" element={<ErrorOnSubscribe />} />
				<Route path="/upload" element={<FileUploading />} />
				<Route path="/auth-callback" element={<AuthCallback />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ConfigProvider>
		// </AuthProvider>
	);
}

export default App;
