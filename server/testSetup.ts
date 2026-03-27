// Ensure modules that import `server/db.ts` do not crash in CI when DB env is missing.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://root:password@127.0.0.1:3306/techgreen_test";
}
