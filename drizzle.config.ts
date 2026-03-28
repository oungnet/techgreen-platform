import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { resolveDatabaseUrl } from "./shared/database-url";

const connectionString = resolveDatabaseUrl(process.env);
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required to run drizzle commands (or set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)"
  );
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
