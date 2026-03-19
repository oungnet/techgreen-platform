import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">คุณได้เข้าสู่ระบบแล้ว!</h1>
              <p className="text-gray-600 mb-6">ยินดีต้อนรับเข้าสู่ TechGreen Platform</p>
              <Button className="bg-green-500 hover:bg-green-600 w-full" onClick={() => window.location.href = "/"}>
                กลับไปหน้าแรก
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">เข้าสู่ระบบ</h1>
              <p className="text-gray-600">ยินดีต้อนรับกลับมายังแพลตฟอร์ม TechGreen</p>
            </div>

            <div className="space-y-6">
              {/* OAuth Login */}
              <a href={getLoginUrl()}>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 font-bold text-lg">
                  <span className="mr-2">🔐</span> เข้าสู่ระบบด้วย Manus
                </Button>
              </a>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>💡 วิธีการ:</strong> คลิกปุ่มด้านบนเพื่อเข้าสู่ระบบด้วยบัญชี Manus OAuth
                </p>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  ยังไม่มีบัญชี?{" "}
                  <a href="/register" className="text-green-600 hover:underline font-bold">
                    สร้างบัญชีใหม่
                  </a>
                </p>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-slate-900 mb-4">ประโยชน์ของการสมัครสมาชิก:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>เข้าถึงข้อมูลสิทธิประโยชน์ทั้งหมด</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>บันทึกไฟล์และเอกสารส่วนตัว</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>รับการแจ้งเตือนข้อมูลใหม่</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>ติดตามสถานะการสมัครสิทธิ์</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
