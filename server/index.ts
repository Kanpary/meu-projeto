import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

async function main() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }
        log(logLine);
      }
    });

    next();
  });

  // register all your API routes
  const server = await registerRoutes(app);

  // generic error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // health check endpoint for Render / Kubernetes / Load-balancers
  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(200).send("OK");
  });

  // in development mode, mount Vite dev server
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // in production, serve built static assets
    serveStatic(app);
  }

  // listen on the port provided by the environment (e.g. Render sets process.env.PORT)
  const port = Number(process.env.PORT) || 5000;
  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => {
      log(`serving on port ${port}`);
    }
  );
}

main().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
