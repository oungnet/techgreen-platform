export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

let hasWarnedMissingAppUrl = false;

/**
 * Get the base path for the application.
 * On GitHub Pages project sites, this will be /techgreen-platform/
 * On regular deployments, this will be /
 */
function getBasePath() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  return baseUrl.replace(/\/$/, ""); // Remove trailing slash
}

export function getLoginUrl() {
  const envBase = import.meta.env.VITE_APP_URL;
  
  if (envBase) {
    // If VITE_APP_URL is set, use it (for external redirects)
    return `${envBase}/login`;
  }
  
  // Otherwise, use window.location.origin + base path (for GitHub Pages)
  const basePath = getBasePath();
  const base = window.location.origin + basePath;
  
  if (!hasWarnedMissingAppUrl) {
    hasWarnedMissingAppUrl = true;
    console.warn("[auth] VITE_APP_URL is not set. Using window.location.origin + BASE_URL.");
  }

  return `${base}/login`;
}

export function getRegisterUrl() {
  const envBase = import.meta.env.VITE_APP_URL;
  
  if (envBase) {
    return `${envBase}/register`;
  }
  
  const basePath = getBasePath();
  const base = window.location.origin + basePath;
  return `${base}/register`;
}

export function getProfileUrl() {
  const envBase = import.meta.env.VITE_APP_URL;
  
  if (envBase) {
    return `${envBase}/profile`;
  }
  
  const basePath = getBasePath();
  const base = window.location.origin + basePath;
  return `${base}/profile`;
}
