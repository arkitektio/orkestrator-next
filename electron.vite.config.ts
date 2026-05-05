import { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": resolve(__dirname, 'src/renderer/src')
      },
    },
    assetsInclude: ['**/*.js?worker_file*'],
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      }
    },
    optimizeDeps: {
      // Force Vite to exclude the worker if it's being mismanaged by the optimizer
      exclude: ['@numcodecs/zarr', 'numcodecs']
    },
    worker: {
      // Required for many modern codec workers to function in an Electron/Vite env
      format: 'es',
    }

  },
});
