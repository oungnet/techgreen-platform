import "dotenv/config";
import mysql from "mysql2/promise";

const dbUrl = process.env.DATABASE_URL || "";

if (!dbUrl) {
  console.error("[db-check] DATABASE_URL is missing");
  process.exit(1);
}

try {
  const conn = await mysql.createConnection(dbUrl);
  const [rows] = await conn.query("SELECT 1 AS ok");
  await conn.end();
  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
  console.log("[db-check] OK", first);
} catch (error) {
  const err = error;
  console.error("[db-check] FAILED", err?.code || err?.message || String(err));
  process.exit(1);
}
