import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function MemberAnalytics() {
  const { user, loading } = useAuth();
  const analyticsQuery = trpc.analytics.getStats.useQuery();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-red-600">Access Denied: Admin only</div>;
  }

  const stats = analyticsQuery.data;

  // Sample data for charts
  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Articles Created',
        data: [5, 8, 12, 10, 15, 18],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Comments',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ['Disability', 'Tax', 'Resources', 'Innovation', 'Partnership'],
    datasets: [
      {
        label: 'Articles by Category',
        data: [12, 19, 8, 15, 10],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ec4899',
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Active Users', 'Inactive Users', 'New Users'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#3b82f6', '#e5e7eb', '#10b981'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Member Analytics Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Articles</p>
                <p className="text-2xl font-bold">{stats?.articles?.total || 0}</p>
              </div>
              <BookOpen className="text-green-500" size={32} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Comments</p>
                <p className="text-2xl font-bold">{stats?.comments?.total || 0}</p>
              </div>
              <MessageSquare className="text-purple-500" size={32} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Engagement Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <TrendingUp className="text-orange-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Trend (Last 6 Weeks)</h2>
            <div style={{ height: '300px' }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </Card>

          {/* Bar Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Articles by Category</h2>
            <div style={{ height: '300px' }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Doughnut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">User Status Distribution</h2>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </div>
          </Card>

          {/* Top Articles */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Articles</h2>
            <div className="space-y-3">
              {[
                { title: 'สิทธิประโยชน์ผู้พิการ 2568', views: 1250, comments: 45 },
                { title: 'มาตรา 33 ลดหย่อนภาษี', views: 980, comments: 32 },
                { title: 'ที่ดินราชพัสดุ 12,450 ไร่', views: 850, comments: 28 },
                { title: 'Smart IoT ในการเกษตร', views: 720, comments: 22 },
                { title: 'ความร่วมมือทางธุรกิจ', views: 650, comments: 18 },
              ].map((article, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{article.title}</p>
                    <p className="text-xs text-gray-500">{article.comments} comments</p>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">{article.views}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
