import { publicProcedure, router } from "../_core/trpc";
import { fetchEnergyGroupDatasets, fetchGovDashboardData } from "../services/govDataService";
import { z } from "zod";

export const govDataRouter = router({
  dashboard: publicProcedure.query(async () => {
    return fetchGovDashboardData();
  }),

  energyGroup: publicProcedure
    .input(
      z
        .object({
          start: z.number().int().min(0).default(0),
          limit: z.number().int().min(1).max(20).default(6),
          query: z.string().max(100).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return fetchEnergyGroupDatasets({
        start: input?.start ?? 0,
        limit: input?.limit ?? 6,
        query: input?.query ?? "",
      });
    }),
});
