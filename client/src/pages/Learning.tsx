import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Video, Download, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Learning() {
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      id: 1,
      title: "คู่มือการสมัครสิทธิประโยชน์ผู้พิการ 2568",
      category: "สิทธิประโยชน์",
      author: "สำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
      date: "2024-03-15",
      excerpt: "คำแนะนำทีละขั้นตอนในการสมัครสิทธิประโยชน์ใหม่สำหรับผู้พิการ ปี 2568 รวมถึงเอกสารที่ต้องเตรียมและสถานที่ติดต่อ",
      readTime: "8 นาที",
      icon: "📋",
    },
    {
      id: 2,
      title: "วิธีการจ้างงานคนพิการเพื่อลดหย่อนภาษี",
      category: "ภาษี",
      author: "สำนักงานสรรพากร",
      date: "2024-03-10",
      excerpt: "อธิบายรายละเอียดเกี่ยวกับมาตรา 33 มาตรา 35 และ ESG Tax Credit วิธีการคำนวณและเอกสารที่ต้องเตรียม",
      readTime: "10 นาที",
      icon: "💰",
    },
    {
      id: 3,
      title: "การใช้ Smart IoT Farming เพื่อเพิ่มผลผลิด",
      category: "นวัตกรรม",
      author: "สำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
      date: "2024-03-05",
      excerpt: "บทความเกี่ยวกับการใช้เซนเซอร์ IoT ในการเกษตร ประโยชน์ ต้นทุน และตัวอย่างการใช้งาน",
      readTime: "12 นาที",
      icon: "📱",
    },
    {
      id: 4,
      title: "ขั้นตอนการจองพื้นที่ราชพัสดุ",
      category: "ทรัพยากร",
      author: "สำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
      date: "2024-02-28",
      excerpt: "คู่มือการจองพื้นที่ราชพัสดุ เงื่อนไข ขั้นตอน และข้อมูลการติดต่อ",
      readTime: "7 นาที",
      icon: "🏢",
    },
    {
      id: 5,
      title: "แนวทางการสร้างวิสาหกิจชุมชนสำหรับผู้พิการ",
      category: "ธุรกิจ",
      author: "สำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
      date: "2024-02-20",
      excerpt: "บทความเกี่ยวกับการสร้างวิสาหกิจชุมชน ขั้นตอนการจดทะเบียน และการขอสนับสนุนจากภาครัฐ",
      readTime: "11 นาที",
      icon: "🤝",
    },
    {
      id: 6,
      title: "การตลาดดิจิทัลสำหรับวิสาหกิจชุมชน",
      category: "การตลาด",
      author: "สำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
      date: "2024-02-15",
      excerpt: "วิธีการสร้างเว็บไซต์ ร้านค้าออนไลน์ และการใช้สื่อสังคมเพื่อการตลาด",
      readTime: "9 นาที",
      icon: "📱",
    },
  ];

  const guides = [
    {
      title: "คู่มือสิทธิประโยชน์ผู้พิการ 2568",
      description: "เอกสารครบถ้วนเกี่ยวกับสิทธิประโยชน์ใหม่ทั้งหมด",
      fileSize: "2.5 MB",
      format: "PDF",
      downloads: "15,234",
    },
    {
      title: "คู่มือการจ้างงานคนพิการ",
      description: "แนวทางการจ้างงานและการสนับสนุนสำหรับนายจ้าง",
      fileSize: "1.8 MB",
      format: "PDF",
      downloads: "8,456",
    },
    {
      title: "แบบฟอร์มการสมัครสิทธิประโยชน์",
      description: "แบบฟอร์มพร้อมใช้สำหรับการสมัครสิทธิประโยชน์",
      fileSize: "0.5 MB",
      format: "DOCX",
      downloads: "12,789",
    },
    {
      title: "ข้อมูลทรัพยากรและที่ดินราชพัสดุ",
      description: "รายชื่อและข้อมูลพื้นที่ราชพัสดุทั่วประเทศ",
      fileSize: "3.2 MB",
      format: "XLSX",
      downloads: "5,678",
    },
  ];

  const faqs = [
    {
      question: "ผู้พิการประเภทใดได้รับสิทธิประโยชน์?",
      answer: "ผู้พิการตามกฎหมายทั้งหมด ได้แก่ ตาบอด หูหนวก พิการทางกล พิการทางจิตใจ และประเภทอื่นๆ ที่ได้รับการรับรองจากแพทย์",
    },
    {
      question: "สิทธิลดหย่อนภาษีใช้ได้นานเท่าไร?",
      answer: "สิทธิลดหย่อนภาษีตามมาตรา 33 ใช้ได้เป็นเวลา 5 ปี นับจากการจ้างงานครั้งแรก สามารถต่ออายุได้ตามเงื่อนไข",
    },
    {
      question: "ค่าเช่าพื้นที่ราชพัสดุเท่าไร?",
      answer: "ค่าเช่าพื้นที่ราชพัสดุถูกกว่าราคาตลาด 80% โดยเฉลี่ยประมาณ 50-200 บาท/ตารางวา ขึ้นอยู่กับสภาพและสถานที่ตั้ง",
    },
    {
      question: "สามารถจองพื้นที่ราชพัสดุได้นานเท่าไร?",
      answer: "ระยะเวลาการเช่าปกติ 3-5 ปี สามารถต่ออายุได้ตามเงื่อนไขของสัญญา",
    },
    {
      question: "นวัตกรรมเกษตรใดได้รับสนับสนุนมากที่สุด?",
      answer: "นวัตกรรมที่ได้รับสนับสนุนมากที่สุด ได้แก่ Smart IoT Farming Solar Farm Biomass Energy และ Hydro Technology",
    },
    {
      question: "ติดต่อใครเพื่อขอความช่วยเหลือ?",
      answer: "สามารถติดต่อสำนักงานส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการในจังหวัดของคุณ หรือเรียกสายด่วน 1479",
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">ศูนย์การเรียนรู้</h1>
          <p className="text-xl text-indigo-100">
            บทความ คู่มือ และทรัพยากรการเรียนรู้สำหรับผู้พิการ ผู้ประกอบการ และเจ้าหน้าที่ภาครัฐ
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="articles">บทความ</TabsTrigger>
              <TabsTrigger value="guides">คู่มือ</TabsTrigger>
              <TabsTrigger value="faq">คำถามที่พบบ่อย</TabsTrigger>
              <TabsTrigger value="resources">ทรัพยากร</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-8">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาบทความ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="p-6 hover:shadow-lg transition cursor-pointer">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{article.icon}</div>
                      <div className="flex-1">
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                          {article.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">{article.title}</h3>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{article.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex gap-4">
                        <span>✍️ {article.author}</span>
                        <span>📅 {article.date}</span>
                      </div>
                      <span>⏱️ {article.readTime}</span>
                    </div>

                    <div className="mt-4 flex items-center text-indigo-600 font-semibold hover:text-indigo-700">
                      อ่านต่อ
                      <ArrowRight className="ml-2" size={18} />
                    </div>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">ไม่พบบทความที่ตรงกับการค้นหา</p>
                </div>
              )}
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guides.map((guide, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition">
                    <div className="flex items-start gap-4 mb-4">
                      <FileText className="text-indigo-600" size={32} />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{guide.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>{guide.format}</span>
                          <span>•</span>
                          <span>{guide.fileSize}</span>
                          <span>•</span>
                          <span>📥 {guide.downloads}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Download className="mr-2" size={18} />
                      ดาวน์โหลด
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">❓</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 ml-7">{faq.answer}</p>
                </Card>
              ))}
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: "📺",
                    title: "วิดีโอสอนการใช้งาน",
                    description: "วิดีโอสอนการใช้งานแพลตฟอร์ม TechGreen",
                    count: "12 วิดีโอ",
                  },
                  {
                    icon: "📊",
                    title: "สถิติและข้อมูล",
                    description: "ข้อมูลสถิติและการวิเคราะห์ประสิทธิภาพ",
                    count: "15 ชุดข้อมูล",
                  },
                  {
                    icon: "🔗",
                    title: "ลิงก์ที่เป็นประโยชน์",
                    description: "ลิงก์ไปยังหน่วยงานที่เกี่ยวข้อง",
                    count: "25 ลิงก์",
                  },
                  {
                    icon: "📞",
                    title: "ติดต่อเราได้",
                    description: "ข้อมูลการติดต่อและสายด่วน",
                    count: "สายด่วน 1479",
                  },
                ].map((resource, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition">
                    <div className="text-5xl mb-4">{resource.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <p className="text-indigo-600 font-bold">{resource.count}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">ติดตามข้อมูลใหม่ๆ</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            สมัครรับจดหมายข่าวเพื่อรับข้อมูลบทความ คู่มือ และข่าวสารใหม่ๆ
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none"
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100">
              สมัครสมาชิก
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
