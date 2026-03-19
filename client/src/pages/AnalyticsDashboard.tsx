import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Chart from 'chart.js/auto';

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = trpc.analytics.getStats.useQuery();
  const articleChartRef = useRef<HTMLCanvasElement>(null);
  const commentChartRef = useRef<HTMLCanvasElement>(null);
  const userChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stats) return;

    // Article Statistics Chart
    if (articleChartRef.current) {
      const ctx = articleChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Published', 'Draft'],
            datasets: [{
              data: [stats.articles.published, stats.articles.total - stats.articles.published],
              backgroundColor: ['#10b981', '#e5e7eb'],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }
    }

    // Comment Statistics Chart
    if (commentChartRef.current) {
      const ctx = commentChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Approved', 'Pending'],
            datasets: [{
              label: 'Comments',
              data: [stats.comments.approved, stats.comments.pending],
              backgroundColor: ['#3b82f6', '#f59e0b'],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }
    }

    // User Statistics Chart
    if (userChartRef.current) {
      const ctx = userChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Admins', 'Users'],
            datasets: [{
              data: [stats.users.admins, stats.users.users],
              backgroundColor: ['#8b5cf6', '#06b6d4'],
            }],
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-gray-600 mb-2">Total Articles</h3>
          <p className="text-3xl font-bold">{stats?.articles.total || 0}</p>
          <p className="text-sm text-gray-500 mt-2">{stats?.articles.published || 0} published</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-600 mb-2">Total Comments</h3>
          <p className="text-3xl font-bold">{stats?.comments.total || 0}</p>
          <p className="text-sm text-gray-500 mt-2">{stats?.comments.pending || 0} pending approval</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats?.users.total || 0}</p>
          <p className="text-sm text-gray-500 mt-2">{stats?.users.admins || 0} admins</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Article Status</h3>
          <div style={{ height: '300px' }}>
            <canvas ref={articleChartRef}></canvas>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Comment Status</h3>
          <div style={{ height: '300px' }}>
            <canvas ref={commentChartRef}></canvas>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <div style={{ height: '300px' }}>
            <canvas ref={userChartRef}></canvas>
          </div>
        </Card>
      </div>
    </div>
  );
}
