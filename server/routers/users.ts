import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const usersRouter = router({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      if (user.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user[0];
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("[Users] Failed to get profile:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get profile",
      });
    }
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().max(255).optional(),
        bio: z.string().max(1000).optional(),
        avatar: z.string().optional(),
        phone: z.string().max(20).optional(),
        address: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        const updates: Record<string, unknown> = {};
        if (input.name !== undefined) updates.name = input.name;
        if (input.bio !== undefined) updates.bio = input.bio;
        if (input.avatar !== undefined) updates.avatar = input.avatar;
        if (input.phone !== undefined) updates.phone = input.phone;
        if (input.address !== undefined) updates.address = input.address;

        await db.update(users).set(updates).where(eq(users.id, ctx.user.id));

        const updated = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
        if (updated.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return updated[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Users] Failed to update profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),
});
