import { useCallback, useContext } from "react";

import { AuthContext } from "./authContext.js";

export function useAuthenticatedFetch() {
	const logout = useLogout();
	return useCallback(
		async (...args) => {
			const res = await fetch(...args);
			if (res.status === 401) {
				logout();
			}
			return res;
		},
		[logout],
	);
}

export const useLogout = () => {
	const { logout } = useContext(AuthContext);
	return logout;
};

export const usePrincipal = () => {
	const { principal } = useContext(AuthContext);
	return principal;
};
