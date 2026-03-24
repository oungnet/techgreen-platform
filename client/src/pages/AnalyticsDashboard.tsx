import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Chart from "chart.js/auto";

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = trpc.analytics.getStats.useQuery();
  const articleChartRef = useRef<HTMLCanvasElement>(null);
  const commentChartRef = useRef<HTMLCanvasElement>(null);
  const userChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stats) return;

    const approvedComments = Math.max(stats.comments.total - stats.comments.pending, 0);
    const regularUsers = Math.max(stats.users.total - stats.users.admins, 0);

    if (articleChartRef.current) {
      const ctx = articleChartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Published", "Draft"],
            datasets: [
              {
                data: [stats.articles.published, stats.articles.total - stats.articles.published],
                backgroundColor: ["#10b981", "#e5e7eb"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }
    }

    if (commentChartRef.current) {
      const ctx = commentChartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Approved", "Pending"],
            datasets: [
              {
                label: "Comments",
                data: [approvedComments, stats.comments.pending],
                backgroundColor: ["#3b82f6", "#f59e0b"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }
    }

    if (userChartRef.current) {
      const ctx = userChartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Admins", "Users"],
            datasets: [
              {
                data: [stats.users.admins, regularUsers],
                backgroundColor: ["#8b5cf6", "#06b6d4"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const regularUsers = Math.max((stats?.users.total ?? 0) - (stats?.users.admins ?? 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Analytics Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-2 text-gray-600">Total Articles</h3>
          <p className="text-3xl font-bold">{stats?.articles.total || 0}</p>
          <p className="mt-2 text-sm text-gray-500">{stats?.articles.published || 0} published</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-2 text-gray-600">Total Comments</h3>
          <p className="text-3xl font-bold">{stats?.comments.total || 0}</p>
          <p className="mt-2 text-sm text-gray-500">{stats?.comments.pending || 0} pending approval</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-2 text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold">{stats?.users.total || 0}</p>
          <p className="mt-2 text-sm text-gray-500">{stats?.users.admins || 0} admins / {regularUsers} users</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Article Status</h3>
          <div style={{ height: "300px" }}>
            <canvas ref={articleChartRef}></canvas>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Comment Status</h3>
          <div style={{ height: "300px" }}>
            <canvas ref={commentChartRef}></canvas>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">User Distribution</h3>
          <div style={{ height: "300px" }}>
            <canvas ref={userChartRef}></canvas>
          </div>
        </Card>
      </div>
    </div>
  );
}
