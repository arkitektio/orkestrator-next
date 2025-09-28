import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: { exclude: ["@duckdb/duckdb-wasm"], include: ["zstd"] }, // avoid pre-bundling
  assetsInclude: ["**/duckdb-*.wasm", "**/duckdb-browser-*.worker.js"],
  root: ".",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
