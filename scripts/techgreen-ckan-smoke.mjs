import fs from "node:fs";
import path from "node:path";

const apiBaseUrl = (process.env.API_BASE_URL || process.env.TECHGREEN_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");
const reportPath = process.env.CKAN_SMOKE_REPORT_PATH || "artifacts/techgreen-ckan-smoke-report.json";
const sessionCookie = (process.env.TECHGREEN_SESSION_COOKIE || "").trim();
const timeoutMs = Number(process.env.CKAN_SMOKE_TIMEOUT_MS || "15000");

const report = {
  generatedAt: new Date().toISOString(),
  apiBaseUrl,
  hasSessionCookie: Boolean(sessionCookie),
  checks: [],
  ok: false,
  error: null,
};

function writeReport() {
  const output = path.resolve(reportPath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
  console.log(`[techgreen-ckan-smoke] report=${output}`);
}

async function call(url, { expectStatus = 200, includeCookie = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(includeCookie && sessionCookie ? { Cookie: sessionCookie } : {}),
      },
      signal: controller.signal,
    });
    const body = await response.text();
    const ok = response.status === expectStatus;
    report.checks.push({
      url,
      expected: expectStatus,
      actual: response.status,
      ok,
      includeCookie,
    });
    if (!ok) {
      throw new Error(`status ${response.status}, expected ${expectStatus}, body=${body.slice(0, 220)}`);
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL or TECHGREEN_API_BASE_URL is required");
  }

  await call(`${apiBaseUrl}/api/health`, { expectStatus: 200 });
  await call(`${apiBaseUrl}/api/trpc/ckan.publicStatus`, { expectStatus: 200 });

  const datasetInput = encodeURIComponent(
    JSON.stringify({
      query: "",
      start: 0,
      rows: 5,
    })
  );
  const protectedUrl = `${apiBaseUrl}/api/trpc/ckan.datasets?input=${datasetInput}`;

  if (sessionCookie) {
    await call(protectedUrl, { expectStatus: 200, includeCookie: true });
  } else {
    // Without session, protected route should return UNAUTHORIZED.
    await call(protectedUrl, { expectStatus: 401, includeCookie: false });
  }

  report.ok = true;
  console.log("[techgreen-ckan-smoke] OK");
}

main()
  .catch((error) => {
    report.ok = false;
    report.error = error instanceof Error ? error.message : String(error);
    console.error("[techgreen-ckan-smoke] FAILED", report.error);
    process.exitCode = 1;
  })
  .finally(() => {
    writeReport();
  });
