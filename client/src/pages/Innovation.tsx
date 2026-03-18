import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Zap, Award, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Innovation() {
  const innovations = [
    {
      icon: "📱",
      title: "Smart IoT Farming",
      description: "การใช้เซนเซอร์ IoT ในการเกษตร",
      details: [
        "ติดตามความชื้นดิน อุณหภูมิ และแสงแดด",
        "ให้น้ำอัตโนมัติตามความต้องการของพืช",
        "ลดการใช้น้ำ 40-50%",
        "เพิ่มผลผลิต 30-50%",
      ],
      benefits: [
        "ประหยัดน้ำและพลังงาน",
        "เพิ่มผลผลิต",
        "ลดค่าใช้จ่ายแรงงาน",
        "ติดตามแบบเรียลไทม์",
      ],
      cost: "150,000 - 500,000 บาท",
    },
    {
      icon: "☀️",
      title: "Solar Farm",
      description: "การใช้พลังงานแสงอาทิตย์ในการเกษตร",
      details: [
        "ติดตั้งแผงเซลล์แสงอาทิตย์",
        "ลดค่าไฟฟ้า 60-80%",
        "สร้างรายได้เพิ่มเติมจากการขายไฟฟ้า",
        "ใช้ได้นาน 25-30 ปี",
      ],
      benefits: [
        "ประหยัดค่าไฟฟ้า",
        "สร้างรายได้เพิ่มเติม",
        "เป็นมิตรต่อสิ่งแวดล้อม",
        "ลดการปล่อยก๊าซเรือนกระจก",
      ],
      cost: "500,000 - 2,000,000 บาท",
    },
    {
      icon: "🌾",
      title: "Biomass Energy",
      description: "การใช้เศษวัสดุเกษตรเป็นพลังงาน",
      details: [
        "ใช้เศษฟางข้าว ใบไม้ เป็นเชื้อเพลิง",
        "ลดต้นทุนการผลิต 40-60%",
        "สร้างรายได้จากขายเศษวัสดุ",
        "เป็นมิตรต่อสิ่งแวดล้อม",
      ],
      benefits: [
        "ลดต้นทุนการผลิต",
        "สร้างรายได้เพิ่มเติม",
        "ลดมลพิษ",
        "ใช้ทรัพยากรที่มีอยู่",
      ],
      cost: "50,000 - 300,000 บาท",
    },
    {
      icon: "💧",
      title: "Hydro Technology",
      description: "การใช้เทคโนโลยีน้ำในการเกษตร",
      details: [
        "เก็บเกี่ยวน้ำฝน",
        "ลดการใช้น้ำ 50-70%",
        "ระบบน้ำหนึ่งเดียว",
        "ปลูกพืชตามฤดูกาล",
      ],
      benefits: [
        "ประหยัดน้ำ",
        "ลดต้นทุนการรดน้ำ",
        "เพิ่มผลผลิด",
        "ลดความเสี่ยงจากภัยแล้ง",
      ],
      cost: "100,000 - 400,000 บาท",
    },
  ];

  const premiumBenefits = [
    {
      icon: "💯",
      title: "100% Tax Credit",
      description: "ยกเว้นภาษีเงินได้นิติบุคคล 100% เป็นเวลา 5 ปี",
    },
    {
      icon: "📱",
      title: "Digital Branding",
      description: "ได้รับการประชาสัมพันธ์และสร้างแบรนด์ดิจิทัล",
    },
    {
      icon: "🌍",
      title: "ESG Compliance",
      description: "ได้รับการรับรองมาตรฐาน ESG",
    },
    {
      icon: "👨‍🏫",
      title: "Technical Support",
      description: "ได้รับการสนับสนุนทางเทคนิคจากผู้เชี่ยวชาญ",
    },
  ];

  const successStories = [
    {
      name: "โครงการสมาร์ตฟาร์มหนองจอก",
      location: "จังหวัดนครสวรรค์",
      result: "เพิ่มผลผลิด 45% ลดค่าน้ำ 50%",
      year: "2024",
    },
    {
      name: "โครงการพลังงานแสงอาทิตย์บ้านแม่",
      location: "จังหวัดเชียงใหม่",
      result: "ประหยัดค่าไฟ 75% สร้างรายได้ 200,000 บาท/ปี",
      year: "2024",
    },
    {
      name: "โครงการเศษชีววัตถุพลังงาน",
      location: "จังหวัดขอนแก่น",
      result: "ลดต้นทุน 55% สร้างงาน 15 คน",
      year: "2023",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">นวัตกรรมเกษตรสีเขียว</h1>
          <p className="text-xl text-emerald-100">
            เทคโนโลยีสมัยใหม่เพื่อการเกษตรที่ยั่งยืนและเป็นมิตรต่อสิ่งแวดล้อม
          </p>
        </div>
      </section>

      {/* Innovations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">นวัตกรรม 4 ประเภท</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {innovations.map((innovation, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition">
                <div className="text-5xl mb-4">{innovation.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{innovation.title}</h3>
                <p className="text-gray-600 mb-4">{innovation.description}</p>

                <div className="mb-6">
                  <h4 className="font-bold text-slate-900 mb-3">รายละเอียด</h4>
                  <ul className="space-y-2">
                    {innovation.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ประมาณการค่าใช้จ่าย</p>
                  <p className="font-bold text-green-700">{innovation.cost}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3">ประโยชน์</h4>
                  <ul className="space-y-2">
                    {innovation.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <Zap size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">สิทธิประโยชน์พรีเมียม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {premiumBenefits.map((benefit, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">โครงการสำเร็จ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{story.name}</h3>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">{story.year}</span>
                </div>
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <span>📍</span> {story.location}
                </p>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ผลลัพธ์</p>
                  <p className="font-bold text-green-700">{story.result}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">ขั้นตอนการสมัคร</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "ประเมินความเหมาะสม",
                  description: "ประเมินว่าพื้นที่และสภาพของคุณเหมาะสมกับนวัตกรรมใดบ้าง",
                },
                {
                  step: 2,
                  title: "เตรียมแผนธุรกิจ",
                  description: "เตรียมแผนธุรกิจที่มีรายละเอียด รวมถึงการประมาณการรายได้และค่าใช้จ่าย",
                },
                {
                  step: 3,
                  title: "ติดต่อหน่วยงาน",
                  description: "ติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการหรือหน่วยงานที่เกี่ยวข้อง",
                },
                {
                  step: 4,
                  title: "ยื่นเรื่องขอสนับสนุน",
                  description: "ยื่นเรื่องขอสนับสนุนพร้อมเอกสารประกอบ",
                },
                {
                  step: 5,
                  title: "รอการอนุมัติ",
                  description: "รอการตรวจสอบและอนุมัติจากหน่วยงาน",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    {item.step < 5 && <div className="w-1 h-16 bg-green-300"></div>}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">สนใจพัฒนาธุรกิจด้วยนวัตกรรม?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการในจังหวัดของคุณ เพื่อสอบถามข้อมูลและขอความช่วยเหลือ
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
            <FileText className="mr-2" size={20} />
            ดาวน์โหลดคู่มือนวัตกรรม
          </Button>
        </div>
      </section>
    </div>
  );
}
