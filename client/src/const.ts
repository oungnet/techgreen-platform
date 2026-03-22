export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

let hasWarnedMissingAppUrl = false;

export function getLoginUrl() {
  const envBase = import.meta.env.VITE_APP_URL;
  const base = envBase || window.location.origin;

  if (!envBase && !hasWarnedMissingAppUrl) {
    hasWarnedMissingAppUrl = true;
    console.warn("[auth] VITE_APP_URL is not set. Falling back to window.location.origin.");
  }

  return `${base}/login`;
}
