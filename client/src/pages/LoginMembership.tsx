import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Loader2 } from "lucide-react";

type LocalAuthMode = "login" | "register";

export default function LoginMembership() {
  const { isAuthenticated, refresh } = useAuth();
  const [mode, setMode] = useState<LocalAuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const registerMutation = trpc.membership.register.useMutation();
  const loginMutation = trpc.membership.login.useMutation();
  const verifyEmailMutation = trpc.membership.verifyEmail.useMutation();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await registerMutation.mutateAsync({
        email,
        password,
        name,
        phone: phone || undefined,
      });

      setVerificationToken(result.emailVerificationToken);
      setShowVerification(true);
      setMessage("สมัครสมาชิกสำเร็จ! กรุณายืนยันอีเมลของคุณ");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถสมัครสมาชิกได้"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
      });

      setMessage("เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าโปรไฟล์...");
      setEmail("");
      setPassword("");

      // Refresh auth state
      setTimeout(() => {
        refresh();
        window.location.href = "/profile";
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถเข้าสู่ระบบได้"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await verifyEmailMutation.mutateAsync({
        token: verificationToken,
      });

      setMessage("ยืนยันอีเมลสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว");
      setShowVerification(false);
      setVerificationToken("");
      setMode("login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถยืนยันอีเมลได้"
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

  if (showVerification) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#e6f4ff,_#f8fafc_50%,_#eef2ff)] py-10">
        <div className="container">
          <div className="mx-auto max-w-md">
            <Card className="rounded-2xl border-slate-200 bg-white p-7 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">ยืนยันอีเมล</h1>
              <p className="text-sm text-slate-600 mb-6">
                เราได้ส่งลิงก์ยืนยันไปยังอีเมลของคุณ กรุณากรอกโทเค็นที่ได้รับ
              </p>

              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    โทเค็นยืนยัน
                  </label>
                  <Input
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    placeholder="กรุณากรอกโทเค็นยืนยัน"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      กำลังยืนยัน...
                    </>
                  ) : (
                    "ยืนยันอีเมล"
                  )}
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

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationToken("");
                }}
              >
                กลับไป
              </Button>
            </Card>
          </div>
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

            <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">ชื่อผู้ใช้</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  required
                />
              </div>

              {mode === "register" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">เบอร์โทรศัพท์ (ไม่บังคับ)</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "register" ? "กำลังสมัครสมาชิก..." : "กำลังเข้าสู่ระบบ..."}
                  </>
                ) : (
                  mode === "register" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"
                )}
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
