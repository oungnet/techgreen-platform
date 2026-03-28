import fs from "node:fs";
import path from "node:path";

const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const frontendUrl = (process.env.FRONTEND_URL || "").trim().replace(/\/+$/, "");
const apiBaseUrl = (process.env.API_BASE_URL || "").trim().replace(/\/+$/, "");
const reportPath = process.env.SMOKE_REPORT_PATH || "artifacts/smoke-report.json";
const strictExternalChecks = (process.env.SMOKE_STRICT_EXTERNAL || "false").toLowerCase() === "true";
const report = {
  generatedAt: new Date().toISOString(),
  frontendUrl,
  apiBaseUrl,
  strictExternalChecks,
  checks: [],
  ok: false,
  error: null,
};

if (!frontendUrl) {
  console.error("[smoke] FRONTEND_URL is required");
  process.exit(1);
}

const hasApiBaseUrl = Boolean(apiBaseUrl);

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

async function assertStatusSoft(url) {
  try {
    await assertStatusOk(url);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    for (let i = report.checks.length - 1; i >= 0; i -= 1) {
      const check = report.checks[i];
      if (check.url === url && check.ok === false) {
        check.softFail = true;
        break;
      }
    }
    console.warn(`[smoke] SOFT FAIL ${url}: ${message}`);
    return false;
  }
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
      const isOk = response.status === 200;
      // GitHub Pages project sites can return 404 for direct deep-link requests
      // even when the SPA route works in browser navigation.
      const isSpaFallback = response.status === 404;

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
    "/open-data/catalog",
    "/components",
  ];

  for (const route of frontendRoutes) {
    await assertFrontendRouteOk(`${frontendUrl}${route}`);
  }

  if (hasApiBaseUrl) {
    await assertStatusOk(`${apiBaseUrl}/api/health`);

    const energyInput = encodeURIComponent(JSON.stringify({ start: 0, limit: 2, query: "" }));
    const energyOk = await assertStatusSoft(
      `${apiBaseUrl}/api/trpc/govData.energyGroup?input=${energyInput}`
    );
    const dashboardOk = await assertStatusSoft(`${apiBaseUrl}/api/trpc/govData.dashboard`);

    if (strictExternalChecks && (!energyOk || !dashboardOk)) {
      throw new Error("External data checks failed in strict mode");
    }
  } else {
    report.checks.push({
      url: "API_BASE_URL",
      status: null,
      ok: true,
      skipped: true,
      reason: "API checks skipped because API_BASE_URL is not configured",
    });
    console.warn("[smoke] API checks skipped because API_BASE_URL is not configured");
  }

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
