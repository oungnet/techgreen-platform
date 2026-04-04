import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getUserByEmail,
  getUserByOpenId,
  getUserPasswordHash,
  upsertUser,
} from "../db";
import { setLocalPassword } from "../_core/passport";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

type MembershipTier = "free" | "basic" | "premium" | "enterprise";
type SubscriptionStatus = "active" | "inactive" | "cancelled";

type PreferenceRecord = {
  newsletter: 0 | 1;
  promotions: 0 | 1;
  dataSharing: 0 | 1;
  twoFactorEnabled: 0 | 1;
};

type SubscriptionRecord = {
  status: SubscriptionStatus;
  tier: MembershipTier;
  startDate: Date;
  endDate: Date | null;
  nextPaymentDate: Date | null;
  paymentMethod: "credit_card" | "bank_transfer";
};

const emailVerificationTokens = new Map<string, string>();
const membershipPreferences = new Map<number, PreferenceRecord>();
const membershipSubscriptions = new Map<number, SubscriptionRecord>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getDefaultPreferences(): PreferenceRecord {
  return {
    newsletter: 1,
    promotions: 1,
    dataSharing: 0,
    twoFactorEnabled: 0,
  };
}

function getDefaultSubscription(): SubscriptionRecord {
  return {
    status: "active",
    tier: "free",
    startDate: new Date(),
    endDate: null,
    nextPaymentDate: null,
    paymentMethod: "credit_card",
  };
}

export const membershipRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1).max(255),
        phone: z.string().max(20).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const email = normalizeEmail(input.email);
      const existing = await getUserByEmail(email);

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "อีเมลนี้ถูกใช้งานแล้ว",
        });
      }

      const openId = `local:${email}`;
      await upsertUser({
        openId,
        email,
        name: input.name,
        phone: input.phone,
        loginMethod: "local",
        lastSignedIn: new Date(),
        role: "user",
      });

      const user = await getUserByOpenId(openId);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ไม่สามารถสร้างบัญชีผู้ใช้ได้",
        });
      }

      await setLocalPassword(user.id, input.password);
      const emailVerificationToken = createToken();
      emailVerificationTokens.set(emailVerificationToken, email);

      if (!membershipPreferences.has(user.id)) {
        membershipPreferences.set(user.id, getDefaultPreferences());
      }

      if (!membershipSubscriptions.has(user.id)) {
        membershipSubscriptions.set(user.id, getDefaultSubscription());
      }

      return {
        success: true,
        emailVerificationToken,
      } as const;
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = normalizeEmail(input.email);
      const user = await getUserByEmail(email);

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      }

      const passwordHash = await getUserPasswordHash(user.id);
      if (!passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      }

      const validPassword = await bcrypt.compare(input.password, passwordHash);
      if (!validPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      }

      await new Promise<void>((resolve, reject) => {
        const loginFn = (ctx.req as typeof ctx.req & { login?: (u: unknown, cb: (err?: unknown) => void) => void }).login;
        if (!loginFn) {
          resolve();
          return;
        }
        loginFn.call(ctx.req, user, (err?: unknown) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      await upsertUser({
        openId: user.openId,
        lastSignedIn: new Date(),
      });

      return {
        success: true,
        user,
      } as const;
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const email = emailVerificationTokens.get(input.token);

      if (!email) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "โทเค็นยืนยันไม่ถูกต้องหรือหมดอายุ" });
      }

      emailVerificationTokens.delete(input.token);
      return { success: true, email } as const;
    }),

  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const existing = membershipSubscriptions.get(ctx.user.id);
    const subscription = existing ?? getDefaultSubscription();

    if (!existing) {
      membershipSubscriptions.set(ctx.user.id, subscription);
    }

    return {
      ...subscription,
      userId: ctx.user.id,
    } as const;
  }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const existing = membershipPreferences.get(ctx.user.id);
    const preferences = existing ?? getDefaultPreferences();

    if (!existing) {
      membershipPreferences.set(ctx.user.id, preferences);
    }

    return preferences;
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        newsletter: z.union([z.literal(0), z.literal(1)]),
        promotions: z.union([z.literal(0), z.literal(1)]),
        dataSharing: z.union([z.literal(0), z.literal(1)]),
        twoFactorEnabled: z.union([z.literal(0), z.literal(1)]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      membershipPreferences.set(ctx.user.id, input);
      return {
        success: true,
        preferences: input,
      } as const;
    }),

  upgradeTier: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["basic", "premium", "enterprise"]),
        paymentMethod: z.enum(["credit_card", "bank_transfer"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const current = membershipSubscriptions.get(ctx.user.id) ?? getDefaultSubscription();
      const nextSubscription: SubscriptionRecord = {
        ...current,
        status: "active",
        tier: input.tier,
        paymentMethod: input.paymentMethod,
        endDate: null,
        nextPaymentDate: null,
      };

      membershipSubscriptions.set(ctx.user.id, nextSubscription);

      return {
        success: true,
        subscription: nextSubscription,
      } as const;
    }),

  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const current = membershipSubscriptions.get(ctx.user.id) ?? getDefaultSubscription();
    const cancelled: SubscriptionRecord = {
      ...current,
      status: "cancelled",
      endDate: new Date(),
      nextPaymentDate: null,
    };

    membershipSubscriptions.set(ctx.user.id, cancelled);

    return {
      success: true,
      subscription: cancelled,
    } as const;
  }),
});
