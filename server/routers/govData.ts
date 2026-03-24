import { publicProcedure, router } from "../_core/trpc";
import { fetchGovDashboardData } from "../services/govDataService";

export const govDataRouter = router({
  dashboard: publicProcedure.query(async () => {
    return fetchGovDashboardData();
  }),
});
