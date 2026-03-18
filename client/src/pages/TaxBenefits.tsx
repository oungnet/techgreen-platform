import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Calculator, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TaxBenefits() {
  const [salaryInput, setSalaryInput] = useState("");
  const [taxResult, setTaxResult] = useState<number | null>(null);

  const calculateTax = () => {
    const salary = parseFloat(salaryInput);
    if (!isNaN(salary) && salary > 0) {
      setTaxResult(salary);
    }
  };

  const taxBenefits = [
    {
      title: "มาตรา 33 - ยกเว้นภาษีเงินได้นิติบุคคล",
      icon: "📋",
      description: "ยกเว้นภาษีเงินได้นิติบุคคลร้อยละ 100 ของค่าจ้างคนพิการ",
      conditions: [
        "จ้างงานคนพิการอย่างน้อย 1 คน",
        "จ่ายค่าจ้างสูงกว่าค่าจ้างขั้นต่ำ",
        "มีสัญญาจ้างเป็นลายลักษณ์อักษร",
      ],
      benefits: [
        "ยกเว้นภาษีเงินได้นิติบุคคล 100%",
        "ระยะเวลา 5 ปี นับจากการจ้างงานครั้งแรก",
        "สามารถต่ออายุได้",
      ],
      example: "หากจ้างคนพิการเดือนละ 15,000 บาท ยกเว้นภาษี = 15,000 บาท/เดือน",
    },
    {
      title: "มาตรา 35 - การให้สัมปทาน/จัดสถานที่/จ้างเหมา",
      icon: "🏢",
      description: "ลดหย่อนภาษีเงินได้นิติบุคคลตามจำนวนเงินที่ใช้จ่าย",
      conditions: [
        "ให้สัมปทานแก่คนพิการ",
        "จัดสถานที่สำหรับคนพิการ",
        "จ้างเหมาบริการสนับสนุนคนพิการ",
      ],
      benefits: [
        "ลดหย่อนภาษีตามจำนวนเงินที่ใช้จ่าย",
        "ไม่จำกัดระยะเวลา",
        "สามารถรวมกับมาตรา 33 ได้",
      ],
      example: "หากใช้จ่าย 100,000 บาท ลดหย่อนภาษี = 100,000 บาท",
    },
    {
      title: "ESG Tax Credit 200%",
      icon: "🌱",
      description: "ลดหย่อนภาษี 200% ของค่าใช้จ่ายในการจ้างงานหรือสนับสนุน",
      conditions: [
        "จ้างงานคนพิการ",
        "สนับสนุนชุมชน",
        "สนับสนุนสิ่งแวดล้อม",
      ],
      benefits: [
        "ลดหย่อนภาษี 200% ของค่าใช้จ่าย",
        "ไม่จำกัดระยะเวลา",
        "สามารถรวมกับมาตรา 33 ได้",
      ],
      example: "หากใช้จ่าย 50,000 บาท ลดหย่อนภาษี = 100,000 บาท",
    },
  ];

  const requirements = [
    {
      title: "สำหรับมาตรา 33",
      items: [
        "จ้างงานคนพิการอย่างน้อย 1 คน",
        "จ่ายค่าจ้างสูงกว่าค่าจ้างขั้นต่ำ",
        "มีสัญญาจ้างเป็นลายลักษณ์อักษร",
        "ทำการประกาศต่อสำนักงานสรรพากร",
      ],
    },
    {
      title: "สำหรับมาตรา 35",
      items: [
        "มีเอกสารแสดงการใช้จ่าย",
        "มีใบเสร็จหรือใบอนุมัติ",
        "เก็บเอกสารไว้อย่างน้อย 5 ปี",
        "ยื่นรายการหักลดหย่อนต่อสำนักงานสรรพากร",
      ],
    },
    {
      title: "สำหรับ ESG Tax Credit",
      items: [
        "มีเอกสารแสดงการใช้จ่าย",
        "ได้รับการรับรองจากหน่วยงานที่เกี่ยวข้อง",
        "ยื่นรายการหักลดหย่อนต่อสำนักงานสรรพากร",
        "เก็บเอกสารไว้อย่างน้อย 5 ปี",
      ],
    },
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "ตรวจสอบคุณสมบัติ",
      description: "ตรวจสอบว่าธุรกิจของคุณมีคุณสมบัติตรงตามเกณฑ์หรือไม่",
    },
    {
      step: 2,
      title: "เตรียมเอกสาร",
      description: "เตรียมเอกสารที่จำเป็น เช่น สัญญาจ้าง ใบเสร็จ เอกสารอื่นๆ",
    },
    {
      step: 3,
      title: "ติดต่อสำนักงานสรรพากร",
      description: "ติดต่อสำนักงานสรรพากรในเขตของคุณเพื่อสอบถามรายละเอียด",
    },
    {
      step: 4,
      title: "ยื่นเรื่อง",
      description: "ยื่นเรื่องขอหักลดหย่อนภาษีพร้อมเอกสารประกอบ",
    },
    {
      step: 5,
      title: "รับการอนุมัติ",
      description: "รอการตรวจสอบและอนุมัติจากสำนักงานสรรพากร",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">สิทธิลดหย่อนภาษี</h1>
          <p className="text-xl text-green-100">
            สิทธิลดหย่อนภาษีสำหรับสถานประกอบการที่จ้างงานคนพิการหรือสนับสนุนชุมชน
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Tax Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {taxBenefits.map((benefit, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-bold text-green-700 mb-2">ตัวอย่าง:</p>
                  <p className="text-sm text-gray-700">{benefit.example}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="calculator">เครื่องคำนวณ</TabsTrigger>
              <TabsTrigger value="requirements">เงื่อนไข</TabsTrigger>
              <TabsTrigger value="process">ขั้นตอน</TabsTrigger>
            </TabsList>

            {/* Calculator Tab */}
            <TabsContent value="calculator" className="space-y-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calculator size={28} className="text-green-600" />
                  เครื่องคำนวณสิทธิลดหย่อนภาษี
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">มาตรา 33 - ยกเว้นภาษี 100%</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ค่าจ้างคนพิการต่อเดือน (บาท)
                        </label>
                        <input
                          type="number"
                          value={salaryInput}
                          onChange={(e) => setSalaryInput(e.target.value)}
                          placeholder="เช่น 15000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <Button onClick={calculateTax} className="w-full bg-green-600 hover:bg-green-700">
                        <Calculator className="mr-2" size={20} />
                        คำนวณ
                      </Button>
                    </div>
                  </div>

                  {/* Result Section */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">ผลการคำนวณ</h4>
                    {taxResult !== null ? (
                      <div className="space-y-4">
                        <Card className="p-6 bg-green-50 border-green-200">
                          <p className="text-sm text-gray-600 mb-2">ยกเว้นภาษีต่อเดือน</p>
                          <p className="text-4xl font-bold text-green-600">{taxResult.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-2">บาท</p>
                        </Card>
                        <Card className="p-6 bg-blue-50 border-blue-200">
                          <p className="text-sm text-gray-600 mb-2">ยกเว้นภาษีต่อปี</p>
                          <p className="text-4xl font-bold text-blue-600">{(taxResult * 12).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-2">บาท</p>
                        </Card>
                        <Card className="p-6 bg-purple-50 border-purple-200">
                          <p className="text-sm text-gray-600 mb-2">ยกเว้นภาษี 5 ปี</p>
                          <p className="text-4xl font-bold text-purple-600">{(taxResult * 12 * 5).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-2">บาท</p>
                        </Card>
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-100 rounded-lg text-center">
                        <p className="text-gray-600">กรุณากรอกค่าจ้างเพื่อคำนวณ</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-yellow-900 mb-2">หมายเหตุ</h4>
                      <p className="text-sm text-yellow-800">
                        การคำนวณนี้เป็นตัวอย่างเท่านั้น สำหรับการคำนวณที่แม่นยำ กรุณาติดต่อสำนักงานสรรพากรหรือที่ปรึกษาภาษี
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {requirements.map((req, index) => (
                  <Card key={index} className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{req.title}</h3>
                    <ul className="space-y-3">
                      {req.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="space-y-8">
              <div className="space-y-6">
                {applicationSteps.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                        {item.step}
                      </div>
                      {index < applicationSteps.length - 1 && (
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
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">ข้อมูลเพิ่มเติม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-l-4 border-l-green-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={24} className="text-green-500" />
                เอกสารที่ต้องเตรียม
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ สัญญาจ้างเป็นลายลักษณ์อักษร</li>
                <li>✓ ใบเสร็จค่าจ้าง</li>
                <li>✓ ใบรับรองแพทย์ (สำหรับคนพิการ)</li>
                <li>✓ เอกสารอื่นๆ ตามความจำเป็น</li>
              </ul>
            </Card>

            <Card className="p-8 border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-blue-500" />
                ประโยชน์ที่ได้รับ
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ ลดค่าใช้จ่ายในการจ้างงาน</li>
                <li>✓ เพิ่มความสามารถในการแข่งขัน</li>
                <li>✓ ได้รับการรับรองจากภาครัฐ</li>
                <li>✓ สนับสนุนการพัฒนาชุมชน</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">ต้องการสมัครหรือสอบถามข้อมูล?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ติดต่อสำนักงานสรรพากรในเขตของคุณ หรือติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <FileText className="mr-2" size={20} />
            ดาวน์โหลดคู่มือการสมัคร
          </Button>
        </div>
      </section>
    </div>
  );
}
