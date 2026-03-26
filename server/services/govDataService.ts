import axios from "axios";
import { ENV } from "../_core/env";

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_BASE_URL = "https://data.go.th/api/3/action";

type GovCacheEntry = {
  expiresAt: number;
  payload: unknown;
  fetchedAt: string;
};

const govCache = new Map<string, GovCacheEntry>();

function resolveCkanBaseUrl() {
  const raw = (ENV.dataGoThBaseUrl || DEFAULT_BASE_URL).trim();
  if (!raw) return DEFAULT_BASE_URL;

  // Backward compatibility: old env values may point to open-data or direct datastore endpoint.
  if (raw.includes("/get-ckan") || raw.endsWith("/datastore_search") || raw.includes("/open-data")) {
    return DEFAULT_BASE_URL;
  }

  return raw.replace(/\/+$/, "");
}

export type GovDatasetResponse = {
  records: Record<string, unknown>[];
  fetchedAt: string;
  cached: boolean;
  sourceUrl: string;
};

type CkanResponse<T> = {
  success?: boolean;
  result?: T;
};

function parseJsonSafely(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function extractRecords(raw: unknown): Record<string, unknown>[] {
  const parsed = parseJsonSafely(raw);
  if (!parsed || typeof parsed !== "object") return [];

  const asRecord = parsed as Record<string, any>;
  const candidates = [
    asRecord.result?.records,
    asRecord.result?.data,
    asRecord.records,
    asRecord.data,
    asRecord.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is Record<string, unknown> => item && typeof item === "object");
    }
  }

  return [];
}

function assertApiResponse(response: { status: number; headers: Record<string, unknown>; data: unknown }) {
  const contentType = String(response.headers["content-type"] ?? "").toLowerCase();
  if (contentType.includes("text/html")) {
    throw new Error("data.go.th returned HTML instead of JSON (token may be invalid or not subscribed to this service)");
  }

  if (typeof response.data === "string" && response.data.trim().startsWith("<!DOCTYPE html")) {
    throw new Error("data.go.th returned HTML page instead of API payload");
  }
}

async function ckanGet<T>(action: string, params: Record<string, unknown>) {
  const apiKey = ENV.dataGoThApiKey;
  const baseUrl = resolveCkanBaseUrl();
  const url = `${baseUrl}/${action}`;

  const request = async (withApiKey: boolean) =>
    axios.get(url, {
      headers: {
        ...(withApiKey && apiKey ? { "api-key": apiKey } : {}),
        Accept: "application/json",
      },
      params,
      timeout: 20000,
      validateStatus: () => true,
    });

  let response = await request(true);

  try {
    assertApiResponse({
      status: response.status,
      headers: response.headers as Record<string, unknown>,
      data: response.data,
    });
  } catch (error) {
    // Some endpoints return HTML when key is not subscribed; retry publicly once.
    if (apiKey) {
      response = await request(false);
      assertApiResponse({
        status: response.status,
        headers: response.headers as Record<string, unknown>,
        data: response.data,
      });
    } else {
      throw error;
    }
  }

  if (response.status >= 400) {
    throw new Error(`data.go.th ${action} failed with status ${response.status}`);
  }

  const payload = response.data as CkanResponse<T>;
  if (!payload?.success) {
    throw new Error(`data.go.th ${action} returned unsuccessful response`);
  }

  return {
    data: payload,
    sourceUrl: url,
  };
}

function pickResourceIdFromPackage(result: Record<string, any> | undefined): string | null {
  const resources = Array.isArray(result?.resources) ? result.resources : [];
  const normalized = resources
    .map((resource: any) => ({
      id: String(resource?.id ?? "").trim(),
      datastoreActive: Boolean(resource?.datastore_active),
      format: String(resource?.format ?? "").toLowerCase(),
    }))
    .filter((resource: { id: string }) => Boolean(resource.id));

  const preferred = normalized.find((resource: { datastoreActive: boolean }) => resource.datastoreActive);
  if (preferred) return preferred.id;

  const dataFormat = normalized.find((resource: { format: string }) =>
    ["csv", "json", "xlsx", "xls"].some(fmt => resource.format.includes(fmt))
  );
  if (dataFormat) return dataFormat.id;

  return normalized[0]?.id ?? null;
}

