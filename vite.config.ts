import path from 'path';

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },  
	server: {
    port: 3000,
    open: '/',
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: "./dist/csr",
    target: 'esnext', // or appropriate target for your environment
    rollupOptions: {
      output: {
        format: 'es', // Ensure workers use ES modules
      },
    },
  },
  worker: {
    format: 'es', // Use ES module format for workers
  },
	resolve: {
		alias: {
      "@": path.resolve(__dirname, "./src"),
      "@resources": path.resolve(__dirname, "./resources"),
      "@esmeta": path.resolve(__dirname, "./worker/esmeta-worker-opt"),
      "@esmeta-debug": path.resolve(__dirname, "./worker/esmeta-worker-fastopt"),
		},
	},
});
