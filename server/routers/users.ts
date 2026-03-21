import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users, articles, comments, ratings, files } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export type UserActivity = {
  id: number;
  title: string;
  type: "article" | "comment" | "rating";
  createdAt: Date | unknown;
};

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

  // Get user activity (recent articles, comments, ratings)
  getActivity: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Get recent articles by user
        const userArticles = await db
          .select({
            id: articles.id,
            title: articles.title,
            createdAt: articles.createdAt,
          })
          .from(articles)
          .where(eq(articles.authorId, ctx.user.id))
          .orderBy(desc(articles.createdAt))
          .limit(input.limit);

        // Get recent comments by user
        const userComments = await db
          .select({
            id: comments.id,
            title: articles.title,
            createdAt: comments.createdAt,
          })
          .from(comments)
          .innerJoin(articles, eq(comments.articleId, articles.id))
          .where(eq(comments.userId, ctx.user.id))
          .orderBy(desc(comments.createdAt))
          .limit(input.limit);

        // Get recent ratings by user
        const userRatings = await db
          .select({
            id: ratings.id,
            title: articles.title,
            createdAt: ratings.createdAt,
          })
          .from(ratings)
          .innerJoin(articles, eq(ratings.articleId, articles.id))
          .where(eq(ratings.userId, ctx.user.id))
          .orderBy(desc(ratings.createdAt))
          .limit(input.limit);

        // Combine and sort all activities by date
        const allActivities = [
          ...userArticles.map(a => ({ ...a, type: "article" as const, createdAt: a.createdAt })),
          ...userComments.map(c => ({ ...c, type: "comment" as const, createdAt: c.createdAt })),
          ...userRatings.map(r => ({ ...r, type: "rating" as const, createdAt: r.createdAt })),
        ]
          .sort((a, b) => {
            const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt as unknown as string).getTime();
            const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt as unknown as string).getTime();
            return timeB - timeA;
          })
          .slice(0, input.limit);

        return allActivities;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Users] Failed to get activity:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get activity",
        });
      }
    }),

  // Get user statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Count user's articles
      const articleCount = await db
        .select({ count: articles.id })
        .from(articles)
        .where(eq(articles.authorId, ctx.user.id));

      // Count user's comments
      const commentCount = await db
        .select({ count: comments.id })
        .from(comments)
        .where(eq(comments.userId, ctx.user.id));

      // Count user's ratings
      const ratingCount = await db
        .select({ count: ratings.id })
        .from(ratings)
        .where(eq(ratings.userId, ctx.user.id));

      // Count user's files
      const fileCount = await db
        .select({ count: files.id })
        .from(files)
        .where(eq(files.userId, ctx.user.id));

      return {
        articlesCount: articleCount[0]?.count || 0,
        commentsCount: commentCount[0]?.count || 0,
        ratingsCount: ratingCount[0]?.count || 0,
        filesCount: fileCount[0]?.count || 0,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("[Users] Failed to get stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get stats",
      });
    }
  }),
});
