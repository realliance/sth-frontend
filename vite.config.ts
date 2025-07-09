import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";

export default defineConfig({
  plugins: [
    vike({
      prerender: false, // Disable prerendering to ensure proper SSR
    }), 
    react(), 
    tailwindcss()
  ],
  build: {
    target: "es2022",
  },
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  ssr: {
    noExternal: ['vike-react-query'], // Ensure vike-react-query is bundled for SSR
  },
});
