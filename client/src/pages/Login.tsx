import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

type LocalAuthMode = "login" | "register";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<LocalAuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLocalAuth = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const endpoint =
        mode === "register"
          ? "/api/auth/local/register"
          : "/api/auth/local/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Authentication failed");
      }

      if (mode === "register") {
        setMessage("สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
      } else {
        setMessage("เข้าสู่ระบบสำเร็จ กำลังพาไปหน้าโปรไฟล์...");
        window.location.href = "/profile";
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "ไม่สามารถดำเนินการได้"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container">
          <Card className="mx-auto max-w-xl rounded-2xl border-slate-200 p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">คุณเข้าสู่ระบบแล้ว</h1>
            <p className="mt-3 text-slate-600">ยินดีต้อนรับสู่ TechGreen Platform</p>
            <Button className="mt-6" onClick={() => (window.location.href = "/profile")}>
              ไปยังหน้าโปรไฟล์
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#e6f4ff,_#f8fafc_50%,_#eef2ff)] py-10">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-2xl border-slate-200 bg-white/90 p-7 shadow-sm">
            <p className="text-sm font-medium text-emerald-700">Ban Non-Yai Smarter</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">ระบบสมาชิกอัจฉริยะ</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              รองรับการเข้าสู่ระบบผ่าน Email/Password และ Social Login สำหรับชุมชนดิจิทัลที่ปลอดภัย
              พร้อมโครงสร้างสิทธิ์ Admin/User
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <a href="/api/auth/google">
                <Button variant="outline" className="w-full border-slate-300">
                  Google
                </Button>
              </a>
              <a href="/api/auth/facebook">
                <Button variant="outline" className="w-full border-slate-300">
                  Facebook
                </Button>
              </a>
              <a href={getLoginUrl()}>
                <Button variant="outline" className="w-full border-slate-300">
                  Manus OAuth
                </Button>
              </a>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            <form onSubmit={submitLocalAuth} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">ชื่อผู้ใช้</label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="เช่น Ban Non-Yai Member"
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">อีเมล</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "กำลังดำเนินการ..." : mode === "register" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </Button>
            </form>

            {message && (
              <Alert className="mt-4 border-emerald-200 bg-emerald-50">
                <AlertTitle>สำเร็จ</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
