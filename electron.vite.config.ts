import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import { visualizer } from 'rollup-plugin-visualizer'


export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "electron/main/index.ts"),
        },
        output: {
          format: "es",
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "electron/preload/index.ts"),
        },
        output: {
          format: "es",
        },
      },
    },
  },
  renderer: {
    root: ".",
    build: {
      sourcemap: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
        },
        output: {
          format: "es",
        },
      },
    },
    plugins: [react(), visualizer({
        emitFile: true,
        filename: 'stats.html', // This will be saved to your output folder
        open: true // Automatically opens the report in your browser
      })],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  },
});
