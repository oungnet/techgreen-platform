import { z } from "zod";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  fetchCkanDatasetDetail,
  fetchCkanDatasetList,
  fetchCkanHealth,
  invalidateCkanCache,
} from "../services/ckanService";

export const ckanRouter = router({
  publicStatus: publicProcedure.query(async () => {
    return fetchCkanHealth();
  }),

  datasets: protectedProcedure
    .input(
      z
        .object({
          query: z.string().max(160).optional(),
          start: z.number().int().min(0).default(0),
          rows: z.number().int().min(1).max(50).default(10),
          organization: z.string().max(120).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return fetchCkanDatasetList({
        query: input?.query ?? "",
        start: input?.start ?? 0,
        rows: input?.rows ?? 10,
        organization: input?.organization ?? "",
      });
    }),

  datasetDetail: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1).max(160),
      })
    )
    .query(async ({ input }) => {
      return fetchCkanDatasetDetail(input.id);
    }),

  invalidateCache: adminProcedure.mutation(async () => {
    return invalidateCkanCache();
  }),
});