export async function fetchGovData(datasetId: string): Promise<GovDatasetResponse> {
  const cacheKey = datasetId.trim();
  if (!cacheKey) {
    throw new Error("datasetId is required");
  }

  const now = Date.now();
  const cached = govCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return {
      records: extractRecords(cached.payload),
      fetchedAt: cached.fetchedAt,
      cached: true,
      sourceUrl: `${resolveCkanBaseUrl()}/datastore_search`,
    };
  }

  let records: Record<string, unknown>[] = [];
  let sourceUrl = `${resolveCkanBaseUrl()}/datastore_search`;

  try {
    const packageShow = await ckanGet<Record<string, any>>("package_show", { id: cacheKey });
    const resourceId = pickResourceIdFromPackage(packageShow.data.result);

    if (!resourceId) {
      throw new Error(`No CKAN resource found for dataset ${cacheKey}`);
    }

    const datastore = await ckanGet<Record<string, unknown>[]>("datastore_search", {
      resource_id: resourceId,
      limit: 100,
    });

    records = extractRecords(datastore.data);
    sourceUrl = datastore.sourceUrl;
  } catch {
    // Fallback: some IDs may already point directly to CKAN resource_id.
    const datastore = await ckanGet<Record<string, unknown>[]>("datastore_search", {
      resource_id: cacheKey,
      limit: 100,
    });
    records = extractRecords(datastore.data);
    sourceUrl = datastore.sourceUrl;
  }

  const fetchedAt = new Date(now).toISOString();
  govCache.set(cacheKey, {
    payload: records,
    expiresAt: now + ONE_HOUR_MS,
    fetchedAt,
  });

  return {
    records,
    fetchedAt,
    cached: false,
    sourceUrl,
  };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function pickNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value !== null) return value;
  }
  return null;
}

export type PriceTrendPoint = {
  label: string;
  value: number;
};

export type WeatherWidget = {
  title: string;
  description: string;
  value?: string;
};

export type GovDashboardPayload = {
  status?: "ok" | "degraded";
  errors?: string[];
  agriculture: {
    fetchedAt: string;
    cached: boolean;
    rawCount: number;
    trend: PriceTrendPoint[];
    preview: Record<string, unknown>[];
    sourceUrl: string;
  };
  weather: {
    fetchedAt: string;
    cached: boolean;
    rawCount: number;
    widgets: WeatherWidget[];
    preview: Record<string, unknown>[];
    sourceUrl: string;
  };
};

export function normalizeAgriculture(records: Record<string, unknown>[]): PriceTrendPoint[] {
  return records
    .map((record, index) => {
      const label =
        pickString(record, ["date", "วันที่", "day", "record_date", "create_date"]) ??
        `รายการ ${index + 1}`;
      const value = pickNumber(record, ["price", "ราคา", "avg_price", "value", "amount"]);
      return value !== null ? { label, value } : null;
    })
    .filter((item): item is PriceTrendPoint => item !== null)
    .slice(0, 30)
    .reverse();
}

export function normalizeWeather(records: Record<string, unknown>[]): WeatherWidget[] {
  if (!records.length) {
    return [
      {
        title: "สถานะข้อมูล",
        description: "ไม่พบข้อมูลพยากรณ์อากาศจาก API",
      },
    ];
  }

  const current = records[0];
  const location = pickString(current, ["province", "area", "location", "station", "จังหวัด"]) ?? "พื้นที่ล่าสุด";
  const condition = pickString(current, ["condition", "weather", "forecast", "summary", "สภาพอากาศ"]) ?? "-";
  const temp = pickNumber(current, ["temperature", "temp", "temp_c", "อุณหภูมิ"]);
  const humidity = pickNumber(current, ["humidity", "ความชื้น"]);

  return [
    {
      title: "พื้นที่",
      description: location,
    },
    {
      title: "สภาพอากาศ",
      description: condition,
    },
    {
      title: "อุณหภูมิ",
      description: temp !== null ? `${temp.toFixed(1)} °C` : "ไม่ระบุ",
      value: temp !== null ? temp.toFixed(1) : undefined,
    },
    {
      title: "ความชื้น",
      description: humidity !== null ? `${humidity.toFixed(0)}%` : "ไม่ระบุ",
      value: humidity !== null ? humidity.toFixed(0) : undefined,
    },
  ];
}

export async function fetchGovDashboardData(): Promise<GovDashboardPayload> {
  const [agricultureResult, weatherResult] = await Promise.allSettled([
    fetchGovData("888c3098-9040-4202-9014-9989a5342a77"),
    fetchGovData("f9293671-6101-447a-8f74-8d4841d6b059"),
  ]);

  const errors: string[] = [];
  const nowIso = new Date().toISOString();

  const agriculture =
    agricultureResult.status === "fulfilled"
      ? agricultureResult.value
      : (() => {
          errors.push(`Agriculture API: ${agricultureResult.reason instanceof Error ? agricultureResult.reason.message : "unknown error"}`);
          return {
            fetchedAt: nowIso,
            cached: false,
            records: [] as Record<string, unknown>[],
            sourceUrl: `${resolveCkanBaseUrl()}/datastore_search`,
          };
        })();

  const weather =
    weatherResult.status === "fulfilled"
      ? weatherResult.value
      : (() => {
          errors.push(`Weather API: ${weatherResult.reason instanceof Error ? weatherResult.reason.message : "unknown error"}`);
          return {
            fetchedAt: nowIso,
            cached: false,
            records: [] as Record<string, unknown>[],
            sourceUrl: `${resolveCkanBaseUrl()}/datastore_search`,
          };
        })();

  return {
    status: errors.length ? "degraded" : "ok",
    errors,
    agriculture: {
      fetchedAt: agriculture.fetchedAt,
      cached: agriculture.cached,
      rawCount: agriculture.records.length,
      trend: normalizeAgriculture(agriculture.records),
      preview: agriculture.records.slice(0, 5),
      sourceUrl: agriculture.sourceUrl,
    },
    weather: {
      fetchedAt: weather.fetchedAt,
      cached: weather.cached,
      rawCount: weather.records.length,
      widgets: normalizeWeather(weather.records),
      preview: weather.records.slice(0, 5),
      sourceUrl: weather.sourceUrl,
    },
  };
}

