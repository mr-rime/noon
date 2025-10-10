import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";



import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), TanStackRouterVite({ target: "react", autoCodeSplitting: true }), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	ssr: {
		noExternal: ['@apollo/client'],
	},
	experimental: {
		enableNativePlugin: true
	}
});
