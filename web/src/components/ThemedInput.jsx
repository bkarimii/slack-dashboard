import { Input } from "antd";
import { forwardRef } from "react";

import "./ThemedInput.css";

// eslint-disable-next-line react/prop-types
export const ThemedInput = forwardRef(({ className, ...props }, ref) => {
	return (
		<div className={`input-container ${className || ""}`}>
			<Input ref={ref} className="themed-input" {...props} />
		</div>
	);
});

ThemedInput.displayName = "ThemedInput";
