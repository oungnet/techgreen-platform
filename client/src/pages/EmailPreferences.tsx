import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Bell, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState({
    subscribeToNewArticles: false,
    subscribeToUpdates: false,
    subscribeToPolicy: false,
  });
  const [saved, setSaved] = useState(false);

  const { data: currentPrefs, isLoading } = trpc.emailSubscriptions.getPreferences.useQuery();
  const updateMutation = trpc.emailSubscriptions.updatePreferences.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const { data: notifications = [] } = trpc.emailSubscriptions.getNotifications.useQuery({
    limit: 20,
  });

  useEffect(() => {
    if (currentPrefs) {
      setPreferences({
        subscribeToNewArticles: currentPrefs.subscribeToNewArticles === 1,
        subscribeToUpdates: currentPrefs.subscribeToUpdates === 1,
        subscribeToPolicy: currentPrefs.subscribeToPolicy === 1,
      });
    }
  }, [currentPrefs]);

  const handleSave = async () => {
    await updateMutation.mutateAsync(preferences);
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            ตั้งค่าการรับอีเมล
          </h1>

          {/* Preferences */}
          <Card className="p-8 mb-8 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Mail className="h-6 w-6 text-green-500" />
              การตั้งค่าการสมัครรับข้อมูล
            </h2>

            <div className="space-y-4 mb-6">
              {/* New Articles */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="articles"
                  checked={preferences.subscribeToNewArticles}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      subscribeToNewArticles: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-green-500 rounded"
                />
                <label htmlFor="articles" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-slate-900">
                    บทความใหม่
                  </p>
                  <p className="text-sm text-gray-600">
                    รับการแจ้งเตือนเมื่อมีบทความใหม่ในศูนย์การเรียนรู้
                  </p>
                </label>
              </div>

              {/* Updates */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="updates"
                  checked={preferences.subscribeToUpdates}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      subscribeToUpdates: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-green-500 rounded"
                />
                <label htmlFor="updates" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-slate-900">
                    ข้อมูลอัปเดต
                  </p>
                  <p className="text-sm text-gray-600">
                    รับการแจ้งเตือนเมื่อมีข้อมูลใหม่เกี่ยวกับสิทธิประโยชน์และนวัตกรรม
                  </p>
                </label>
              </div>

              {/* Policy Changes */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="policy"
                  checked={preferences.subscribeToPolicy}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      subscribeToPolicy: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-green-500 rounded"
                />
                <label htmlFor="policy" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-slate-900">
                    การเปลี่ยนแปลงนโยบาย
                  </p>
                  <p className="text-sm text-gray-600">
                    รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงนโยบายสิทธิประโยชน์
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-green-500 hover:bg-green-600"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                บันทึกการตั้งค่า
              </Button>

              {saved && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  บันทึกสำเร็จ
                </div>
              )}
            </div>
          </Card>

          {/* Notification History */}
          <Card className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Bell className="h-6 w-6 text-green-500" />
              ประวัติการแจ้งเตือน
            </h2>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                ยังไม่มีการแจ้งเตือน
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {notif.subject}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notif.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notif.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded ${
                          notif.sent
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {notif.sent ? "ส่งแล้ว" : "รอการส่ง"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
