import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const PAGE_SIZE = 6;

function SampleTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows.length) {
    return <p className="text-xs text-slate-500">ไม่พบตัวอย่างข้อมูลจาก resource ที่ preview ได้</p>;
  }

  const headers = Object.keys(rows[0]).slice(0, 6);

  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-t border-slate-200 bg-white">
              {headers.map((header) => (
                <td key={`${rowIdx}-${header}`} className="px-3 py-2 text-slate-600">
                  {String(row[header] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escape(row[header])).join(","));
  }
  return lines.join("\n");
}

function downloadCsv(fileName: string, rows: Record<string, unknown>[]) {
  const csv = toCsv(rows);
  if (!csv) return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function EnergyDataPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const input = useMemo(
    () => ({
      start: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      query: debouncedQuery || undefined,
    }),
    [debouncedQuery, page]
  );

  const { data, isLoading, error, isFetching } = trpc.govData.energyGroup.useQuery(input);

  const hasPrev = page > 1;
  const hasNext = Boolean(data && data.start + data.datasets.length < data.total);

  if (isLoading) {
    return (
      <div className="container space-y-4 py-8">
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-8">
        <Card className="space-y-2 p-6 text-red-700">
          <h2 className="text-lg font-semibold">โหลดข้อมูลกลุ่มพลังงานไม่สำเร็จ</h2>
          <p className="text-sm">{error?.message ?? "unknown error"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="container space-y-6">
        <Card className="rounded-2xl border-slate-200 p-6">
          <p className="text-sm font-medium text-emerald-700">data.go.th /group/energy</p>
          <h1 className="text-2xl font-bold text-slate-900">Energy Open Data Explorer</h1>
          <p className="mt-2 text-sm text-slate-600">
            หน้าหลักสำหรับบริหารและตรวจสอบชุดข้อมูลพลังงานที่สำคัญ พร้อม sample data ใช้งานจริง
          </p>
          <p className="mt-2 text-xs text-slate-500">
            total datasets: {data.total.toLocaleString()} | fetched: {new Date(data.fetchedAt).toLocaleString("th-TH")} | cache: {data.cached ? "HIT" : "MISS"}
          </p>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาชุดข้อมูลพลังงาน เช่น ไฟฟ้า น้ำมัน พยากรณ์"
              className="md:max-w-lg"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={!hasPrev || isFetching} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                ก่อนหน้า
              </Button>
              <span className="text-sm text-slate-600">หน้า {page}</span>
              <Button variant="outline" disabled={!hasNext || isFetching} onClick={() => setPage((prev) => prev + 1)}>
                ถัดไป
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {data.datasets.map((dataset) => (
            <Card key={dataset.id} className="space-y-4 rounded-2xl border-slate-200 p-5">
              <div>
                <a href={dataset.datasetUrl} target="_blank" rel="noreferrer" className="text-lg font-semibold text-slate-900 hover:text-emerald-700">
                  {dataset.title}
                </a>
                <p className="mt-1 text-xs text-slate-500">
                  org: {dataset.organization} | resources: {dataset.resourceCount} | updated: {dataset.metadataModified || "-"}
                </p>
                {dataset.notes && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{dataset.notes}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {dataset.resources.slice(0, 5).map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                  >
                    {resource.format || "resource"}: {resource.name}
                  </a>
                ))}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">ตัวอย่างข้อมูล</p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!dataset.sampleRows.length}
                    onClick={() => downloadCsv(`${dataset.name || dataset.id}-sample.csv`, dataset.sampleRows)}
                  >
                    Export CSV
                  </Button>
                </div>
                <SampleTable rows={dataset.sampleRows} />
              </div>
            </Card>
          ))}

          {data.datasets.length === 0 && (
            <Card className="rounded-2xl border-slate-200 p-6 text-center text-slate-600">ไม่พบชุดข้อมูลที่ตรงกับคำค้นหา</Card>
          )}
        </div>
      </div>
    </div>
  );
}
