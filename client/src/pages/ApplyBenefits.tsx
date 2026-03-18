import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CheckCircle, FileText, Upload } from "lucide-react";

export default function ApplyBenefits() {
  const [activeTab, setActiveTab] = useState("disability");
  const [formData, setFormData] = useState({
    fullName: "",
    idCard: "",
    phone: "",
    email: "",
    disabilityType: "",
    medicalCertificate: null as File | null,
    bankAccount: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        medicalCertificate: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.idCard && formData.phone && formData.email) {
      setSubmitted(true);
      setTimeout(() => {
        alert("ยื่นเรื่องสำเร็จ! เราจะติดต่อคุณในเร็วๆ นี้");
        setSubmitted(false);
        setFormData({
          fullName: "",
          idCard: "",
          phone: "",
          email: "",
          disabilityType: "",
          medicalCertificate: null,
          bankAccount: "",
          notes: "",
        });
      }, 2000);
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const benefitTypes = [
    {
      id: "disability",
      title: "สิทธิประโยชน์ผู้พิการ",
      description: "สิทธิประโยชน์พื้นฐานสำหรับผู้พิการทั้งหมด",
      benefits: [
        "เบี้ยความพิการ 1,000 บาท/เดือน",
        "ค่าครองชีพเพิ่มเติม 500 บาท/เดือน",
        "ค่าการศึกษา 5,000 บาท/ปี",
      ],
    },
    {
      id: "tax",
      title: "สิทธิลดหย่อนภาษี",
      description: "สิทธิลดหย่อนภาษีสำหรับผู้ประกอบการ",
      benefits: [
        "ลดหย่อนภาษี 100% (มาตรา 33)",
        "ลดหย่อนภาษีเพิ่มเติม (มาตรา 35)",
        "ESG Tax Credit",
      ],
    },
    {
      id: "land",
      title: "ที่ดินราชพัสดุ",
      description: "สิทธิการเช่าที่ดินราชพัสดุ",
      benefits: [
        "ค่าเช่าถูกกว่า 80%",
        "ระยะเวลาเช่า 3-5 ปี",
        "สนับสนุนการพัฒนา",
      ],
    },
    {
      id: "innovation",
      title: "นวัตกรรมเกษตร",
      description: "สนับสนุนการใช้นวัตกรรมเกษตร",
      benefits: [
        "ทุนอุดหนุน 50,000 บาท",
        "ฝึกอบรมเทคนิค",
        "สนับสนุนการตลาด",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">ยื่นคำขอสิทธิประโยชน์</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            เลือกประเภทสิทธิประโยชน์ที่คุณต้องการและกรอกแบบฟอร์มด้านล่าง
          </p>
        </div>

        {/* Benefit Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefitTypes.map((type) => (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition ${
                activeTab === type.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-lg"
              }`}
              onClick={() => setActiveTab(type.id)}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <ul className="space-y-2">
                {type.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <Card className="p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">แบบฟอร์มยื่นคำขอ</h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">ยื่นเรื่องสำเร็จ!</h3>
              <p className="text-gray-600 mb-4">เราจะติดต่อคุณในเร็วๆ นี้เพื่อยืนยันข้อมูล</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">ข้อมูลส่วนตัว</h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">ชื่อ-นามสกุล</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* ID Card */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">เลขบัตรประชาชน</label>
                    <input
                      type="text"
                      name="idCard"
                      value={formData.idCard}
                      onChange={handleChange}
                      placeholder="X-XXXX-XXXXX-XX-X"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08X-XXX-XXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">อีเมล</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Benefit Details */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">รายละเอียดสิทธิประโยชน์</h3>

                <div className="space-y-4">
                  {/* Disability Type */}
                  {activeTab === "disability" && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">ประเภทความพิการ</label>
                      <select
                        name="disabilityType"
                        value={formData.disabilityType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- เลือกประเภท --</option>
                        <option value="blind">ตาบอด</option>
                        <option value="deaf">หูหนวก</option>
                        <option value="physical">พิการทางกล</option>
                        <option value="mental">พิการทางจิตใจ</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                  )}

                  {/* Medical Certificate */}
                  {activeTab === "disability" && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">ใบรับรองแพทย์</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="medicalCert"
                          accept=".pdf,.jpg,.png"
                        />
                        <label htmlFor="medicalCert" className="cursor-pointer">
                          <p className="text-sm font-bold text-gray-700">
                            {formData.medicalCertificate
                              ? formData.medicalCertificate.name
                              : "คลิกเพื่ออัปโหลดไฟล์"}
                          </p>
                          <p className="text-xs text-gray-500">PDF, JPG, PNG (สูงสุด 5MB)</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Bank Account */}
                  {activeTab === "disability" && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">เลขบัญชีธนาคาร</label>
                      <input
                        type="text"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleChange}
                        placeholder="XXXX-X-XXXXX-X"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">หมายเหตุเพิ่มเติม</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="กรุณากรอกข้อมูลเพิ่มเติมหากมี"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-bold">
                <FileText className="mr-2" size={20} />
                ยื่นคำขอ
              </Button>
            </form>
          )}
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">คำถามที่พบบ่อย</h2>
          <div className="space-y-4">
            {[
              {
                q: "ใช้เวลานานเท่าไรในการอนุมัติ?",
                a: "โดยปกติใช้เวลา 7-14 วันในการตรวจสอบและอนุมัติ",
              },
              {
                q: "ต้องเตรียมเอกสารอะไรบ้าง?",
                a: "บัตรประชาชน ใบรับรองแพทย์ สำเนาสมุดบัญชีธนาคาร",
              },
              {
                q: "สามารถยื่นเรื่องหลายประเภทได้หรือไม่?",
                a: "ได้ แต่ต้องยื่นแบบฟอร์มแยกสำหรับแต่ละประเภท",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-4">
                <h4 className="font-bold text-slate-900 mb-2">❓ {item.q}</h4>
                <p className="text-gray-600">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
