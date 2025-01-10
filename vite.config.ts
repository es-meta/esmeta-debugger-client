import path from 'path';

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
	server: {
    port: 3000,
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
      "@esmeta": path.resolve(__dirname, "./scalajs/target/scala-3.3.3/esmeta-worker-opt"),
      "@esmeta-debug": path.resolve(__dirname, "./scalajs/target/scala-3.3.3/esmeta-worker-fastopt"),
		},
	},
});
