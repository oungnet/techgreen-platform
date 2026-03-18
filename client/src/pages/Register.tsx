import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, Lock, User, Phone, MapPin, FileText } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    userType: "disability",
    fullName: "",
    email: "",
    phone: "",
    idCard: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรวจสอบความถูกต้องของฟอร์ม
    if (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.idCard &&
      formData.password === formData.confirmPassword
    ) {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบรหัสผ่าน");
    }
  };

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
                {/* User Type */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">ประเภทผู้ใช้</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="disability">ผู้พิการ</option>
                    <option value="entrepreneur">ผู้ประกอบการ</option>
                    <option value="government">เจ้าหน้าที่ภาครัฐ</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">ชื่อ-นามสกุล</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* ID Card */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">เลขบัตรประชาชน</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="idCard"
                      value={formData.idCard}
                      onChange={handleChange}
                      placeholder="X-XXXX-XXXXX-XX-X"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">รหัสผ่าน</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="กรุณากรอกรหัสผ่าน"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">ยืนยันรหัสผ่าน</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="กรุณายืนยันรหัสผ่าน"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
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
                    ฉันยอมรับ <a href="#" className="text-blue-600 hover:underline">เงื่อนไขการใช้บริการ</a> และ{" "}
                    <a href="#" className="text-blue-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold">
                  สร้างบัญชี
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    มีบัญชีอยู่แล้ว?{" "}
                    <a href="/login" className="text-blue-600 hover:underline font-bold">
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
