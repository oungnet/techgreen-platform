import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function DetailSkeleton() {
  return (
    <Card className="space-y-3 p-5">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-24 w-full" />
    </Card>
  );
}

export default function OpenDataCatalog() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedDatasetId, setSelectedDatasetId] = useState("");

  const statusQuery = trpc.ckan.publicStatus.useQuery();
  const datasetsQuery = trpc.ckan.datasets.useQuery(
    { query, start: 0, rows: 12 },
    { enabled: Boolean(user) }
  );
  const detailQuery = trpc.ckan.datasetDetail.useQuery(
    { id: selectedDatasetId },
    { enabled: Boolean(user && selectedDatasetId) }
  );

  const datasets = useMemo(() => datasetsQuery.data?.datasets ?? [], [datasetsQuery.data]);

  return (
    <div className="bg-slate-50 py-6">
      <div className="container space-y-5">
        <Card className="space-y-2 rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-medium text-emerald-700">CKAN Open Data Catalog</p>
          <h1 className="text-2xl font-bold text-slate-900">ศูนย์ข้อมูลเปิด (ตัวอย่างเชื่อมตรง CKAN API)</h1>
          <p className="text-sm text-slate-600">
            หน้านี้เรียก `ckan.publicStatus`, `ckan.datasets`, `ckan.datasetDetail` จาก backend ของ TechGreen โดยมีระบบ cache และสิทธิ์ผู้ใช้
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">Status: {statusQuery.data?.status ?? "loading"}</Badge>
            <Badge variant="outline">API Key: {statusQuery.data?.hasApiKey ? "configured" : "not configured"}</Badge>
            <Badge variant="outline">Packages: {statusQuery.data?.packageCount ?? 0}</Badge>
          </div>
          {statusQuery.data?.error && (
            <p className="text-xs text-amber-700">CKAN status warning: {statusQuery.data.error}</p>
          )}
        </Card>

        {loading ? (
          <Card className="p-5">
            <Skeleton className="h-5 w-40" />
          </Card>
        ) : !user ? (
          <Card className="space-y-3 border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">ต้องเข้าสู่ระบบก่อนใช้งาน Catalog</h2>
            <p className="text-sm text-slate-700">
              เพื่อป้องกันการเรียกข้อมูลเกินสิทธิ์ หน้านี้เปิดเฉพาะผู้ใช้ที่เข้าสู่ระบบ
            </p>
            <div>
              <a href={getLoginUrl()}>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">เข้าสู่ระบบเพื่อดูชุดข้อมูล</Button>
              </a>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <Card className="space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="ค้นหาชุดข้อมูล เช่น พลังงาน ไฟฟ้า น้ำมัน"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="max-w-lg"
                />
                <Button
                  type="button"
                  onClick={() => {
                    setQuery(inputValue.trim());
                    setSelectedDatasetId("");
                  }}
                >
                  ค้นหา
                </Button>
              </div>

              <p className="text-xs text-slate-500">
                พบ {datasetsQuery.data?.total ?? 0} ชุดข้อมูล {datasetsQuery.data?.cached ? "(cached)" : "(live)"}
              </p>

              <div className="space-y-3">
                {datasetsQuery.isLoading &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="space-y-2 border p-4">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </Card>
                  ))}

                {!datasetsQuery.isLoading && datasets.length === 0 && (
                  <Card className="border-dashed p-4 text-sm text-slate-600">
                    ไม่พบข้อมูลตามคำค้นหา
                  </Card>
                )}

                {datasets.map((dataset) => (
                  <button
                    key={dataset.id}
                    type="button"
                    onClick={() => setSelectedDatasetId(dataset.id)}
                    className={`w-full rounded-lg border p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50 ${
                      selectedDatasetId === dataset.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-base font-semibold text-slate-900">{dataset.title}</p>
                    <p className="text-xs text-slate-500">
                      org: {dataset.organization} | resources: {dataset.resourcesCount}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-700">{dataset.notes || "-"}</p>
                    {dataset.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {dataset.tags.slice(0, 5).map((tag) => (
                          <Badge key={`${dataset.id}-${tag}`} variant="secondary" className="text-[11px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              {!selectedDatasetId && (
                <Card className="p-5 text-sm text-slate-600">
                  เลือกชุดข้อมูลจากรายการด้านซ้ายเพื่อดูรายละเอียด
                </Card>
              )}

              {selectedDatasetId && detailQuery.isLoading && <DetailSkeleton />}

              {selectedDatasetId && detailQuery.data && (
                <Card className="space-y-3 p-5">
                  <h2 className="text-xl font-bold text-slate-900">{detailQuery.data.title}</h2>
                  <p className="text-xs text-slate-500">
                    id: {detailQuery.data.id} | cached: {detailQuery.data.cached ? "yes" : "no"}
                  </p>
                  <p className="text-sm text-slate-700">{detailQuery.data.notes || "-"}</p>
                  <p className="text-xs text-slate-500">
                    org: {detailQuery.data.organization} | modified: {detailQuery.data.metadataModified || "-"}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Resources ({detailQuery.data.resources.length})
                    </p>
                    {detailQuery.data.resources.length === 0 && (
                      <p className="text-sm text-slate-600">ไม่พบ resource</p>
                    )}
                    {detailQuery.data.resources.map((resource) => (
                      <div key={resource.id} className="rounded-lg border border-slate-200 p-3">
                        <p className="font-medium text-slate-900">{resource.name}</p>
                        <p className="text-xs text-slate-500">
                          format: {resource.format || "-"} | datastore:{" "}
                          {resource.datastoreActive ? "active" : "inactive"}
                        </p>
                        <a
                          className="mt-1 inline-block break-all text-xs font-medium text-emerald-700 hover:text-emerald-800"
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {resource.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
