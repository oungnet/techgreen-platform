import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
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
  getOrCreateUserAnalytics
} from "../db";

export const dashboardRouter = router({
  // Get member dashboard overview
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user.id;
      const [notifications, unreadCount, activity, analytics] = await Promise.all([
        getUserNotifications(userId, 5),
        getUnreadNotificationCount(userId),
        getUserActivity(userId, 10),
        getOrCreateUserAnalytics(userId),
      ]);
      
      const activityStats = await getUserActivityStats(userId);
      
      return {
        user: ctx.user,
        notifications,
        unreadCount,
        recentActivity: activity,
        stats: {
          articlesRead: analytics.articlesViewed || 0,
          commentsCreated: analytics.commentsCreated || 0,
          ratingsGiven: analytics.ratingsGiven || 0,
          filesUploaded: activityStats.uploads,
        }
      };
    } catch (error) {
      console.error("[Dashboard] Failed to get overview:", error);
      throw error;
    }
  }),

  // Get notifications
  getNotifications: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      return await getUserNotifications(ctx.user.id, input.limit);
    }),

  // Get unread notification count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotificationCount(ctx.user.id);
  }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await markNotificationAsRead(input.notificationId);
      return { success: true };
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsAsRead(ctx.user.id);
    return { success: true };
  }),

  // Delete notification
  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteUserNotification(input.notificationId);
      return { success: true };
    }),

  // Get user activity
  getActivity: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return await getUserActivity(ctx.user.id, input.limit);
    }),

  // Get activity statistics
  getActivityStats: protectedProcedure.query(async ({ ctx }) => {
    return await getUserActivityStats(ctx.user.id);
  }),

  // Get notification preferences
  getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await getOrCreateNotificationPreferences(ctx.user.id);
  }),

  // Update notification preferences
  updateNotificationPreferences: protectedProcedure
    .input(z.object({
      newArticles: z.number().optional(),
      commentApproved: z.number().optional(),
      newComments: z.number().optional(),
      campaigns: z.number().optional(),
      systemNotifications: z.number().optional(),
      emailNotifications: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await updateNotificationPreferences(ctx.user.id, input);
      return { success: true };
    }),
});
