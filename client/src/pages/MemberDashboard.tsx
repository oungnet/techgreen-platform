import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, FileText, MessageSquare, Star, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function MemberDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: overview, isLoading: overviewLoading } = trpc.dashboard.getOverview.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || overviewLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ดสมาชิก</p>
          <Button onClick={() => setLocation("/")} className="w-full">
            กลับไปหน้าแรก
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับ, {user.name}
          </h1>
          <p className="text-gray-600">ติดตามกิจกรรมและการแจ้งเตือนของคุณ</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">บทความที่อ่าน</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview?.stats.articlesRead || 0}
                </p>
              </div>
              <FileText className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ความเห็นที่สร้าง</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview?.stats.commentsCreated || 0}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">คะแนนที่ให้</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview?.stats.ratingsGiven || 0}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ไฟล์ที่อัพโหลด</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview?.stats.filesUploaded || 0}
                </p>
              </div>
              <Upload className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Notifications and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">การแจ้งเตือนล่าสุด</h2>
              {overview?.notifications && overview.notifications.length > 0 ? (
                <div className="space-y-4">
                  {overview.notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{notif.title}</p>
                          <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {new Date(notif.createdAt).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                        {notif.isRead === 0 && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">ไม่มีการแจ้งเตือน</p>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => setLocation("/notifications")}>
                ดูการแจ้งเตือนทั้งหมด
              </Button>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">การกระทำด่วน</h2>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation("/profile")}
                >
                  แก้ไขโปรไฟล์
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation("/email-preferences")}
                >
                  ตั้งค่าอีเมล
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation("/dashboard/notifications")}
                >
                  ตั้งค่าการแจ้งเตือน
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation("/learning")}
                >
                  ไปยังศูนย์การเรียนรู้
                </Button>
              </div>
            </Card>

            {/* Unread Count */}
            {overview?.unreadCount && overview.unreadCount > 0 && (
              <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700">
                  คุณมี <span className="font-bold">{overview.unreadCount}</span> การแจ้งเตือนที่ยังไม่อ่าน
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">กิจกรรมล่าสุด</h2>
          {overview?.recentActivity && overview.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {overview.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="text-gray-900 font-medium">
                      {activity.activityType === 'view_article' && 'ดูบทความ'}
                      {activity.activityType === 'create_comment' && 'สร้างความเห็น'}
                      {activity.activityType === 'upload_file' && 'อัพโหลดไฟล์'}
                      {activity.activityType === 'rate_article' && 'ให้คะแนนบทความ'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(activity.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">ไม่มีกิจกรรมล่าสุด</p>
          )}
        </Card>
      </div>
    </div>
  );
}
