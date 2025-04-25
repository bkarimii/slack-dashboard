import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Slack Dashboard API",
			version: "1.0.0",
			description: "API documentation for the Slack Dashboard project",
			contact: {
				name: "Behrouz Karimi",
				email: "your-email@example.com",
			},
		},
		servers: [
			{
				url: "http://localhost:3000/api",
				description: "Local dev server",
			},
		],
	},
	apis: ["./api.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default (app) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
