import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/formula-nil/',
  build: {
    assetsInlineLimit: 0 // Inline all assets as base64
  }
});
