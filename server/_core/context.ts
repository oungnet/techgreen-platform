import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Fallback to passport session user when Manus OAuth cookie is not present.
    user = (opts.req.user as User | undefined) ?? null;
  }

  if (!user && opts.req.user) {
    user = opts.req.user as User;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
