import { ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredMembershipTier?: "free" | "basic" | "premium" | "enterprise";
  requiredRole?: "admin" | "user" | "member";
};

export default function ProtectedRoute({
  children,
  requiredMembershipTier,
  requiredRole = "user",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-slate-600 mb-6">
              คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => (window.location.href = "/login")}>
                เข้าสู่ระบบ
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                กลับหน้าแรก
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Check role
  if (requiredRole === "admin" && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ⛔ ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-slate-600 mb-6">
              หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              กลับหน้าแรก
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Check membership tier
  if (requiredMembershipTier) {
    const tierHierarchy = {
      free: 0,
      basic: 1,
      premium: 2,
      enterprise: 3,
    };

    const currentUserTier = user.role === "admin" ? "enterprise" : "free";
    const userTierLevel = tierHierarchy[currentUserTier as keyof typeof tierHierarchy] || 0;
    const requiredTierLevel = tierHierarchy[requiredMembershipTier];

    if (userTierLevel < requiredTierLevel) {
      return (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                💎 ต้องการแพ็คเกจพรีเมียม
              </h2>
              <p className="text-slate-600 mb-4">
                หน้านี้ต้องการแพ็คเกจ {requiredMembershipTier} ขึ้นไป
              </p>
              <p className="text-sm text-slate-500 mb-6">
                แพ็คเกจปัจจุบันของคุณ: {currentUserTier}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/profile?tab=membership")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  อัปเกรดแพ็คเกจ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                >
                  กลับหน้าแรก
                </Button>
              </div>
            </Card>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
