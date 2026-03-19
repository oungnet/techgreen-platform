import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, Lock, User, Phone, MapPin, FileText, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);
    // ในการใช้งานจริง จะเชื่อมต่อกับ backend API
    // ตอนนี้ใช้ Manus OAuth เพื่อสมัครสมาชิก
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = getLoginUrl();
      }, 2000);
    }, 1000);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">คุณได้ลงทะเบียนแล้ว!</h1>
              <p className="text-gray-600 mb-6">ยินดีต้อนรับเข้าสู่ TechGreen Platform</p>
              <Button className="bg-green-500 hover:bg-green-600" onClick={() => window.location.href = "/"}>
                กลับไปหน้าแรก
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">สร้างบัญชีใหม่</h1>
              <p className="text-gray-600">ลงทะเบียนเพื่อเข้าใช้งานแพลตฟอร์ม TechGreen</p>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">ลงทะเบียนสำเร็จ!</h2>
                <p className="text-gray-600 mb-4">กำลังเปลี่ยนไปยังหน้าเข้าสู่ระบบ...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">ชื่อ-นามสกุล</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">อีเมล</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08X-XXX-XXXX"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">ที่อยู่</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="กรุณากรอกที่อยู่"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    ฉันยอมรับ <a href="#" className="text-green-600 hover:underline">เงื่อนไขการใช้บริการ</a> และ{" "}
                    <a href="#" className="text-green-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 font-bold"
                >
                  {isLoading ? "กำลังสมัครสมาชิก..." : "สร้างบัญชี"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-600">หรือ</span>
                  </div>
                </div>

                {/* OAuth Login */}
                <a href={getLoginUrl()}>
                  <Button variant="outline" className="w-full">
                    <span className="mr-2">🔐</span> เข้าสู่ระบบด้วย Manus
                  </Button>
                </a>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    มีบัญชีอยู่แล้ว?{" "}
                    <a href={getLoginUrl()} className="text-green-600 hover:underline font-bold">
                      เข้าสู่ระบบ
                    </a>
                  </p>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
