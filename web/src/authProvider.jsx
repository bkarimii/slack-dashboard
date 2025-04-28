import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

import { AuthContext } from "./authContext.js";

export default function AuthProvider({ children }) {
	const [loading, setLoading] = useState(true);
	const [principal, setPrincipal] = useState();

	const logout = useCallback(() => setPrincipal(undefined), []);

	useEffect(() => {
		fetch("/api/auth/principal")
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then(setPrincipal)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return null;
	}

	return (
		<AuthContext.Provider value={{ logout, principal }}>
			{children}
		</AuthContext.Provider>
	);
}

AuthProvider.propTypes = {
	children: PropTypes.element.isRequired,
};
