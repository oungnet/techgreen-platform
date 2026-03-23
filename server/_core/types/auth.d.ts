import "express-session";
import type { User as DbUser } from "../../../drizzle/schema";

declare global {
  namespace Express {
    interface User extends DbUser {}
  }
}

declare module "express-session" {
  interface SessionData {
    passport?: {
      user?: number;
    };
  }
}

export {};
