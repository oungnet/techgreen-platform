import { adminProcedure, protectedProcedure } from "../_core/trpc";
import { flagComment, getModerationQueue, approveModerationItem, rejectModerationItem } from "../db";
import { z } from "zod";

export const moderationRouter = {
  flagComment: protectedProcedure
    .input(z.object({
      commentId: z.number(),
      reason: z.string().min(10),
    }))
    .mutation(async ({ input, ctx }) => {
      return await flagComment(input.commentId, input.reason, ctx.user.id);
    }),

  getQueue: adminProcedure.query(async () => {
    return await getModerationQueue();
  }),

  approve: adminProcedure
    .input(z.object({ moderationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await approveModerationItem(input.moderationId, ctx.user.id);
      return { success: true };
    }),

  reject: adminProcedure
    .input(z.object({ moderationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await rejectModerationItem(input.moderationId, ctx.user.id);
      return { success: true };
    }),
};
