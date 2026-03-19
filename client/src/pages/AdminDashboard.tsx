import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { AdminArticlesTable } from "@/components/AdminArticlesTable";
import { AdminCommentsTable } from "@/components/AdminCommentsTable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageSquare, FileText, Users } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "articles" | "comments">("overview");

  const { data: stats } = trpc.admin.dashboard.stats.useQuery();

  if (!isAuthenticated) {
    return <div className="p-4">กรุณาเข้าสู่ระบบก่อน</div>;
  }

  if (user?.role !== "admin") {
    return <div className="p-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">แดชบอร์ดผู้ดูแลระบบ</h1>

        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="mr-2" size={18} />
            ภาพรวม
          </Button>
          <Button
            variant={activeTab === "articles" ? "default" : "outline"}
            onClick={() => setActiveTab("articles")}
          >
            <FileText className="mr-2" size={18} />
            บทความ
          </Button>
          <Button
            variant={activeTab === "comments" ? "default" : "outline"}
            onClick={() => setActiveTab("comments")}
          >
            <MessageSquare className="mr-2" size={18} />
            ความคิดเห็น
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">ผู้ใช้ทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="text-blue-500" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">บทความทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats?.totalArticles || 0}</p>
                </div>
                <FileText className="text-green-500" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">ความคิดเห็นทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats?.totalComments || 0}</p>
                </div>
                <MessageSquare className="text-purple-500" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">รอการอนุมัติ</p>
                  <p className="text-3xl font-bold text-red-600">{stats?.pendingComments || 0}</p>
                </div>
                <BarChart3 className="text-red-500" size={32} />
              </div>
            </Card>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && <AdminArticlesTable />}

        {/* Comments Tab */}
        {activeTab === "comments" && <AdminCommentsTable />}
      </div>
    </div>
  );
}
