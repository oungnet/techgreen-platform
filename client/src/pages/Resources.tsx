import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, FileText, CheckCircle, HelpCircle, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Resources() {
  const landInfo = {
    total: "12,450 ไร่",
    provinces: "ทั่วประเทศ",
    discount: "80%",
    rentalPrice: "ถูกกว่าราคาตลาด",
  };

  const bookingProcess = [
    {
      step: 1,
      title: "เลือกทำเล",
      description: "ค้นหาและเลือกพื้นที่ที่สนใจจากแผนที่ของเรา",
      details: [
        "ดูข้อมูลพื้นที่โดยละเอียด",
        "ตรวจสอบสภาพและสิ่งอำนวยความสะดวก",
        "ดูรูปภาพและวิดีโอ",
      ],
    },
    {
      step: 2,
      title: "ตรวจสอบคุณสมบัติ",
      description: "ตรวจสอบว่าคุณมีคุณสมบัติในการจองหรือไม่",
      details: [
        "เป็นผู้พิการตามกฎหมาย",
        "เป็นวิสาหกิจชุมชน",
        "จ้างงานคนพิการ",
      ],
    },
    {
      step: 3,
      title: "ยื่นแผนธุรกิจ",
      description: "ยื่นแผนธุรกิจและรอการอนุมัติ",
      details: [
        "เตรียมแผนธุรกิจโดยละเอียด",
        "ประมาณการรายได้และค่าใช้จ่าย",
        "อธิบายวิธีการสร้างงาน",
      ],
    },
    {
      step: 4,
      title: "ลงนามสัญญา",
      description: "ลงนามสัญญาเช่าพื้นที่",
      details: [
        "ตรวจสอบเงื่อนไขสัญญา",
        "ชำระค่าประกันและค่าเช่าแรก",
        "รับกุญแจและเข้าใช้พื้นที่",
      ],
    },
  ];

  const faqItems = [
    {
      question: "ค่าเช่าพื้นที่เท่าไร?",
      answer: "ค่าเช่าพื้นที่ราชพัสดุถูกกว่าราคาตลาด 80% ขึ้นอยู่กับสภาพและสถานที่ตั้ง โดยเฉลี่ยประมาณ 50-200 บาท/ตารางวา",
    },
    {
      question: "งบประมาณสำหรับ IoT/นวัตกรรมเท่าไร?",
      answer: "มีงบประมาณสนับสนุนสำหรับการติดตั้ง IoT และนวัตกรรมเกษตร ขึ้นอยู่กับโครงการและความเหมาะสม สามารถสอบถามรายละเอียดได้",
    },
    {
      question: "ขั้นตอนการจองเป็นอย่างไร?",
      answer: "ขั้นตอนการจองประกอบด้วย 4 ขั้น: เลือกทำเล ตรวจสอบคุณสมบัติ ยื่นแผนธุรกิจ และลงนามสัญญา",
    },
    {
      question: "ใครมีสิทธิจองพื้นที่?",
      answer: "ผู้พิการ วิสาหกิจชุมชน สถานประกอบการที่จ้างงานคนพิการ และผู้ประกอบการที่สนใจพัฒนาธุรกิจเกษตรสีเขียว",
    },
    {
      question: "ระยะเวลาการเช่าเป็นเท่าไร?",
      answer: "ระยะเวลาการเช่าปกติ 3-5 ปี สามารถต่ออายุได้ตามเงื่อนไขของสัญญา",
    },
    {
      question: "สามารถโอนสิทธิ์การเช่าได้หรือไม่?",
      answer: "สามารถโอนสิทธิ์ได้ แต่ต้องได้รับการอนุมัติจากเจ้าของพื้นที่และตรวจสอบคุณสมบัติของผู้รับโอน",
    },
  ];

  const benefits = [
    {
      icon: "💰",
      title: "ค่าเช่าถูก",
      description: "ค่าเช่าถูกกว่าราคาตลาด 80% เพื่อลดค่าใช้จ่ายในการประกอบธุรกิจ",
    },
    {
      icon: "📍",
      title: "สถานที่ยุทธศาสตร์",
      description: "พื้นที่ตั้งอยู่ในสถานที่ที่มีศักยภาพและเข้าถึงได้ง่าย",
    },
    {
      icon: "🏢",
      title: "สิ่งอำนวยความสะดวก",
      description: "มีสิ่งอำนวยความสะดวกครบครัน เช่น ไฟฟ้า น้ำ ถนน",
    },
    {
      icon: "📋",
      title: "สิทธิ์มาตรา 35",
      description: "ได้รับสิทธิลดหย่อนภาษีตามมาตรา 35 (ข)",
    },
    {
      icon: "🎓",
      title: "สนับสนุนเทคนิค",
      description: "ได้รับการสนับสนุนทางเทคนิคและการฝึกอบรม",
    },
    {
      icon: "🤝",
      title: "เครือข่าย",
      description: "เข้าร่วมเครือข่ายผู้ประกอบการและชุมชน",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">ทรัพยากรและพื้นที่ราชพัสดุ</h1>
          <p className="text-xl text-yellow-100">
            ที่ดินราชพัสดุ {landInfo.total} ทั่ว{landInfo.provinces} ค่าเช่า{landInfo.rentalPrice}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <p className="text-4xl font-bold text-yellow-600 mb-2">{landInfo.total}</p>
              <p className="text-gray-600">ที่ดินราชพัสดุทั้งหมด</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">{landInfo.discount}</p>
              <p className="text-gray-600">ถูกกว่าราคาตลาด</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">3-5</p>
              <p className="text-gray-600">ปี ระยะเวลาเช่า</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">77</p>
              <p className="text-gray-600">จังหวัด</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">ประโยชน์ของการเช่าพื้นที่ราชพัสดุ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="booking">ขั้นตอนการจอง</TabsTrigger>
              <TabsTrigger value="requirements">เงื่อนไข</TabsTrigger>
              <TabsTrigger value="faq">คำถามที่พบบ่อย</TabsTrigger>
            </TabsList>

            {/* Booking Process Tab */}
            <TabsContent value="booking" className="space-y-8">
              <div className="space-y-8">
                {bookingProcess.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                        {item.step}
                      </div>
                      {index < bookingProcess.length - 1 && (
                        <div className="w-1 h-32 bg-yellow-300"></div>
                      )}
                    </div>
                    <div className="pb-6 flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-l-4 border-l-green-500">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users size={24} className="text-green-500" />
                    ผู้มีสิทธิจองพื้นที่
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">ผู้พิการตามกฎหมาย</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">วิสาหกิจชุมชน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">สถานประกอบการที่จ้างงานคนพิการ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">ผู้ประกอบการเกษตรสีเขียว</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-8 border-l-4 border-l-blue-500">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText size={24} className="text-blue-500" />
                    เอกสารที่ต้องเตรียม
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">บัตรประชาชน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">แผนธุรกิจ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">ใบรับรองแพทย์ (หากเป็นผู้พิการ)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">เอกสารอื่นๆ ตามความจำเป็น</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-2">
                    <HelpCircle size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
                    {item.question}
                  </h3>
                  <p className="text-gray-700 ml-7">{item.answer}</p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="p-6 bg-white text-slate-900">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-yellow-600" />
                สำนักงานใหญ่
              </h3>
              <p className="text-sm">กรุงเทพมหานคร</p>
            </Card>
            <Card className="p-6 bg-white text-slate-900">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FileText size={20} className="text-yellow-600" />
                ติดต่อ
              </h3>
              <p className="text-sm">info@techgreen2025.go.th</p>
            </Card>
            <Card className="p-6 bg-white text-slate-900">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={20} className="text-yellow-600" />
                สายด่วน
              </h3>
              <p className="text-sm">1479</p>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">พร้อมจองพื้นที่แล้วหรือ?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              ติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการในจังหวัดของคุณ หรือเรียกสายด่วน 1479
            </p>
            <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
              <MapPin className="mr-2" size={20} />
              ค้นหาพื้นที่ใกล้คุณ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
