import { adminProcedure } from "../_core/trpc";
import { createEmailCampaign, getCampaigns, updateCampaignStatus, addCampaignRecipient } from "../db";
import { z } from "zod";

export const campaignsRouter = {
  create: adminProcedure
    .input(z.object({
      title: z.string().min(5),
      subject: z.string().min(5),
      content: z.string().min(20),
    }))
    .mutation(async ({ input, ctx }) => {
      return await createEmailCampaign({
        title: input.title,
        subject: input.subject,
        content: input.content,
        createdBy: ctx.user.id,
        status: 'draft',
      });
    }),

  list: adminProcedure.query(async () => {
    return await getCampaigns();
  }),

  updateStatus: adminProcedure
    .input(z.object({
      campaignId: z.number(),
      status: z.enum(['draft', 'scheduled', 'sent', 'failed']),
    }))
    .mutation(async ({ input }) => {
      await updateCampaignStatus(input.campaignId, input.status);
      return { success: true };
    }),

  addRecipient: adminProcedure
    .input(z.object({
      campaignId: z.number(),
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return await addCampaignRecipient(input.campaignId, input.userId);
    }),
};
