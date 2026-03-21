import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Mail, Phone, MapPin, Calendar, FileText, MessageSquare, Star, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
  });

  const { data: profile, isLoading, refetch } = trpc.users.getProfile.useQuery();
  const { data: activity, isLoading: activityLoading } = trpc.users.getActivity.useQuery({ limit: 10 });
  const { data: stats, isLoading: statsLoading } = trpc.users.getStats.useQuery();
  
  const updateMutation = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const handleSubmit = async () => {
    await updateMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">โปรไฟล์ของฉัน</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-8 bg-white sticky top-4">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 text-center">
                    {profile?.name || "ผู้ใช้"}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {profile?.email}
                  </p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mt-3">
                    {profile?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
                  </span>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  {profile?.phone && (
                    <div className="flex items-center text-gray-700 text-sm">
                      <Phone className="w-4 h-4 mr-3 text-green-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.address && (
                    <div className="flex items-start text-gray-700 text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-green-500 mt-0.5" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                  {profile?.createdAt && (
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-green-500" />
                      <span>สมาชิกตั้งแต่ {format(new Date(profile.createdAt), "d MMMM yyyy", { locale: th })}</span>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <Button
                    onClick={() => {
                      setFormData({
                        name: profile?.name || "",
                        bio: profile?.bio || "",
                        phone: profile?.phone || "",
                        address: profile?.address || "",
                      });
                      setIsEditing(true);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    แก้ไขโปรไฟล์
                  </Button>
                )}
              </Card>
            </div>

            {/* Right Column - Stats and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Statistics Section */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">สถิติกิจกรรม</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center bg-white">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-slate-900">
                      {statsLoading ? "-" : stats?.articlesCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">บทความ</p>
                  </Card>
                  <Card className="p-4 text-center bg-white">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold text-slate-900">
                      {statsLoading ? "-" : stats?.commentsCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">ความเห็น</p>
                  </Card>
                  <Card className="p-4 text-center bg-white">
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold text-slate-900">
                      {statsLoading ? "-" : stats?.ratingsCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">การให้คะแนน</p>
                  </Card>
                  <Card className="p-4 text-center bg-white">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold text-slate-900">
                      {statsLoading ? "-" : stats?.filesCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">ไฟล์</p>
                  </Card>
                </div>
              </div>

              {/* Edit Profile Form */}
              {isEditing && (
                <Card className="p-8 bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">แก้ไขข้อมูลส่วนตัว</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        ชื่อ
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="ชื่อของคุณ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        ประวัติส่วนตัว
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="เขียนเกี่ยวกับตัวคุณ"
                        className="min-h-24"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        เบอร์โทรศัพท์
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="เบอร์โทรศัพท์"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        ที่อยู่
                      </label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="ที่อยู่ของคุณ"
                        className="min-h-20"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        บันทึก
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Recent Activity Section */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">กิจกรรมล่าสุด</h3>
                {activityLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin h-6 w-6 text-green-500" />
                  </div>
                ) : activity && activity.length > 0 ? (
                  <div className="space-y-3">
                    {activity.map((item) => (
                      <Card key={`${item.type}-${item.id}`} className="p-4 bg-white hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {item.type === "article" && (
                                <FileText className="w-4 h-4 text-blue-500" />
                              )}
                              {item.type === "comment" && (
                                <MessageSquare className="w-4 h-4 text-green-500" />
                              )}
                              {item.type === "rating" && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className="text-sm font-semibold text-slate-900">
                                {item.type === "article" && "เขียนบทความ"}
                                {item.type === "comment" && "ให้ความเห็น"}
                                {item.type === "rating" && "ให้คะแนน"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 truncate">{item.title}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {format(new Date(item.createdAt), "d MMM yyyy", { locale: th })}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-gray-600 bg-white">
                    <p>ยังไม่มีกิจกรรม</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
