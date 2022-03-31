import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      dist: path.resolve(__dirname, "./dist"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:1938/v0/api",
        changeOrigin: true,
        rewrite: _path => _path.replace(/^\/api/, ""),
      },
    },
  },
});
