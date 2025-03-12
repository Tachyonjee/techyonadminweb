import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  important: true,
  plugins: [react()],
  root: '.', // Ensure this is set to the correct directory
  build: {
    outDir: 'dist'
  },
  define: {
    global: {},
  },
});