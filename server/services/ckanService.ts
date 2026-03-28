import { ENV } from "../_core/env";

const DEFAULT_CKAN_BASE_URL = "https://data.go.th/api/3/action";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = {
  expiresAt: number;
  payload: T;
};

const cache = new Map<string, CacheEntry<unknown>>();

type CkanActionResponse<T> = {
  help?: string;
  success?: boolean;
  result?: T;
  error?: unknown;
};

export type CkanDatasetSummary = {
  id: string;
  name: string;
  title: string;
  notes: string;
  organization: string;
  metadataModified: string;
  resourcesCount: number;
  tags: string[];
};

export type CkanDatasetListPayload = {
  total: number;
  start: number;
  rows: number;
  query: string;
  organization: string;
  datasets: CkanDatasetSummary[];
  fetchedAt: string;
  cached: boolean;
  sourceUrl: string;
};

export type CkanDatasetDetailPayload = {
  id: string;
  name: string;
  title: string;
  notes: string;
  organization: string;
  metadataCreated: string;
  metadataModified: string;
  resources: Array<{
    id: string;
    name: string;
    format: string;
    url: string;
    datastoreActive: boolean;
  }>;
  tags: string[];
  groups: string[];
  fetchedAt: string;
  cached: boolean;
  sourceUrl: string;
};

export type CkanHealthPayload = {
  status: "ok" | "degraded";
  baseUrl: string;
  hasApiKey: boolean;
  fetchedAt: string;
  packageCount: number;
  sourceUrl: string;
  error?: string;
};

function normalizeBaseUrl(raw: string): string {
  const input = (raw || "").trim();
  if (!input) return DEFAULT_CKAN_BASE_URL;
  if (input.includes("/api/3/action")) {
    return input.replace(/\/+$/, "");
  }
  return `${input.replace(/\/+$/, "")}/api/3/action`;
}

function getCacheTtlMs(): number {
  const raw = Number(ENV.ckanCacheTtlSec || 0);
  if (Number.isFinite(raw) && raw > 0) {
    return raw * 1000;
  }
  return DEFAULT_CACHE_TTL_MS;
}

function buildCacheKey(prefix: string, payload: unknown): string {
  return `${prefix}:${JSON.stringify(payload)}`;
}

