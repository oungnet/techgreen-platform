import axios from "axios";
import { ENV } from "../_core/env";

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_BASE_URL = "https://api.data.go.th/open-data";

type GovCacheEntry = {
  expiresAt: number;
  payload: unknown;
  fetchedAt: string;
};

const govCache = new Map<string, GovCacheEntry>();

export type GovDatasetResponse = {
  records: Record<string, unknown>[];
  fetchedAt: string;
  cached: boolean;
  sourceUrl: string;
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
  if (response.status >= 300 && response.status < 400) {
    throw new Error("data.go.th redirected request (likely token/service authorization issue)");
  }

  const contentType = String(response.headers["content-type"] ?? "").toLowerCase();
  if (contentType.includes("text/html")) {
    throw new Error("data.go.th returned HTML instead of JSON (token may be invalid or not subscribed to this service)");
  }

  if (typeof response.data === "string" && response.data.trim().startsWith("<!DOCTYPE html")) {
    throw new Error("data.go.th returned HTML page instead of API payload");
  }
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
      sourceUrl: `${ENV.dataGoThBaseUrl || DEFAULT_BASE_URL}/${cacheKey}`,
    };
  }

  const apiKey = ENV.dataGoThApiKey;
  if (!apiKey) {
    throw new Error("DATA_GO_TH_API_KEY is missing");
  }

  const baseUrl = (ENV.dataGoThBaseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const sourceUrl = `${baseUrl}/${cacheKey}`;

  const response = await axios.get(sourceUrl, {
    headers: {
      "api-key": apiKey,
      Accept: "application/json",
    },
    params: {
      limit: 100,
    },
    timeout: 20000,
    maxRedirects: 0,
    validateStatus: () => true,
  });

  assertApiResponse({
    status: response.status,
    headers: response.headers as Record<string, unknown>,
    data: response.data,
  });

  if (response.status >= 400) {
    throw new Error(`data.go.th request failed with status ${response.status}`);
  }

  const fetchedAt = new Date(now).toISOString();
  govCache.set(cacheKey, {
    payload: response.data,
    expiresAt: now + ONE_HOUR_MS,
    fetchedAt,
  });

  return {
    records: extractRecords(response.data),
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
  const [agriculture, weather] = await Promise.all([
    fetchGovData("888c3098-9040-4202-9014-9989a5342a77"),
    fetchGovData("f9293671-6101-447a-8f74-8d4841d6b059"),
  ]);

  return {
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
