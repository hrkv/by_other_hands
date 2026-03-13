import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  plugins: [react()],
  root: ".",
  base,
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
