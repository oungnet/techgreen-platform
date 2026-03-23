import { ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AdminRouteGuardProps = {
  children: ReactNode;
};

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-8">
        <Card className="p-6 text-center text-slate-600">กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ...</Card>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</h2>
          <p className="mt-2 text-sm text-slate-600">
            บัญชีของคุณไม่มีสิทธิ์เข้าถึงส่วนจัดการเนื้อหา
          </p>
          <Button className="mt-4" onClick={() => (window.location.href = "/")}>
            กลับหน้าแรก
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
