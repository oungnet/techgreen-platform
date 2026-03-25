import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
  getUserActivity,
  getUserActivityStats,
  getOrCreateNotificationPreferences,
  updateNotificationPreferences,
  getOrCreateUserAnalytics,
} from "../db";

export const dashboardRouter = router({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user.id;
      const [notifications, unreadCount, activity, analytics, activityStats] = await Promise.all([
        getUserNotifications(userId),
        getUnreadNotificationCount(userId),
        getUserActivity(userId, 10),
        getOrCreateUserAnalytics(userId),
        getUserActivityStats(userId),
      ]);

      return {
        user: ctx.user,
        notifications: notifications.slice(0, 5),
        unreadCount,
        recentActivity: activity,
        stats: {
          articlesRead: analytics.articlesViewed || 0,
          commentsCreated: analytics.commentsCreated || 0,
          ratingsGiven: analytics.ratingsGiven || 0,
          filesUploaded: activityStats.filesUploaded || 0,
        },
      };
    } catch (error) {
      console.error("[Dashboard] Failed to get overview:", error);
      throw error;
    }
  }),

  getNotifications: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const notifications = await getUserNotifications(ctx.user.id);
      return notifications.slice(0, input.limit);
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotificationCount(ctx.user.id);
  }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await markNotificationAsRead(input.notificationId);
      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsAsRead(ctx.user.id);
    return { success: true };
  }),

  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteUserNotification(input.notificationId);
      return { success: true };
    }),

  getActivity: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return await getUserActivity(ctx.user.id, input.limit);
    }),

  getActivityStats: protectedProcedure.query(async ({ ctx }) => {
    return await getUserActivityStats(ctx.user.id);
  }),

  getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await getOrCreateNotificationPreferences(ctx.user.id);
  }),

  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        newArticles: z.number().optional(),
        commentApproved: z.number().optional(),
        newComments: z.number().optional(),
        campaigns: z.number().optional(),
        systemNotifications: z.number().optional(),
        emailNotifications: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateNotificationPreferences(ctx.user.id, input);
      return { success: true };
    }),
});
