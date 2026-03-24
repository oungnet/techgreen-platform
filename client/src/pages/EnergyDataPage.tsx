import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

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

export default function EnergyDataPage() {
  const { data, isLoading, error } = trpc.govData.energyGroup.useQuery({ start: 0, limit: 6 });

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
            แสดงรายการชุดข้อมูลกลุ่มพลังงานพร้อมตัวอย่างข้อมูลจริงจาก resource ของแต่ละชุดข้อมูล
          </p>
          <p className="mt-2 text-xs text-slate-500">
            total datasets: {data.total.toLocaleString()} | fetched: {new Date(data.fetchedAt).toLocaleString("th-TH")} | cache: {data.cached ? "HIT" : "MISS"}
          </p>
        </Card>

        <div className="space-y-4">
          {data.datasets.map((dataset) => (
            <Card key={dataset.id} className="space-y-4 rounded-2xl border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{dataset.title}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  org: {dataset.organization} | resources: {dataset.resourceCount} | updated: {dataset.metadataModified || "-"}
                </p>
                {dataset.notes && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{dataset.notes}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {dataset.resources.slice(0, 4).map((resource) => (
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
                <p className="mb-2 text-sm font-semibold text-slate-700">ตัวอย่างข้อมูล</p>
                <SampleTable rows={dataset.sampleRows} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
