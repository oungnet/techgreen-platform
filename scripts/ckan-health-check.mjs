const baseUrlRaw = (process.env.CKAN_BASE_URL || "https://data.go.th").trim();
const apiKey = (process.env.CKAN_API_KEY || "").trim();
const timeoutMs = Number(process.env.CKAN_HEALTH_TIMEOUT_MS || "15000");

const baseUrl = baseUrlRaw.includes("/api/3/action")
  ? baseUrlRaw.replace(/\/+$/, "")
  : `${baseUrlRaw.replace(/\/+$/, "")}/api/3/action`;

function withTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
}

async function callAction(action, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value));
    }
  }
  const url = `${baseUrl}/${action}?${query.toString()}`;
  const response = await withTimeout(url, {
    headers: {
      Accept: "application/json",
      ...(apiKey ? { Authorization: apiKey } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`${action} failed with HTTP ${response.status}`);
  }
  const payload = await response.json();
  if (!payload?.success) {
    throw new Error(`${action} returned success=false`);
  }
  return payload.result;
}

async function main() {
  const startedAt = new Date().toISOString();
  console.log(`[ckan-health] base=${baseUrl}`);
  console.log(`[ckan-health] apiKey=${apiKey ? "configured" : "not configured"}`);

  const site = await callAction("site_read");
  const packages = await callAction("package_search", { rows: 1, start: 0 });

  const report = {
    startedAt,
    checkedAt: new Date().toISOString(),
    baseUrl,
    hasApiKey: Boolean(apiKey),
    siteTitle: site?.title || "-",
    packageCount: Number(packages?.count || 0),
    ok: true,
  };

  console.log("[ckan-health] OK", JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error("[ckan-health] FAILED", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
