import path from 'path';

import react from "@vitejs/plugin-react";
import { defineConfig, minify, type Plugin } from "vite";

const ESMETA_WORKER_DIR = path.resolve(__dirname, "./worker");

/**
 * Vite 8 minifies with oxc, whose `compress` pass miscompiles the Scala.js
 * output of the ESMeta worker: the built debugger fails to decode the dumps
 * ("DecodingFailure at .main/.hash/.prods: Missing required field"). Minify
 * that chunk with mangling and whitespace removal only, and keep the full
 * minification for the rest of the app.
 */
function minifyPlugin(): Plugin {
  return {
    name: "esmeta:minify",
    apply: "build",
    enforce: "post",
    async renderChunk(code, chunk) {
      const isScalaJS = chunk.moduleIds.some(id =>
        id.startsWith(ESMETA_WORKER_DIR),
      );
      const result = await minify(chunk.fileName, code, {
        module: true,
        compress: !isScalaJS,
        mangle: true,
        codegen: { removeWhitespace: true },
      });
      return { code: result.code, map: result.map ?? null };
    },
  };
}

export default defineConfig({
  plugins: [react(), minifyPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __DEFAULT_API_IS_BROWSER__: (process.env.ESMETA_CLIENT_WORKER_AS_DEFAULT ?? '').toLowerCase() === 'true',
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
    minify: false, // handled by `minifyPlugin` above
    cssMinify: true,
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
