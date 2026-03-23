import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { filesRouter } from "./routers/files";
import { articlesRouter } from "./routers/articles";
import { usersRouter } from "./routers/users";
import { emailSubscriptionsRouter } from "./routers/emailSubscriptions";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { moderationRouter } from "./routers/moderation";
import { campaignsRouter } from "./routers/campaigns";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    sessionMe: publicProcedure.query(({ ctx }) => {
      return (ctx.req.user as unknown) ?? null;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  files: filesRouter,
  articles: articlesRouter,
  users: usersRouter,
  emailSubscriptions: emailSubscriptionsRouter,
  admin: adminRouter,
  analytics: router(analyticsRouter),
  moderation: router(moderationRouter),
  campaigns: router(campaignsRouter),
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
