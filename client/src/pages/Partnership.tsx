import { Card } from "@/components/ui/card";
import { CheckCircle, Users, TrendingUp, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Partnership() {
  const businessCategories = [
    {
      icon: "🌾",
      title: "ธุรกิจเกษตร",
      description: "การปลูกพืช เลี้ยงสัตว์ และการเกษตรอินทรีย์",
      examples: [
        "ปลูกข้าว ข้าวโพด ถั่ว",
        "เลี้ยงปลา ไก่ สัตว์เศษ",
        "เกษตรอินทรีย์",
        "เกษตรสมัยใหม่",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี",
        "สนับสนุนทางเทคนิค",
        "เข้าถึงตลาด",
        "ที่ดินราชพัสดุ",
      ],
    },
    {
      icon: "🏭",
      title: "ธุรกิจแปรรูป",
      description: "การแปรรูปผลิตภัณฑ์เกษตร",
      examples: [
        "แปรรูปข้าว เก็บเกี่ยว",
        "ผลิตแป้ง น้ำตาล",
        "ผลิตน้ำหมักชีวภาพ",
        "ผลิตอาหารสัตว์",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี",
        "สนับสนุนเครื่องจักร",
        "ฝึกอบรมเทคนิค",
        "ช่วยการตลาด",
      ],
    },
    {
      icon: "🎨",
      title: "ธุรกิจหัตถกรรม",
      description: "การผลิตผลิตภัณฑ์หัตถกรรมและสินค้าชุมชน",
      examples: [
        "ทอผ้า ผ้าไหม",
        "ผลิตเครื่องปั้นดินเผา",
        "ผลิตของที่ระลึก",
        "ผลิตสินค้าพื้นบ้าน",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี",
        "ช่วยการตลาด",
        "ฝึกอบรมทักษะ",
        "เข้าถึงตลาดออนไลน์",
      ],
    },
    {
      icon: "🚚",
      title: "ธุรกิจโลจิสติกส์",
      description: "การขนส่ง จัดเก็บ และจัดจำหน่าย",
      examples: [
        "ขนส่งสินค้าเกษตร",
        "บริการเก็บรักษา",
        "บริการจัดจำหน่าย",
        "บริการลอจิสติกส์",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี",
        "สนับสนุนเครื่องจักร",
        "ฝึกอบรมเทคนิค",
        "เข้าถึงเครือข่าย",
      ],
    },
  ];

  const partnershipModels = [
    {
      title: "ความร่วมมือแบบทางตรง",
      description: "ผู้ประกอบการจ้างงานคนพิการโดยตรง",
      requirements: [
        "จ้างงานคนพิการอย่างน้อย 1 คน",
        "จ่ายค่าจ้างตามกฎหมาย",
        "มีสัญญาจ้างเป็นลายลักษณ์อักษร",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี 100% (มาตรา 33)",
        "ลดหย่อนภาษีเพิ่มเติม (มาตรา 35)",
        "ได้รับการประชาสัมพันธ์",
      ],
    },
    {
      title: "ความร่วมมือแบบเครือข่าย",
      description: "ร่วมมือกับวิสาหกิจชุมชนและกลุ่มผู้ประกอบการ",
      requirements: [
        "ลงนามสัญญาความร่วมมือ",
        "มีแผนการร่วมมือ",
        "สนับสนุนการพัฒนาทักษะ",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี",
        "เข้าถึงตลาดใหญ่",
        "ได้รับการสนับสนุนทางเทคนิค",
      ],
    },
    {
      title: "ความร่วมมือแบบ Supply Chain",
      description: "เป็นผู้ผลิต ผู้จัดจำหน่าย หรือผู้ขายปลีก",
      requirements: [
        "ลงนามสัญญา Supply Chain",
        "มีมาตรฐานการผลิต",
        "ตรวจสอบคุณภาพ",
      ],
      benefits: [
        "สิทธิลดหย่อนภาษี",
        "เข้าถึงตลาดสถาบัน",
        "ได้รับการสนับสนุนการตลาด",
      ],
    },
  ];

  const successMetrics = [
    {
      label: "จำนวนวิสาหกิจ",
      value: "65,400+",
      icon: "🏢",
    },
    {
      label: "คนงานจ้าง",
      value: "450,000+",
      icon: "👥",
    },
    {
      label: "รายได้รวม",
      value: "125B บาท",
      icon: "💰",
    },
    {
      label: "อัตราการจ้างคนพิการ",
      value: "15%",
      icon: "📈",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">ความร่วมมือทางธุรกิจ</h1>
          <p className="text-xl text-purple-100">
            โครงสร้างความร่วมมือ 4 หมวดธุรกิจ เพื่อสร้างงานและพัฒนาเศรษฐกิจชุมชน
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-5xl mb-2">{metric.icon}</div>
                <p className="text-3xl font-bold text-purple-600 mb-2">{metric.value}</p>
                <p className="text-gray-600">{metric.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">4 หมวดธุรกิจ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessCategories.map((category, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>

                <div className="mb-6">
                  <h4 className="font-bold text-slate-900 mb-3">ตัวอย่างธุรกิจ</h4>
                  <ul className="space-y-2">
                    {category.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle size={18} className="text-purple-500 mt-1 flex-shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3">สิทธิประโยชน์</h4>
                  <ul className="space-y-2">
                    {category.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <Award size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
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

      {/* Partnership Models */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">รูปแบบความร่วมมือ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipModels.map((model, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{model.title}</h3>
                <p className="text-gray-600 mb-6">{model.description}</p>

                <div className="mb-6">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">เงื่อนไข</h4>
                  <ul className="space-y-2">
                    {model.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">ประโยชน์</h4>
                  <ul className="space-y-2">
                    {model.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <TrendingUp size={16} className="text-blue-500 mt-1 flex-shrink-0" />
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

      {/* How to Join */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">ขั้นตอนการเข้าร่วม</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "ประเมินความเหมาะสม",
                  description: "ประเมินว่าธุรกิจของคุณเหมาะสมกับรูปแบบความร่วมมือใด",
                },
                {
                  step: 2,
                  title: "เตรียมเอกสาร",
                  description: "เตรียมเอกสารที่จำเป็น เช่น ใบทะเบียนธุรกิจ แผนธุรกิจ",
                },
                {
                  step: 3,
                  title: "ติดต่อหน่วยงาน",
                  description: "ติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
                },
                {
                  step: 4,
                  title: "ยื่นเรื่องขอเข้าร่วม",
                  description: "ยื่นเรื่องขอเข้าร่วมพร้อมเอกสารประกอบ",
                },
                {
                  step: 5,
                  title: "ลงนามสัญญา",
                  description: "ลงนามสัญญาความร่วมมือและเริ่มการดำเนินการ",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    {item.step < 5 && <div className="w-1 h-16 bg-purple-300"></div>}
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

      {/* Support Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">บริการสนับสนุน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "👨‍🏫",
                title: "ฝึกอบรมเทคนิค",
                description: "ฝึกอบรมด้านการผลิต การตลาด และการบริหาร",
              },
              {
                icon: "📱",
                title: "สนับสนุนดิจิทัล",
                description: "ช่วยสร้างเว็บไซต์ ร้านค้าออนไลน์ และการตลาดดิจิทัล",
              },
              {
                icon: "🏆",
                title: "ช่วยการตลาด",
                description: "ช่วยเข้าถึงตลาดสถาบัน ตลาดออนไลน์ และตลาดต่างประเทศ",
              },
              {
                icon: "💡",
                title: "ปรึกษาธุรกิจ",
                description: "ให้คำปรึกษาด้านการบริหาร การเงิน และการวางแผน",
              },
            ].map((service, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">พร้อมเข้าร่วมความร่วมมือแล้วหรือ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการในจังหวัดของคุณ เพื่อสอบถามข้อมูลและขอความช่วยเหลือ
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Users className="mr-2" size={20} />
            ติดต่อเราวันนี้
          </Button>
        </div>
      </section>
    </div>
  );
}
