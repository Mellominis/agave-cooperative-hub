import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// A lightweight Vite development server plugin to support Vercel serverless /api routes in local AI Studio workspace
const localApiPlugin = () => ({
  name: "local-api-endpoints",
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url?.startsWith("/api/current-user")) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ email: "gerdyabelard@gmail.com" }));
        return;
      }
      if (req.url?.startsWith("/api/contact")) {
        if (req.method === "POST" || req.method === "OPTIONS") {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const parsed = JSON.parse(body || "{}");
              const { default: handler } = await import("./api/contact.ts");
              
              const reqMock = Object.assign(req, { body: parsed });
              const originalSetHeader = res.setHeader.bind(res);
              const originalEnd = res.end.bind(res);
              const resMock = Object.assign(res, {
                status(code: number) {
                  res.statusCode = code;
                  return this;
                },
                json(jsonData: any) {
                  originalSetHeader("Content-Type", "application/json");
                  originalEnd(JSON.stringify(jsonData));
                  return this;
                },
                setHeader(name: string, value: string) {
                  originalSetHeader(name, value);
                  return this;
                },
                end() {
                  originalEnd();
                  return this;
                }
              });

              await handler(reqMock as any, resMock as any);
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: e.message || "Internal server error" }));
            }
          });
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig(() => {
  return {
    base: "/",
    plugins: [react(), tailwindcss(), localApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    }
  };
});
