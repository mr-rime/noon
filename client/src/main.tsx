import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import client from "./apollo";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree, scrollRestoration: true });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ApolloProvider client={client}>
				<RouterProvider router={router} defaultPendingMinMs={0} defaultPendingMs={0} defaultPreload="intent" defaultSsr />
			</ApolloProvider>
		</StrictMode>,
	);
}
