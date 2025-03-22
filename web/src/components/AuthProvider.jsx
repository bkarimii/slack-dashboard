import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";

import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
	const [userData, setUserData] = useState(() => {
		const storedUserData = localStorage.getItem("userData");
		return storedUserData ? JSON.parse(storedUserData) : null;
	});

	useEffect(() => {
		if (userData) {
			localStorage.setItem("userData", JSON.stringify(userData));
		} else {
			localStorage.removeItem("userData");
		}
	}, [userData]);

	const contextValue = useMemo(() => ({ userData, setUserData }), [userData]);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}
AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthProvider;
