import type { Express, Request, Response } from "express";
import passport, { setLocalPassword } from "./passport";
import { getUserByEmail, getUserByOpenId, upsertUser } from "../db";

const emailVerificationTokens = new Map<string, string>();
const passwordResetTokens = new Map<string, string>();

function buildToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isTrustedOrigin(req: Request) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return true;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

function guardCsrfLike(req: Request, res: Response) {
  if (!isTrustedOrigin(req)) {
    res.status(403).json({ message: "Blocked by CSRF origin policy" });
    return false;
  }
  return true;
}

export function registerMembershipAuthRoutes(app: Express) {
  app.post("/api/auth/local/register", async (req: Request, res: Response) => {
    if (!guardCsrfLike(req, res)) return;
    try {
      const email = normalizeEmail(String(req.body?.email ?? ""));
      const password = String(req.body?.password ?? "");
      const name = String(req.body?.name ?? "User");

      if (!email || !password) {
        res.status(400).json({ message: "email and password are required" });
        return;
      }

      const existing = await getUserByEmail(email);
      const openId = `local:${email}`;

      await upsertUser({
        openId,
        email,
        name,
        loginMethod: "local",
        lastSignedIn: new Date(),
        role: existing?.role ?? "user",
      });

      await setLocalPassword(email, password);

      const verifyToken = buildToken();
      emailVerificationTokens.set(verifyToken, email);

      res.status(201).json({
        success: true,
        message: "Registered successfully",
        verifyEmailToken: verifyToken,
      });
    } catch (error) {
      console.error("[Auth] register failed:", error);
      res.status(500).json({ message: "Register failed" });
    }
  });

  app.post("/api/auth/local/login", passport.authenticate("local"), (req: Request, res: Response) => {
    if (!guardCsrfLike(req, res)) return;
    res.json({
      success: true,
      user: req.user ?? null,
    });
  });

  app.post("/api/auth/local/verify-email", async (req: Request, res: Response) => {
    if (!guardCsrfLike(req, res)) return;
    const token = String(req.body?.token ?? "");
    const email = emailVerificationTokens.get(token);
    if (!email) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    emailVerificationTokens.delete(token);
    res.json({ success: true, email });
  });

  app.post("/api/auth/local/forgot-password", async (req: Request, res: Response) => {
    if (!guardCsrfLike(req, res)) return;
    const email = normalizeEmail(String(req.body?.email ?? ""));
    if (!email) {
      res.status(400).json({ message: "email is required" });
      return;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.json({ success: true });
      return;
    }

    const token = buildToken();
    passwordResetTokens.set(token, email);
    res.json({ success: true, resetToken: token });
  });

  app.post("/api/auth/local/reset-password", async (req: Request, res: Response) => {
    if (!guardCsrfLike(req, res)) return;
    const token = String(req.body?.token ?? "");
    const newPassword = String(req.body?.newPassword ?? "");

    if (!token || !newPassword) {
      res.status(400).json({ message: "token and newPassword are required" });
      return;
    }

    const email = passwordResetTokens.get(token);
    if (!email) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    await setLocalPassword(email, newPassword);
    passwordResetTokens.delete(token);
    res.json({ success: true });
  });

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (_req: Request, res: Response) => {
      res.redirect("/profile");
    }
  );

  app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
  app.get(
    "/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (_req: Request, res: Response) => {
      res.redirect("/profile");
    }
  );

  app.post("/api/auth/logout", (req: Request, res: Response, next) => {
    if (!guardCsrfLike(req, res)) return;
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie("tg.sid");
        res.json({ success: true });
      });
    });
  });

  app.get("/api/auth/session-user", async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ user: null });
      return;
    }

    if (typeof user.id === "number") {
      const dbUser = await getUserByOpenId(user.openId);
      res.json({ user: dbUser ?? user });
      return;
    }

    res.json({ user });
  });
}
