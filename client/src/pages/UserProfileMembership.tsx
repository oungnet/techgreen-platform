import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  Upload,
  LogOut,
  CreditCard,
  Bell,
  Lock,
  Trash2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function UserProfileMembership() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "membership" | "preferences">("profile");
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
  });

  const [preferencesData, setPreferencesData] = useState<{
    newsletter: 0 | 1;
    promotions: 0 | 1;
    dataSharing: 0 | 1;
    twoFactorEnabled: 0 | 1;
  }>({
    newsletter: 1,
    promotions: 1,
    dataSharing: 0,
    twoFactorEnabled: 0,
  });

  const [upgradeData, setUpgradeData] = useState({
    tier: "basic" as "basic" | "premium" | "enterprise",
    paymentMethod: "credit_card" as "credit_card" | "bank_transfer",
  });

  // Queries
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = trpc.users.getProfile.useQuery();
  const { data: subscription, isLoading: subscriptionLoading, refetch: refetchSubscription } = trpc.membership.getSubscription.useQuery();
  const { data: preferences, isLoading: preferencesLoading, refetch: refetchPreferences } = trpc.membership.getPreferences.useQuery();

  // Mutations
  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetchProfile();
    },
  });

  const updatePreferencesMutation = trpc.membership.updatePreferences.useMutation({
    onSuccess: () => {
      refetchPreferences();
    },
  });

  const upgradeTierMutation = trpc.membership.upgradeTier.useMutation({
    onSuccess: () => {
      refetchSubscription();
    },
  });

  const cancelSubscriptionMutation = trpc.membership.cancelSubscription.useMutation({
    onSuccess: () => {
      refetchSubscription();
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      window.location.href = "/login";
    },
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  // Initialize preferences when they load
  useEffect(() => {
    if (preferences) {
      setPreferencesData({
        newsletter: preferences.newsletter === 1 ? 1 : 0,
        promotions: preferences.promotions === 1 ? 1 : 0,
        dataSharing: preferences.dataSharing === 1 ? 1 : 0,
        twoFactorEnabled: preferences.twoFactorEnabled === 1 ? 1 : 0,
      });
    }
  }, [preferences]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePreferencesChange = (key: keyof typeof preferencesData) => {
    setPreferencesData((prev) => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1,
    }));
  };

  const handlePreferencesSubmit = async () => {
    try {
      await updatePreferencesMutation.mutateAsync(preferencesData);
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  const handleUpgradeTier = async () => {
    try {
      await upgradeTierMutation.mutateAsync(upgradeData);
    } catch (error) {
      console.error("Failed to upgrade tier:", error);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm("คุณแน่ใจหรือว่าต้องการยกเลิกการสมัครสมาชิก?")) {
      try {
        await cancelSubscriptionMutation.mutateAsync();
      } catch (error) {
        console.error("Failed to cancel subscription:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">กรุณาเข้าสู่ระบบ</h1>
            <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อดูหน้าโปรไฟล์</p>
            <Button onClick={() => (window.location.href = "/login")}>
              เข้าสู่ระบบ
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900">โปรไฟล์ของฉัน</h1>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logoutMutation.isPending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-8 bg-white sticky top-4">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 text-center">
                    {profile?.name || "ผู้ใช้"}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {profile?.email}
                  </p>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mt-3">
                    {subscription?.tier === "free" ? "ฟรี" : subscription?.tier === "basic" ? "พื้นฐาน" : subscription?.tier === "premium" ? "พรีเมียม" : "เอนเทอร์ไพรส์"}
                  </span>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  {profile?.phone && (
                    <div className="flex items-center text-gray-700 text-sm">
                      <Phone className="w-4 h-4 mr-3 text-emerald-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.address && (
                    <div className="flex items-start text-gray-700 text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-emerald-500 mt-0.5" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                  {profile?.createdAt && (
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-emerald-500" />
                      <span>
                        สมัครสมาชิก: {format(new Date(profile.createdAt), "d MMMM yyyy", { locale: th })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Membership Status */}
                {subscription && (
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-emerald-700 uppercase mb-2">สถานะสมาชิก</p>
                    <p className="text-sm text-emerald-900 font-medium mb-3">
                      {subscription.status === "active" ? "✅ ใช้งานอยู่" : "⏸️ ไม่ใช้งาน"}
                    </p>
                    {subscription.endDate && (
                      <p className="text-xs text-emerald-700">
                        หมดอายุ: {format(new Date(subscription.endDate), "d MMMM yyyy", { locale: th })}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Tabs Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "profile"
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="w-4 h-4 inline-block mr-2" />
                  โปรไฟล์
                </button>
                <button
                  onClick={() => setActiveTab("membership")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "membership"
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline-block mr-2" />
                  สมาชิก
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "preferences"
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Bell className="w-4 h-4 inline-block mr-2" />
                  ตั้งค่า
                </button>
              </div>

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">ข้อมูลโปรไฟล์</h2>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อ</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleProfileChange}
                          placeholder="ชื่อของคุณ"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ประวัติส่วนตัว</label>
                        <Textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleProfileChange}
                          placeholder="เขียนเกี่ยวกับตัวคุณ"
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          placeholder="08X-XXX-XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ที่อยู่</label>
                        <Textarea
                          name="address"
                          value={formData.address}
                          onChange={handleProfileChange}
                          placeholder="ที่อยู่ของคุณ"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={handleProfileSubmit}
                          disabled={updateProfileMutation.isPending}
                          className="flex-1"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              บันทึก...
                            </>
                          ) : (
                            "บันทึก"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-slate-600">ชื่อ</label>
                        <p className="text-lg text-slate-900 mt-1">{profile?.name || "-"}</p>
                      </div>

                      {profile?.bio && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">ประวัติส่วนตัว</label>
                          <p className="text-slate-900 mt-1">{profile.bio}</p>
                        </div>
                      )}

                      {profile?.phone && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">เบอร์โทรศัพท์</label>
                          <p className="text-slate-900 mt-1">{profile.phone}</p>
                        </div>
                      )}

                      {profile?.address && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">ที่อยู่</label>
                          <p className="text-slate-900 mt-1">{profile.address}</p>
                        </div>
                      )}

                      <Button onClick={() => setIsEditing(true)} className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        แก้ไขโปรไฟล์
                      </Button>
                    </div>
                  )}
                </Card>
              )}

              {/* Membership Tab */}
              {activeTab === "membership" && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">จัดการสมาชิก</h2>

                  {subscriptionLoading ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : subscription ? (
                    <div className="space-y-6">
                      {/* Current Tier */}
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">แพ็คเกจปัจจุบัน</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className={`p-4 rounded-lg border-2 ${subscription.tier === "free" ? "border-emerald-600 bg-emerald-50" : "border-gray-200"}`}>
                            <p className="font-semibold text-slate-900">ฟรี</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">฿0</p>
                            <p className="text-xs text-gray-600 mt-2">ต่อเดือน</p>
                          </div>
                          <div className={`p-4 rounded-lg border-2 ${subscription.tier === "basic" ? "border-emerald-600 bg-emerald-50" : "border-gray-200"}`}>
                            <p className="font-semibold text-slate-900">พื้นฐาน</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">฿299</p>
                            <p className="text-xs text-gray-600 mt-2">ต่อเดือน</p>
                          </div>
                          <div className={`p-4 rounded-lg border-2 ${subscription.tier === "premium" ? "border-emerald-600 bg-emerald-50" : "border-gray-200"}`}>
                            <p className="font-semibold text-slate-900">พรีเมียม</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">฿999</p>
                            <p className="text-xs text-gray-600 mt-2">ต่อเดือน</p>
                          </div>
                        </div>
                      </div>

                      {/* Upgrade Options */}
                      {subscription.tier === "free" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-900">อัปเกรดแพ็คเกจ</h3>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">เลือกแพ็คเกจ</label>
                            <select
                              value={upgradeData.tier}
                              onChange={(e) => setUpgradeData({ ...upgradeData, tier: e.target.value as any })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="basic">พื้นฐาน (฿299/เดือน)</option>
                              <option value="premium">พรีเมียม (฿999/เดือน)</option>
                              <option value="enterprise">เอนเทอร์ไพรส์ (ติดต่อสอบถาม)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">วิธีการชำระเงิน</label>
                            <select
                              value={upgradeData.paymentMethod}
                              onChange={(e) => setUpgradeData({ ...upgradeData, paymentMethod: e.target.value as any })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="credit_card">บัตรเครดิต</option>
                              <option value="bank_transfer">โอนเงินธนาคาร</option>
                            </select>
                          </div>

                          <Button
                            onClick={handleUpgradeTier}
                            disabled={upgradeTierMutation.isPending}
                            className="w-full"
                          >
                            {upgradeTierMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังอัปเกรด...
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                อัปเกรดตอนนี้
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Subscription Details */}
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">รายละเอียดการสมัครสมาชิก</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">สถานะ:</span>
                            <span className="font-medium text-slate-900">{subscription.status === "active" ? "✅ ใช้งานอยู่" : "⏸️ ไม่ใช้งาน"}</span>
                          </div>
                          {subscription.startDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">วันเริ่มต้น:</span>
                              <span className="font-medium text-slate-900">{format(new Date(subscription.startDate), "d MMMM yyyy", { locale: th })}</span>
                            </div>
                          )}
                          {subscription.endDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">วันหมดอายุ:</span>
                              <span className="font-medium text-slate-900">{format(new Date(subscription.endDate), "d MMMM yyyy", { locale: th })}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cancel Subscription */}
                      {subscription.status === "active" && (
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscriptionMutation.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {cancelSubscriptionMutation.isPending ? "กำลังยกเลิก..." : "ยกเลิกการสมัครสมาชิก"}
                        </Button>
                      )}
                    </div>
                  ) : null}
                </Card>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">ตั้งค่าการแจ้งเตือน</h2>

                  {preferencesLoading ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Newsletter */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">จดหมายข่าว</p>
                          <p className="text-sm text-gray-600 mt-1">รับข้อมูลข่าวสารและการอัปเดตใหม่ล่าสุด</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencesData.newsletter === 1}
                          onChange={() => handlePreferencesChange("newsletter")}
                          className="w-5 h-5 text-emerald-600 rounded"
                        />
                      </div>

                      {/* Promotions */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">โปรโมชั่นและข้อเสนอ</p>
                          <p className="text-sm text-gray-600 mt-1">รับข้อมูลเกี่ยวกับโปรโมชั่นและข้อเสนอพิเศษ</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencesData.promotions === 1}
                          onChange={() => handlePreferencesChange("promotions")}
                          className="w-5 h-5 text-emerald-600 rounded"
                        />
                      </div>

                      {/* Data Sharing */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">การแบ่งปันข้อมูล</p>
                          <p className="text-sm text-gray-600 mt-1">อนุญาตให้แบ่งปันข้อมูลของคุณกับพันธมิตร</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencesData.dataSharing === 1}
                          onChange={() => handlePreferencesChange("dataSharing")}
                          className="w-5 h-5 text-emerald-600 rounded"
                        />
                      </div>

                      {/* Two Factor Authentication */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">การยืนยันตัวตนแบบสองชั้น</p>
                          <p className="text-sm text-gray-600 mt-1">เพิ่มความปลอดภัยให้บัญชีของคุณ</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencesData.twoFactorEnabled === 1}
                          onChange={() => handlePreferencesChange("twoFactorEnabled")}
                          className="w-5 h-5 text-emerald-600 rounded"
                        />
                      </div>

                      <Button
                        onClick={handlePreferencesSubmit}
                        disabled={updatePreferencesMutation.isPending}
                        className="w-full"
                      >
                        {updatePreferencesMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            บันทึก...
                          </>
                        ) : (
                          "บันทึกการตั้งค่า"
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
