import fs from "node:fs";
import path from "node:path";

const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const frontendUrl = (process.env.FRONTEND_URL || "").trim().replace(/\/+$/, "");
const apiBaseUrl = (process.env.API_BASE_URL || "").trim().replace(/\/+$/, "");
const reportPath = process.env.SMOKE_REPORT_PATH || "artifacts/smoke-report.json";
const report = {
  generatedAt: new Date().toISOString(),
  frontendUrl,
  apiBaseUrl,
  checks: [],
  ok: false,
  error: null,
};

if (!frontendUrl) {
  console.error("[smoke] FRONTEND_URL is required");
  process.exit(1);
}

if (!apiBaseUrl) {
  console.error("[smoke] API_BASE_URL is required");
  process.exit(1);
}

async function request(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "application/json,text/html",
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

function looksLikeHtml(body) {
  const normalized = body.toLowerCase();
  return normalized.includes("<!doctype html") || normalized.includes("<html");
}

async function assertStatusOk(url) {
  let lastError = null;

  for (let attempt = 1; attempt <= DEFAULT_RETRIES; attempt += 1) {
    try {
      const response = await request(url);
      if (!response.ok) {
        throw new Error(`Request failed ${response.status} ${response.statusText}`);
      }
      report.checks.push({
        url,
        status: response.status,
        ok: true,
        attempts: attempt,
      });
      console.log(`[smoke] OK ${response.status} ${url}`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt === DEFAULT_RETRIES) {
        report.checks.push({
          url,
          status: null,
          ok: false,
          attempts: attempt,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      if (attempt < DEFAULT_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${message} for ${url}`);
}

function writeReport() {
  const outputPath = path.resolve(reportPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
  console.log(`[smoke] Report written to ${outputPath}`);
}

async function assertFrontendRouteOk(url) {
  let lastError = null;

  for (let attempt = 1; attempt <= DEFAULT_RETRIES; attempt += 1) {
    try {
      const response = await request(url);
      const body = await response.text();

      const isOk = response.status === 200;
      const isSpaFallback = response.status === 404 && looksLikeHtml(body);

      if (!isOk && !isSpaFallback) {
        throw new Error(`Request failed ${response.status} ${response.statusText}`);
      }

      report.checks.push({
        url,
        status: response.status,
        ok: true,
        attempts: attempt,
        fallback: isSpaFallback,
      });
      console.log(
        `[smoke] OK ${response.status} ${url}${isSpaFallback ? " (SPA fallback)" : ""}`
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt === DEFAULT_RETRIES) {
        report.checks.push({
          url,
          status: null,
          ok: false,
          attempts: attempt,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      if (attempt < DEFAULT_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${message} for ${url}`);
}

async function main() {
  const frontendRoutes = [
    "",
    "/learning",
    "/open-data",
  ];

  for (const route of frontendRoutes) {
    await assertFrontendRouteOk(`${frontendUrl}${route}`);
  }

  await assertStatusOk(`${apiBaseUrl}/api/health`);

  const energyInput = encodeURIComponent(JSON.stringify({ start: 0, limit: 2, query: "" }));
  await assertStatusOk(`${apiBaseUrl}/api/trpc/govData.energyGroup?input=${energyInput}`);

  await assertStatusOk(`${apiBaseUrl}/api/trpc/govData.dashboard`);
  report.ok = true;
  console.log("[smoke] All checks passed");
}

main().catch((error) => {
  report.ok = false;
  report.error = error instanceof Error ? error.message : String(error);
  console.error("[smoke] FAILED:", report.error);
  writeReport();
  process.exit(1);
}).then(() => {
  writeReport();
});
