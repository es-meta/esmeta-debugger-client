import * as path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(),
		{
      name: 'configure-worker-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Check if the request is for a worker file
          if (req.url?.includes('worker')) {
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          }
          next();
        });
      },
		}
	],
	server: {
		port: 3000,
		// NOTE this is required for worker-loader to work
		// works in localhost only
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.mjs$/,
	// 			include: /node_modules/,
	// 			type: "javascript/auto"
	// 		}
	// 	],
	// },
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});