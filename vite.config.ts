import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy = { "/api": { target: env.API_PROXY_TARGET || "http://127.0.0.1:8081", changeOrigin: true } };
  return {
    server: { host: "127.0.0.1", port: 8080, strictPort: true, proxy },
    preview: { host: "127.0.0.1", port: 8080, strictPort: true, proxy },
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  };
});
