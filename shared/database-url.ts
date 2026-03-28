export function resolveDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const direct = (env.DATABASE_URL || "").trim();
  if (direct) return direct;

  const host = (env.DB_HOST || "").trim();
  const port = (env.DB_PORT || "3306").trim();
  const user = (env.DB_USER || "").trim();
  const pass = env.DB_PASSWORD || "";
  const name = (env.DB_NAME || "").trim();

  if (!host || !user || !name) {
    return "";
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(pass);
  return `mysql://${encodedUser}:${encodedPass}@${host}:${port}/${name}`;
}
