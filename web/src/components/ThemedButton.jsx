import { Button } from "antd";
import { forwardRef } from "react";

import "./ThemedButton.css";

// eslint-disable-next-line react/prop-types
export const ThemedButton = forwardRef(({ className, ...props }, ref) => {
	return (
		<Button
			type="primary"
			size="large"
			className={`themed-button ${className || ""}`}
			ref={ref}
			{...props}
		/>
	);
});

ThemedButton.displayName = "ThemedButton";
