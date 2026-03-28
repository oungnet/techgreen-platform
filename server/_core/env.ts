import { resolveDatabaseUrl } from "../../shared/database-url";

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  sessionSecret: process.env.SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
  databaseUrl: resolveDatabaseUrl(process.env),
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  facebookAppId: process.env.FACEBOOK_APP_ID ?? "",
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET ?? "",
  dataGoThApiKey: process.env.DATA_GO_TH_API_KEY ?? "",
  dataGoThBaseUrl: process.env.DATA_GO_TH_BASE_URL ?? "",
  dataGoThAgricultureResourceId: process.env.DATA_GO_TH_AGRICULTURE_RESOURCE_ID ?? "",
  dataGoThWeatherResourceId: process.env.DATA_GO_TH_WEATHER_RESOURCE_ID ?? "",
  dataGoThAllowPublicFallback:
    (process.env.DATA_GO_TH_ALLOW_PUBLIC_FALLBACK ?? "false").toLowerCase() === "true",
  ckanBaseUrl: process.env.CKAN_BASE_URL ?? "",
  ckanApiKey: process.env.CKAN_API_KEY ?? "",
  ckanDefaultOrganization: process.env.CKAN_DEFAULT_ORGANIZATION ?? "",
  ckanCacheTtlSec: Number(process.env.CKAN_CACHE_TTL_SEC ?? "300"),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  frontendOrigins: process.env.FRONTEND_ORIGINS ?? "",
  sessionCookieSameSite: process.env.SESSION_COOKIE_SAMESITE ?? "",
};
