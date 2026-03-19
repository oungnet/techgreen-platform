import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Mail, Phone, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">โปรไฟล์ของฉัน</h1>

          {/* Profile Header */}
          <Card className="p-8 mb-8 bg-white">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {profile?.name || "ผู้ใช้"}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  {profile?.email}
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                แก้ไขโปรไฟล์
              </Button>
            )}
          </Card>

          {/* Profile Information */}
          <Card className="p-8 bg-white space-y-6">
            {isEditing ? (
              <>
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

                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    บันทึก
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    ชื่อ
                  </h3>
                  <p className="text-lg text-slate-900">
                    {profile?.name || "ไม่ได้ตั้งค่า"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    ประวัติส่วนตัว
                  </h3>
                  <p className="text-gray-700">
                    {profile?.bio || "ไม่ได้ตั้งค่า"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    เบอร์โทรศัพท์
                  </h3>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {profile?.phone || "ไม่ได้ตั้งค่า"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    ที่อยู่
                  </h3>
                  <p className="text-gray-700 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1" />
                    {profile?.address || "ไม่ได้ตั้งค่า"}
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
