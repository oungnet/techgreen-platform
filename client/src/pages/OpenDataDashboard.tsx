import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AlertTriangle, ArrowRight, Database, RefreshCcw } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function PreviewTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows.length) {
    return <p className="text-sm text-slate-500">ไม่มีข้อมูลตัวอย่างให้แสดง</p>;
  }

  const keys = Object.keys(rows[0]).slice(0, 6);

  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            {keys.map((key) => (
              <th key={key} className="px-3 py-2 font-semibold">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-200 bg-white">
              {keys.map((key) => (
                <td key={`${rowIndex}-${key}`} className="px-3 py-2 text-slate-600">
                  {String(row[key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OpenDataDashboard() {
  const { data, isLoading, error, refetch, isFetching } = trpc.govData.dashboard.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 60,
  });

  const isDegraded = data?.status === "degraded" || Boolean(data?.errors?.length);
  const {
    data: energyFallback,
    isLoading: isEnergyLoading,
  } = trpc.govData.energyGroup.useQuery(
    { start: 0, limit: 3 },
    {
      enabled: Boolean(error) || isDegraded,
    }
  );

  if (isLoading) {
    return (
      <div className="container space-y-4 py-8">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    if (isEnergyLoading) {
      return (
        <div className="container space-y-4 py-8">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      );
    }

    return (
      <div className="container py-8">
        <Card className="space-y-3 rounded-2xl border-rose-200 bg-rose-50 p-6 text-rose-900">
          <h2 className="text-lg font-semibold">ไม่สามารถโหลดแดชบอร์ดหลักได้</h2>
          <p className="text-sm">{error?.message ?? "unknown error"}</p>
          <a href="/open-data/energy" className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            ไปหน้า Energy Open Data Explorer <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Card>

        {energyFallback ? (
          <div className="mt-4 space-y-4">
            {energyFallback.datasets.map((dataset) => (
              <Card key={dataset.id} className="space-y-2 rounded-2xl p-5">
                <h3 className="text-base font-semibold text-slate-900">{dataset.title}</h3>
                <p className="text-xs text-slate-500">
                  org: {dataset.organization} | resources: {dataset.resourceCount}
                </p>
                <PreviewTable rows={dataset.sampleRows} />
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const lineData = {
    labels: data.agriculture.trend.map((point) => point.label),
    datasets: [
      {
        label: "ราคาเกษตรรายวัน",
        data: data.agriculture.trend.map((point) => point.value),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.14)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-slate-50 py-6">
      <div className="container space-y-6">
        <Card className="rounded-2xl border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-6 text-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Database className="h-3.5 w-3.5" />
                THAI GOVERNMENT OPEN DATA
              </p>
              <h1 className="mt-3 text-2xl font-bold">Agriculture & Weather Command Center</h1>
              <p className="mt-2 text-sm text-slate-300">ข้อมูลจริงจาก data.go.th พร้อม cache 1 ชั่วโมง และ fallback อัตโนมัติ</p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              รีเฟรชข้อมูล
            </button>
          </div>
        </Card>

        {isDegraded ? (
          <Card className="rounded-2xl border-amber-200 bg-amber-50 p-5 text-amber-900">
            <h2 className="inline-flex items-center text-base font-semibold">
              <AlertTriangle className="mr-2 h-4 w-4" />
              สถานะข้อมูล: โหมดสำรอง (Degraded)
            </h2>
            <p className="mt-1 text-sm">ระบบยังแสดงผลได้ปกติ แต่บางชุดข้อมูลภายนอกยังไม่พร้อม</p>
            {!!data.errors?.length && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                {data.errors.map((message, index) => (
                  <li key={`${index}-${message}`}>{message}</li>
                ))}
              </ul>
            )}
          </Card>
        ) : null}

        <Card className="rounded-2xl border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">แนวโน้มราคาสินค้าเกษตร</h2>
          <p className="mt-1 text-xs text-slate-500">
            fetched: {new Date(data.agriculture.fetchedAt).toLocaleString("th-TH")} | records: {data.agriculture.rawCount} | cache: {data.agriculture.cached ? "HIT" : "MISS"}
          </p>
          <p className="text-xs text-slate-500">source: {data.agriculture.sourceUrl}</p>

          {data.agriculture.trend.length > 0 ? (
            <div className="mt-4 h-80">
              <Line
                data={lineData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                  },
                }}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              ยังไม่มีข้อมูลแนวโน้มราคาสำหรับรอบนี้
            </div>
          )}

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">ข้อมูลตัวอย่าง (Agriculture)</h3>
            <PreviewTable rows={data.agriculture.preview} />
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.weather.widgets.map((widget) => (
            <Card key={widget.title} className="rounded-2xl border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-500">{widget.title}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{widget.description}</p>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-slate-200 p-5">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">ข้อมูลตัวอย่าง (Weather)</h3>
          <p className="mb-2 text-xs text-slate-500">source: {data.weather.sourceUrl}</p>
          <PreviewTable rows={data.weather.preview} />
        </Card>

        {isDegraded && energyFallback ? (
          <Card className="rounded-2xl border-slate-200 p-5">
            <h3 className="text-base font-semibold text-slate-900">ข้อมูลสำรองจากกลุ่มพลังงาน</h3>
            <p className="mt-1 text-xs text-slate-500">
              fetched: {new Date(energyFallback.fetchedAt).toLocaleString("th-TH")} | total: {energyFallback.total} | cache: {energyFallback.cached ? "HIT" : "MISS"}
            </p>
            <div className="mt-4 space-y-4">
              {energyFallback.datasets.map((dataset) => (
                <div key={dataset.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-900">{dataset.title}</h4>
                  <p className="text-xs text-slate-500">org: {dataset.organization} | resources: {dataset.resourceCount}</p>
                  <div className="mt-2">
                    <PreviewTable rows={dataset.sampleRows} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
