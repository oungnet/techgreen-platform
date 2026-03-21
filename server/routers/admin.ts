import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { articles, comments, users } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const adminRouter = router({
  // Article Management
  articles: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        try {
          const result = await db
            .select({
              id: articles.id,
              title: articles.title,
              slug: articles.slug,
              category: articles.category,
              published: articles.published,
              viewCount: articles.viewCount,
              createdAt: articles.createdAt,
              authorId: articles.authorId,
            })
            .from(articles)
            .orderBy(desc(articles.createdAt))
            .limit(input.limit)
            .offset(input.offset);
          return result;
        } catch (error) {
          console.error("[Admin] Failed to list articles:", error);
          throw error;
        }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          published: z.boolean().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          const updateData: Record<string, any> = {};
          if (input.title) updateData.title = input.title;
          if (input.content) updateData.content = input.content;
          if (input.excerpt) updateData.excerpt = input.excerpt;
          if (input.published !== undefined) updateData.published = input.published ? 1 : 0;
          if (input.category) updateData.category = input.category;

          await db.update(articles).set(updateData).where(eq(articles.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("[Admin] Failed to update article:", error);
          throw error;
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          await db.delete(articles).where(eq(articles.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("[Admin] Failed to delete article:", error);
          throw error;
        }
      }),

    getStats: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { total: 0, published: 0, draft: 0 };

      try {
        const total = await db.select().from(articles);
        const published = total.filter((a: any) => a.published === 1);
        return {
          total: total.length,
          published: published.length,
          draft: total.length - published.length,
        };
      } catch (error) {
        console.error("[Admin] Failed to get article stats:", error);
        return { total: 0, published: 0, draft: 0 };
      }
    }),
  }),

  // Comment Management
  comments: router({
    list: adminProcedure
      .input(
        z.object({
          approved: z.boolean().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        try {
          const allComments = await db.select().from(comments).orderBy(desc(comments.createdAt));
          
          let filtered = allComments;
          if (input.approved !== undefined) {
            const approvedValue = input.approved ? 1 : 0;
            filtered = allComments.filter((c: any) => c.approved === approvedValue);
          }

          return filtered.slice(input.offset, input.offset + input.limit);
        } catch (error) {
          console.error("[Admin] Failed to list comments:", error);
          throw error;
        }
      }),

    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          await db.update(comments).set({ approved: 1 }).where(eq(comments.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("[Admin] Failed to approve comment:", error);
          throw error;
        }
      }),

    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          await db.update(comments).set({ approved: 0 }).where(eq(comments.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("[Admin] Failed to reject comment:", error);
          throw error;
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          await db.delete(comments).where(eq(comments.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("[Admin] Failed to delete comment:", error);
          throw error;
        }
      }),

    getStats: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { total: 0, approved: 0, pending: 0 };

      try {
        const total = await db.select().from(comments);
        const approved = total.filter((c: any) => c.approved === 1);
        return {
          total: total.length,
          approved: approved.length,
          pending: total.length - approved.length,
        };
      } catch (error) {
        console.error("[Admin] Failed to get comment stats:", error);
        return { total: 0, approved: 0, pending: 0 };
      }
    }),
  }),

  // User Management
  usersMgmt: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        try {
          const result = await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
              role: users.role,
              createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.createdAt))
            .limit(input.limit)
            .offset(input.offset);
          return result;
        } catch (error) {
          console.error("[Admin] Failed to list users:", error);
          throw error;
        }
      }),

    updateRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
          return { success: true };
        } catch (error) {
          console.error("[Admin] Failed to update user role:", error);
          throw error;
        }
      }),
  }),

  // Dashboard Statistics
  dashboard: router({
    stats: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db)
        return { totalUsers: 0, totalArticles: 0, totalComments: 0, pendingComments: 0 };

      try {
        const allUsers = await db.select().from(users);
        const allArticles = await db.select().from(articles);
        const allComments = await db.select().from(comments);
        const pendingComments = allComments.filter((c: any) => c.approved === 0);

        return {
          totalUsers: allUsers.length,
          totalArticles: allArticles.length,
          totalComments: allComments.length,
          pendingComments: pendingComments.length,
        };
      } catch (error) {
        console.error("[Admin] Failed to get dashboard stats:", error);
        return { totalUsers: 0, totalArticles: 0, totalComments: 0, pendingComments: 0 };
      }
    }),
  }),
});
