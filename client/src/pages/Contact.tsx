import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        alert("ส่งข้อความสำเร็จ! เราจะติดต่อคุณในเร็วๆ นี้");
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 2000);
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="text-blue-600" size={32} />,
      title: "โทรศัพท์",
      details: ["สายด่วน: 1479", "โทร: 02-XXX-XXXX"],
    },
    {
      icon: <Mail className="text-green-600" size={32} />,
      title: "อีเมล",
      details: ["info@techgreen.go.th", "support@techgreen.go.th"],
    },
    {
      icon: <MapPin className="text-red-600" size={32} />,
      title: "ที่อยู่",
      details: [
        "สำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
        "กรุงเทพมหานคร 10400",
      ],
    },
    {
      icon: <Clock className="text-yellow-600" size={32} />,
      title: "เวลาทำการ",
      details: ["จันทร์-ศุกร์: 08:30-16:30", "หยุดวันหยุดราชการ"],
    },
  ];

  const offices = [
    {
      region: "กรุงเทพ",
      address: "ถนนเพชรบุรี เขตราชเทวี",
      phone: "02-XXX-XXXX",
      email: "bangkok@techgreen.go.th",
    },
    {
      region: "เชียงใหม่",
      address: "ถนนนิมมานหมินท์ เขตเมือง",
      phone: "053-XXX-XXXX",
      email: "chiangmai@techgreen.go.th",
    },
    {
      region: "ขอนแก่น",
      address: "ถนนมิตรภาพ เขตเมือง",
      phone: "043-XXX-XXXX",
      email: "khonkaen@techgreen.go.th",
    },
    {
      region: "สงขลา",
      address: "ถนนสนุนวิถี เขตหาดใหญ่",
      phone: "074-XXX-XXXX",
      email: "songkhla@techgreen.go.th",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-xl text-teal-100">
            เรายินดีที่จะตอบคำถามและให้ความช่วยเหลือแก่คุณ
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition">
                <div className="flex justify-center mb-4">{info.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">ส่งข้อความถึงเรา</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">ส่งข้อความสำเร็จ!</h3>
                  <p className="text-gray-600">เราจะติดต่อคุณในเร็วๆ นี้</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">ชื่อ-นามสกุล</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">หัวข้อ</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">-- เลือกหัวข้อ --</option>
                      <option value="general">คำถามทั่วไป</option>
                      <option value="benefits">เกี่ยวกับสิทธิประโยชน์</option>
                      <option value="application">เกี่ยวกับการยื่นเรื่อง</option>
                      <option value="complaint">ร้องเรียน/ข้อเสนอแนะ</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">ข้อความ</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="กรุณากรอกข้อความของคุณ"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 font-bold">
                    <Send className="mr-2" size={20} />
                    ส่งข้อความ
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">สำนักงานในภูมิภาค</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{office.region}</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p>{office.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-blue-600 flex-shrink-0" />
                    <p>{office.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-green-600 flex-shrink-0" />
                    <p>{office.email}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">ตำแหน่งสำนักงานใหญ่</h2>
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder={0}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5775556846326!2d100.55555!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzIyLjciTiAxMDDCsDMzJzIwLjAiRQ!5e0!3m2!1sth!2sth!4v1234567890"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