function getCached<T>(key: string): T | null {
  const found = cache.get(key);
  if (!found) return null;
  if (found.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return found.payload as T;
}

function setCached<T>(key: string, payload: T) {
  cache.set(key, {
    payload,
    expiresAt: Date.now() + getCacheTtlMs(),
  });
}

function mapDatasetSummary(dataset: Record<string, any>): CkanDatasetSummary {
  const tags = Array.isArray(dataset?.tags)
    ? dataset.tags
        .map((tag: any) => String(tag?.display_name ?? tag?.name ?? "").trim())
        .filter(Boolean)
    : [];

  return {
    id: String(dataset?.id ?? ""),
    name: String(dataset?.name ?? ""),
    title: String(dataset?.title ?? dataset?.name ?? "Untitled"),
    notes: String(dataset?.notes ?? ""),
    organization: String(dataset?.organization?.title ?? dataset?.organization?.name ?? "-"),
    metadataModified: String(dataset?.metadata_modified ?? ""),
    resourcesCount: Array.isArray(dataset?.resources) ? dataset.resources.length : 0,
    tags,
  };
}

function mapDatasetDetail(dataset: Record<string, any>): Omit<CkanDatasetDetailPayload, "fetchedAt" | "cached" | "sourceUrl"> {
  const tags = Array.isArray(dataset?.tags)
    ? dataset.tags
        .map((tag: any) => String(tag?.display_name ?? tag?.name ?? "").trim())
        .filter(Boolean)
    : [];
  const groups = Array.isArray(dataset?.groups)
    ? dataset.groups
        .map((group: any) => String(group?.title ?? group?.name ?? "").trim())
        .filter(Boolean)
    : [];
  const resources = Array.isArray(dataset?.resources)
    ? dataset.resources.map((resource: any) => ({
        id: String(resource?.id ?? ""),
        name: String(resource?.name ?? resource?.id ?? "resource"),
        format: String(resource?.format ?? ""),
        url: String(resource?.url ?? ""),
        datastoreActive: Boolean(resource?.datastore_active),
      }))
    : [];

  return {
    id: String(dataset?.id ?? ""),
    name: String(dataset?.name ?? ""),
    title: String(dataset?.title ?? dataset?.name ?? "Untitled"),
    notes: String(dataset?.notes ?? ""),
    organization: String(dataset?.organization?.title ?? dataset?.organization?.name ?? "-"),
    metadataCreated: String(dataset?.metadata_created ?? ""),
    metadataModified: String(dataset?.metadata_modified ?? ""),
    resources,
    tags,
    groups,
  };
}

async function callCkanAction<T>(action: string, params: Record<string, string | number | undefined>) {
  const baseUrl = normalizeBaseUrl(ENV.ckanBaseUrl || DEFAULT_CKAN_BASE_URL);
  const sourceUrl = `${baseUrl}/${action}`;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      search.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (ENV.ckanApiKey) {
    headers.Authorization = ENV.ckanApiKey;
  }

  const response = await fetch(`${sourceUrl}?${search.toString()}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`CKAN action ${action} failed with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as CkanActionResponse<T>;
  if (!payload?.success || !payload.result) {
    throw new Error(`CKAN action ${action} returned unsuccessful payload`);
  }

  return {
    result: payload.result,
    sourceUrl,
  };
}

export async function fetchCkanHealth(): Promise<CkanHealthPayload> {
  const fetchedAt = new Date().toISOString();
  const baseUrl = normalizeBaseUrl(ENV.ckanBaseUrl || DEFAULT_CKAN_BASE_URL);
  try {
    const packageSearch = await callCkanAction<{ count?: number }>("package_search", { rows: 1, start: 0 });
    return {
      status: "ok",
      baseUrl,
      hasApiKey: Boolean(ENV.ckanApiKey),
      fetchedAt,
      packageCount: Number(packageSearch.result?.count ?? 0),
      sourceUrl: packageSearch.sourceUrl,
    };
  } catch (error) {
    return {
      status: "degraded",
      baseUrl,
      hasApiKey: Boolean(ENV.ckanApiKey),
      fetchedAt,
      packageCount: 0,
      sourceUrl: `${baseUrl}/package_search`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function fetchCkanDatasetList(input: {
  query?: string;
  start?: number;
  rows?: number;
  organization?: string;
}): Promise<CkanDatasetListPayload> {
  const query = (input.query || "").trim();
  const start = Math.max(0, input.start ?? 0);
  const rows = Math.min(50, Math.max(1, input.rows ?? 10));
  const organization = (input.organization || ENV.ckanDefaultOrganization || "").trim();
  const cacheKey = buildCacheKey("ckan:list", { query, start, rows, organization });

  const fromCache = getCached<CkanDatasetListPayload>(cacheKey);
  if (fromCache) {
    return {
      ...fromCache,
      cached: true,
    };
  }

  const fq = organization ? `organization:${organization}` : undefined;
  const response = await callCkanAction<{ count?: number; results?: Record<string, any>[] }>("package_search", {
    q: query,
    start,
    rows,
    fq,
  });

  const datasets = Array.isArray(response.result?.results)
    ? response.result.results.map(mapDatasetSummary)
    : [];
  const payload: CkanDatasetListPayload = {
    total: Number(response.result?.count ?? datasets.length),
    start,
    rows,
    query,
    organization,
    datasets,
    fetchedAt: new Date().toISOString(),
    cached: false,
    sourceUrl: response.sourceUrl,
  };

  setCached(cacheKey, payload);
  return payload;
}

export async function fetchCkanDatasetDetail(datasetIdOrName: string): Promise<CkanDatasetDetailPayload> {
  const id = datasetIdOrName.trim();
  if (!id) {
    throw new Error("datasetIdOrName is required");
  }
  const cacheKey = buildCacheKey("ckan:detail", { id });
  const fromCache = getCached<CkanDatasetDetailPayload>(cacheKey);
  if (fromCache) {
    return {
      ...fromCache,
      cached: true,
    };
  }

  const response = await callCkanAction<Record<string, any>>("package_show", { id });
  const mapped = mapDatasetDetail(response.result);
  const payload: CkanDatasetDetailPayload = {
    ...mapped,
    fetchedAt: new Date().toISOString(),
    cached: false,
    sourceUrl: response.sourceUrl,
  };
  setCached(cacheKey, payload);
  return payload;
}

export function invalidateCkanCache() {
  const before = cache.size;
  cache.clear();
  return {
    before,
    after: cache.size,
  };
}
