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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function PreviewTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows.length) {
    return <p className="text-sm text-slate-500">ไม่มีข้อมูลตัวอย่างให้แสดง</p>;
  }

  const keys = Object.keys(rows[0]).slice(0, 6);

  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
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
  const { data, isLoading, error } = trpc.govData.dashboard.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="container space-y-4 py-8">
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-8">
        <Card className="space-y-2 p-6 text-red-700">
          <h2 className="text-lg font-semibold">ไม่สามารถดึงข้อมูล data.go.th ได้</h2>
          <p className="text-sm">{error?.message ?? "unknown error"}</p>
          <p className="text-xs text-slate-600">ตรวจสอบ DATA_GO_TH_API_KEY และสิทธิ์ใช้งานบริการ opend-search ของ token นี้</p>
        </Card>
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
        backgroundColor: "rgba(5, 150, 105, 0.15)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-slate-50 py-6">
      <div className="container space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
          <p className="text-sm font-medium text-emerald-700">Thai Government Open Data</p>
          <h1 className="text-2xl font-bold text-slate-900">Agriculture & Weather Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">ดึงข้อมูลจริงจาก data.go.th แล้วแสดงเป็นกราฟ + widget + ตารางตัวอย่าง</p>
          <a href="/open-data/energy" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            ไปหน้า Energy Open Data Explorer →
          </a>
        </div>

        <Card className="rounded-2xl border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">แนวโน้มราคาสินค้าเกษตร</h2>
          <p className="mt-1 text-xs text-slate-500">
            fetched: {new Date(data.agriculture.fetchedAt).toLocaleString("th-TH")} | records: {data.agriculture.rawCount} | cache: {data.agriculture.cached ? "HIT" : "MISS"}
          </p>
          <p className="text-xs text-slate-500">source: {data.agriculture.sourceUrl}</p>
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
      </div>
    </div>
  );
}