type EnergyResource = {
  id: string;
  name: string;
  format: string;
  url: string;
};

export type EnergyDataset = {
  id: string;
  name: string;
  title: string;
  datasetUrl: string;
  notes: string;
  organization: string;
  metadataModified: string;
  resourceCount: number;
  resources: EnergyResource[];
  sampleRows: Record<string, unknown>[];
};

export type EnergyGroupPayload = {
  group: string;
  fetchedAt: string;
  cached: boolean;
  total: number;
  start: number;
  limit: number;
  query: string;
  datasets: EnergyDataset[];
};

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

async function fetchResourceSample(url: string, format: string): Promise<Record<string, unknown>[]> {
  try {
    const response = await axios.get(url, {
      timeout: 12000,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    if (response.status >= 400) return [];

    const buffer = Buffer.from(response.data ?? []);
    let text = new TextDecoder("utf-8").decode(buffer);
    if ((text.match(/�/g) ?? []).length > 5) {
      try {
        text = new TextDecoder("windows-874").decode(buffer);
      } catch {
        // Keep UTF-8 decoded text when legacy decoder is unavailable.
      }
    }
    text = text.trim();
    if (!text) return [];

    const normalizedFormat = format.toLowerCase();

    if (normalizedFormat.includes("json")) {
      const parsed = parseJsonSafely(text);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is Record<string, unknown> => item && typeof item === "object")
          .slice(0, 5);
      }
      const records = extractRecords(parsed);
      return records.slice(0, 5);
    }

    if (normalizedFormat.includes("csv")) {
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (lines.length < 2) return [];
      const headers = splitCsvLine(lines[0]);
      const rows: Record<string, unknown>[] = [];

      for (const line of lines.slice(1, 6)) {
        const cols = splitCsvLine(line);
        const row: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          row[header || `col_${index + 1}`] = cols[index] ?? "";
        });
        rows.push(row);
      }
      return rows;
    }

    return [];
  } catch {
    return [];
  }
}

export async function fetchEnergyGroupDatasets(input: {
  start?: number;
  limit?: number;
  query?: string;
}): Promise<EnergyGroupPayload> {
  const start = Math.max(0, input.start ?? 0);
  const limit = Math.min(20, Math.max(1, input.limit ?? 6));
  const query = (input.query ?? "").trim();
  const cacheKey = `energy:${start}:${limit}:${query.toLowerCase()}`;
  const now = Date.now();
  const cached = govCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.payload as EnergyGroupPayload;
  }

  const apiKey = ENV.dataGoThApiKey;
  const ckanUrl = `${resolveCkanBaseUrl()}/package_search`;
  const response = await axios.get(ckanUrl, {
    headers: apiKey ? { "api-key": apiKey } : undefined,
    params: {
      fq: "groups:energy",
      rows: limit,
      start,
      q: query || undefined,
    },
    timeout: 15000,
  });

  const result = response.data?.result;
  const results = Array.isArray(result?.results) ? result.results : [];

  const datasets: EnergyDataset[] = [];

  for (const dataset of results) {
    const resourcesRaw = Array.isArray(dataset?.resources) ? dataset.resources : [];
    const resources: EnergyResource[] = resourcesRaw
      .map((resource: any) => ({
        id: String(resource?.id ?? ""),
        name: String(resource?.name ?? resource?.id ?? "resource"),
        format: String(resource?.format ?? "unknown"),
        url: String(resource?.url ?? ""),
      }))
      .filter((resource: EnergyResource) => Boolean(resource.id && resource.url))
      .slice(0, 6);

    const previewResource = resources.find((resource) => {
      const format = resource.format.toLowerCase();
      return format.includes("csv") || format.includes("json");
    });

    const sampleRows = previewResource
      ? await fetchResourceSample(previewResource.url, previewResource.format)
      : [];

    datasets.push({
      id: String(dataset?.id ?? ""),
      name: String(dataset?.name ?? ""),
      title: String(dataset?.title ?? dataset?.name ?? "Untitled dataset"),
      datasetUrl: `https://data.go.th/dataset/${String(dataset?.name ?? "")}`,
      notes: String(dataset?.notes ?? ""),
      organization: String(dataset?.organization?.title ?? dataset?.organization?.name ?? "-"),
      metadataModified: String(dataset?.metadata_modified ?? ""),
      resourceCount: resources.length,
      resources,
      sampleRows,
    });
  }

  const payload: EnergyGroupPayload = {
    group: "energy",
    fetchedAt: new Date(now).toISOString(),
    cached: false,
    total: Number(result?.count ?? datasets.length),
    start,
    limit,
    query,
    datasets,
  };

  govCache.set(cacheKey, {
    payload,
    fetchedAt: payload.fetchedAt,
    expiresAt: now + ONE_HOUR_MS,
  });

  return payload;
}
