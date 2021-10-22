import { resolve } from "path";
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: "public",
  base: "",
  resolve: {
    alias: [
      { find: "@/", replacement: `${resolve("./src")}/` },
      { find: "@typings/", replacement: `${resolve("../typings")}/` },
    ],
  },
  build: {
    outDir: "dist",
  },
  server: {
    cors: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:1337/api", //代理接口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
