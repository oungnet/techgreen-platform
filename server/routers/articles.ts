import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createArticle,
  getArticleBySlug,
  getPublishedArticles,
  searchArticles,
  createComment,
  getArticleComments,
  createOrUpdateRating,
  getArticleRating,
} from "../db";

export const articlesRouter = router({
  // Get published articles with pagination
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const articles = await getPublishedArticles(input.limit, input.offset);
        return articles;
      } catch (error) {
        console.error("[Articles] Failed to list articles:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list articles",
        });
      }
    }),

  // Get article by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const article = await getArticleBySlug(input.slug);
        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }
        return article;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Articles] Failed to get article:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get article",
        });
      }
    }),

  // Search articles
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const results = await searchArticles(input.query, input.limit);
        return results;
      } catch (error) {
        console.error("[Articles] Failed to search articles:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search articles",
        });
      }
    }),

  // Create article (admin only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        category: z.string().min(1).max(100),
        coverImage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create articles",
        });
      }

      try {
        const article = await createArticle({
          ...input,
          authorId: ctx.user.id,
          published: 1,
        });

        if (!article) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create article",
          });
        }

        return article;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Articles] Failed to create article:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create article",
        });
      }
    }),

  // Get article rating
  getRating: publicProcedure
    .input(z.object({ articleId: z.number() }))
    .query(async ({ input }) => {
      try {
        const rating = await getArticleRating(input.articleId);
        return rating;
      } catch (error) {
        console.error("[Articles] Failed to get rating:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get rating",
        });
      }
    }),

  // Rate article
  rate: protectedProcedure
    .input(
      z.object({
        articleId: z.number(),
        score: z.number().int().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const rating = await createOrUpdateRating({
          articleId: input.articleId,
          userId: ctx.user.id,
          score: input.score,
        });

        if (!rating) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to rate article",
          });
        }

        return rating;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Articles] Failed to rate article:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rate article",
        });
      }
    }),

  // Get article comments
  getComments: publicProcedure
    .input(z.object({ articleId: z.number() }))
    .query(async ({ input }) => {
      try {
        const comments = await getArticleComments(input.articleId);
        return comments;
      } catch (error) {
        console.error("[Articles] Failed to get comments:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get comments",
        });
      }
    }),

  // Add comment
  addComment: protectedProcedure
    .input(
      z.object({
        articleId: z.number(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await createComment({
          articleId: input.articleId,
          userId: ctx.user.id,
          content: input.content,
          approved: 1,
        });

        if (!comment) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to add comment",
          });
        }

        return comment;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Articles] Failed to add comment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add comment",
        });
      }
    }),
});
