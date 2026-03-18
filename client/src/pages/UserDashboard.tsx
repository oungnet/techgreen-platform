import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, FileText, Settings, LogOut, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { FileManager } from "@/components/FileManager";

export default function UserDashboard() {
  const applications = [
    {
      id: 1,
      type: "สิทธิประโยชน์ผู้พิการ",
      status: "อนุมัติแล้ว",
      date: "2026-03-01",
      amount: "1,500 บาท/เดือน",
      icon: "✅",
    },
    {
      id: 2,
      type: "สิทธิลดหย่อนภาษี",
      status: "รอการตรวจสอบ",
      date: "2026-02-15",
      amount: "50,000 บาท",
      icon: "⏳",
    },
    {
      id: 3,
      type: "ที่ดินราชพัสดุ",
      status: "รอการอนุมัติ",
      date: "2026-01-20",
      amount: "5 ไร่",
      icon: "📋",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "อนุมัติสิทธิประโยชน์สำเร็จ",
      message: "สิทธิประโยชน์ผู้พิการของคุณได้รับการอนุมัติแล้ว",
      date: "2026-03-10",
      read: false,
    },
    {
      id: 2,
      title: "ต้องการเอกสารเพิ่มเติม",
      message: "กรุณาส่งใบรับรองแพทย์ฉบับใหม่ภายใน 7 วัน",
      date: "2026-03-05",
      read: false,
    },
    {
      id: 3,
      title: "ข้อมูลใหม่เกี่ยวกับสิทธิประโยชน์",
      message: "มีการเพิ่มเติมสิทธิประโยชน์ใหม่สำหรับปี 2026",
      date: "2026-02-28",
      read: true,
    },
  ];

  const userInfo = {
    name: "นาย สมชาย ใจดี",
    email: "somchai@email.com",
    phone: "08X-XXX-XXXX",
    idCard: "1-XXXX-XXXXX-XX-X",
    userType: "ผู้พิการ",
    joinDate: "2025-12-15",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับ, {userInfo.name}</h1>
              <p className="text-slate-300">แดชบอร์ดส่วนตัวของคุณ</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                <Settings className="mr-2" size={20} />
                ตั้งค่า
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                <LogOut className="mr-2" size={20} />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              {/* User Profile Card */}
              <Card className="p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl mx-auto mb-4">
                    👤
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{userInfo.name}</h3>
                  <p className="text-sm text-gray-600">{userInfo.userType}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">อีเมล</p>
                    <p className="font-semibold text-slate-900">{userInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">เบอร์โทรศัพท์</p>
                    <p className="font-semibold text-slate-900">{userInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">เลขบัตรประชาชน</p>
                    <p className="font-semibold text-slate-900">{userInfo.idCard}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">วันที่เข้าร่วม</p>
                    <p className="font-semibold text-slate-900">{userInfo.joinDate}</p>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                  <User className="mr-2" size={18} />
                  แก้ไขโปรไฟล์
                </Button>
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">ลิงก์ด่วน</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" size={18} />
                    ยื่นคำขอใหม่
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2" size={18} />
                    ดูการแจ้งเตือน
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2" size={18} />
                    ตั้งค่าการแจ้งเตือน
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="applications" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="applications">คำขอของฉัน</TabsTrigger>
                  <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
                  <TabsTrigger value="documents">เอกสาร</TabsTrigger>
                </TabsList>

                {/* Applications Tab */}
                <TabsContent value="applications" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">คำขอของฉัน</h3>
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <Card key={app.id} className="p-4 border-l-4 border-l-blue-500">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{app.icon}</span>
                                <div>
                                  <h4 className="font-bold text-slate-900">{app.type}</h4>
                                  <p className="text-sm text-gray-600">ยื่นเมื่อ: {app.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">จำนวน: {app.amount}</span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    app.status === "อนุมัติแล้ว"
                                      ? "bg-green-100 text-green-700"
                                      : app.status === "รอการตรวจสอบ"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">การแจ้งเตือน</h3>
                    <div className="space-y-4">
                      {notifications.map((notif) => (
                        <Card
                          key={notif.id}
                          className={`p-4 border-l-4 ${
                            notif.read ? "border-l-gray-300 bg-gray-50" : "border-l-blue-500"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {notif.read ? (
                                  <CheckCircle size={18} className="text-gray-400" />
                                ) : (
                                  <AlertCircle size={18} className="text-blue-600" />
                                )}
                                <h4 className={`font-bold ${notif.read ? "text-gray-600" : "text-slate-900"}`}>
                                  {notif.title}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                              <p className="text-xs text-gray-500">{notif.date}</p>
                            </div>
                            {!notif.read && (
                              <Button variant="outline" size="sm">
                                ทำเครื่องหมายว่าอ่าน
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                  <FileManager />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
