import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Heart, BookOpen, Users, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DisabilityBenefits() {
  const benefitCategories = [
    {
      name: "ผู้ที่ตาบอดข้างเดียว",
      icon: "👁️",
      changes: [
        "เพิ่มเงินเบี้ยรายเดือน 500 บาท",
        "เพิ่มสิทธิการรักษาพยาบาล",
        "เพิ่มสิทธิอุปกรณ์ช่วยมองเห็น",
      ],
      benefits: [
        "เงินเบี้ยรายเดือน",
        "การรักษาพยาบาลครอบคลุม",
        "อุปกรณ์ช่วยมองเห็น",
        "สิทธิการศึกษา",
      ],
    },
    {
      name: "ผู้ที่มีปัญหาการได้ยิน",
      icon: "👂",
      changes: [
        "เพิ่มเงินเบี้ยรายเดือน 500 บาท",
        "เพิ่มสิทธิการรักษาพยาบาล",
        "เพิ่มสิทธิอุปกรณ์ช่วยฟัง",
      ],
      benefits: [
        "เงินเบี้ยรายเดือน",
        "การรักษาพยาบาลครอบคลุม",
        "อุปกรณ์ช่วยฟัง",
        "สิทธิการศึกษา",
      ],
    },
    {
      name: "เด็กที่มีปัญหาการเรียนรู้ (LD)",
      icon: "📚",
      changes: [
        "เพิ่มเงินเบี้ยรายเดือน 300 บาท",
        "เพิ่มสิทธิการศึกษา",
        "สนับสนุนการเรียนพิเศษ",
      ],
      benefits: [
        "เงินเบี้ยรายเดือน",
        "การรักษาพยาบาลครอบคลุม",
        "สิทธิการศึกษาพิเศษ",
        "สนับสนุนการเรียนพิเศษ",
      ],
    },
    {
      name: "กลุ่มออทิสติก",
      icon: "🧩",
      changes: [
        "เพิ่มเงินเบี้ยรายเดือน 300 บาท",
        "เพิ่มสิทธิการรักษาพยาบาล",
        "เพิ่มสิทธิการศึกษา",
      ],
      benefits: [
        "เงินเบี้ยรายเดือน",
        "การรักษาพยาบาลครอบคลุม",
        "สิทธิการศึกษาพิเศษ",
        "สนับสนุนการพัฒนาทักษะ",
      ],
    },
  ];

  const generalBenefits = [
    {
      title: "เงินเบี้ยรายเดือน",
      description: "เงินเบี้ยรายเดือนสำหรับผู้พิการ ตามประเภทและระดับความพิการ เพิ่มขึ้นจากเดิม 10-30%",
      icon: "💰",
    },
    {
      title: "การรักษาพยาบาล",
      description: "สิทธิการรักษาพยาบาลครอบคลุม ทั้งการรักษาทั่วไป การรักษาพิเศษ และการแพทย์ทางเลือก",
      icon: "🏥",
    },
    {
      title: "อุปกรณ์ช่วย",
      description: "อุปกรณ์ช่วยเดิน ช่วยมองเห็น ช่วยฟัง และอุปกรณ์ช่วยอื่นๆ ตามความจำเป็น",
      icon: "🦽",
    },
    {
      title: "การศึกษา",
      description: "สนับสนุนการศึกษาสำหรับเด็กพิการ ตั้งแต่ระดับประถมศึกษาถึงอุดมศึกษา",
      icon: "🎓",
    },
    {
      title: "การจ้างงาน",
      description: "สนับสนุนการหางาน การฝึกอบรม และการพัฒนาทักษะสำหรับผู้พิการ",
      icon: "💼",
    },
    {
      title: "สิทธิอื่นๆ",
      description: "สิทธิการเดินทาง สิทธิการใช้บริการสาธารณะ และสิทธิอื่นๆ ตามกฎหมาย",
      icon: "✈️",
    },
  ];

  const applicationProcess = [
    {
      step: 1,
      title: "เตรียมเอกสาร",
      description: "เตรียมเอกสารที่จำเป็น เช่น บัตรประชาชน ใบรับรองแพทย์ และเอกสารอื่นๆ",
    },
    {
      step: 2,
      title: "ยื่นคำขอ",
      description: "ยื่นคำขอต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ ในจังหวัดของคุณ",
    },
    {
      step: 3,
      title: "ตรวจสอบ",
      description: "เจ้าหน้าที่จะตรวจสอบเอกสารและสัมภาษณ์เพื่อยืนยันสิทธิ์",
    },
    {
      step: 4,
      title: "อนุมัติ",
      description: "หากผ่านการตรวจสอบ คุณจะได้รับการอนุมัติและสามารถเข้าถึงสิทธิประโยชน์",
    },
    {
      step: 5,
      title: "รับสิทธิ",
      description: "รับเงินเบี้ยรายเดือน อุปกรณ์ช่วย และสิทธิประโยชน์อื่นๆ ตามที่ได้รับอนุมัติ",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">สิทธิประโยชน์ผู้พิการ 2568</h1>
          <p className="text-xl text-blue-100">
            ข้อมูลสิทธิประโยชน์ใหม่ที่ได้รับการปรับปรุงตามระเบียบพระราชกฤษฎีกาปี 2568
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="categories">กลุ่มผู้พิการ</TabsTrigger>
              <TabsTrigger value="benefits">สิทธิประโยชน์</TabsTrigger>
              <TabsTrigger value="process">ขั้นตอนการสมัคร</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefitCategories.map((category, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{category.name}</h3>
                    
                    <div className="mb-6">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="text-green-500">✨</span> การเปลี่ยนแปลงใหม่
                      </h4>
                      <ul className="space-y-2">
                        {category.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="text-blue-500">📋</span> สิทธิประโยชน์ทั้งหมด
                      </h4>
                      <ul className="space-y-2">
                        {category.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <Heart size={18} className="text-red-500 mt-1 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {generalBenefits.map((benefit, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition">
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="space-y-8">
              <div className="space-y-6">
                {applicationProcess.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                        {item.step}
                      </div>
                      {index < applicationProcess.length - 1 && (
                        <div className="w-1 h-16 bg-green-300"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="p-8 bg-blue-50 border-blue-200 mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Phone size={24} className="text-blue-600" />
                  ติดต่อสายด่วน
                </h3>
                <p className="text-lg font-bold text-blue-600 mb-2">1479</p>
                <p className="text-gray-700">
                  สามารถติดต่อสายด่วน 1479 เพื่อสอบถามข้อมูลเพิ่มเติมและขอความช่วยเหลือ
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">ข้อมูลสำคัญ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-l-4 border-l-green-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={24} className="text-green-500" />
                เอกสารที่ต้องเตรียม
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ บัตรประชาชน</li>
                <li>✓ ใบรับรองแพทย์</li>
                <li>✓ ใบสำคัญการศึกษา (หากจำเป็น)</li>
                <li>✓ เอกสารอื่นๆ ตามความจำเป็น</li>
              </ul>
            </Card>

            <Card className="p-8 border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={24} className="text-blue-500" />
                ผู้มีสิทธิสมัคร
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ ผู้พิการตามกฎหมาย</li>
                <li>✓ มีสัญชาติไทย</li>
                <li>✓ อาศัยอยู่ในประเทศไทย</li>
                <li>✓ ไม่มีรายได้เกินเกณฑ์</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">พร้อมสมัครแล้วหรือ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการในจังหวัดของคุณ หรือเรียกสายด่วน 1479
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Phone className="mr-2" size={20} />
            โทรสายด่วน 1479
          </Button>
        </div>
      </section>
    </div>
  );
}
