import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import session from "express-session";
import passport from "./passport";
import { registerMembershipAuthRoutes } from "./authRoutes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";
import { getArticleBySlug } from "../db";

function parseAllowedOrigins() {
  const values = ENV.frontendOrigins
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);
  const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];
  return new Set([...defaults, ...values]);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const allowedOrigins = parseAllowedOrigins();
  const isCrossSiteCookie = ENV.isProduction && allowedOrigins.size > 0;
  const configuredSameSite = ENV.sessionCookieSameSite.toLowerCase();
  const cookieSameSite: "lax" | "none" =
    configuredSameSite === "none" || configuredSameSite === "lax"
      ? (configuredSameSite as "lax" | "none")
      : isCrossSiteCookie
        ? "none"
        : "lax";
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Vary", "Origin");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    }

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "techgreen-api",
      timestamp: new Date().toISOString(),
      environment: ENV.isProduction ? "production" : "development",
    });
  });

  app.use(
    session({
      name: "tg.sid",
      secret: ENV.sessionSecret || "dev-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: cookieSameSite as "lax" | "none",
        secure: ENV.isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  registerMembershipAuthRoutes(app);

  // Lightweight SSR for article detail pages (SEO-friendly metadata).
  app.get("/learning/:slug", async (req, res, next) => {
    try {
      const article = await getArticleBySlug(req.params.slug);
      if (!article || article.published !== 1) {
        next();
        return;
      }

      const title = article.title;
      const description = article.excerpt || article.content.slice(0, 160);
      const safeTitle = escapeHtml(title);
      const safeDescription = escapeHtml(description);
      const safeCategory = escapeHtml(article.category);
      const safeContent = escapeHtml(article.content);
      const html = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle} | TechGreen Content Hub</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:type" content="article" />
    <style>
      body { font-family: Sarabun, sans-serif; margin: 0; padding: 32px; background: #f8fafc; color: #0f172a; }
      article { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; }
      h1 { margin: 0 0 12px; font-size: 2rem; }
      .meta { color: #475569; font-size: .9rem; margin-bottom: 16px; }
      .content { line-height: 1.7; white-space: pre-wrap; }
      .back { display:inline-block; margin-top:18px; color:#0369a1; text-decoration:none; }
    </style>
  </head>
  <body>
    <article>
      <h1>${safeTitle}</h1>
      <p class="meta">หมวดหมู่: ${safeCategory} • ผู้เขียน ID: ${article.authorId}</p>
      <p class="content">${safeContent}</p>
      <a class="back" href="/learning">← กลับสู่ Content Hub</a>
    </article>
  </body>
</html>`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error) {
      next(error);
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
