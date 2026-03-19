import { adminProcedure } from "../_core/trpc";
import { getArticleStats, getCommentStats, getUserStats } from "../db";
import { z } from "zod";

export const analyticsRouter = {
  getStats: adminProcedure.query(async () => {
    const articleStats = await getArticleStats();
    const commentStats = await getCommentStats();
    const userStats = await getUserStats();

    return {
      articles: articleStats,
      comments: commentStats,
      users: userStats,
    };
  }),

  getArticleStats: adminProcedure.query(async () => {
    return await getArticleStats();
  }),

  getCommentStats: adminProcedure.query(async () => {
    return await getCommentStats();
  }),

  getUserStats: adminProcedure.query(async () => {
    return await getUserStats();
  }),
};
