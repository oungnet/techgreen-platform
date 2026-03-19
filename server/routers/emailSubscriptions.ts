import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getOrCreateEmailSubscription,
  updateEmailSubscription,
  getUserEmailNotifications,
} from "../db";

export const emailSubscriptionsRouter = router({
  // Get email subscription preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    try {
      const subscription = await getOrCreateEmailSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get subscription preferences",
        });
      }
      return subscription;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("[EmailSubscriptions] Failed to get preferences:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get subscription preferences",
      });
    }
  }),

  // Update email subscription preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        subscribeToNewArticles: z.boolean().optional(),
        subscribeToUpdates: z.boolean().optional(),
        subscribeToPolicy: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updates = {
          subscribeToNewArticles: input.subscribeToNewArticles ? 1 : 0,
          subscribeToUpdates: input.subscribeToUpdates ? 1 : 0,
          subscribeToPolicy: input.subscribeToPolicy ? 1 : 0,
        };

        const subscription = await updateEmailSubscription(ctx.user.id, updates);
        if (!subscription) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update subscription preferences",
          });
        }

        return subscription;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[EmailSubscriptions] Failed to update preferences:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update subscription preferences",
        });
      }
    }),

  // Get notification history
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const notifications = await getUserEmailNotifications(ctx.user.id);
        return notifications.slice(0, input.limit);
      } catch (error) {
        console.error("[EmailSubscriptions] Failed to get notifications:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get notifications",
        });
      }
    }),
});
