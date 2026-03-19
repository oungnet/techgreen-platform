import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Leaf, Briefcase, BookOpen, BarChart3 } from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const features = [
    {
      icon: Users,
      title: "สิทธิประโยชน์ผู้พิการ",
      description: "ข้อมูลสิทธิประโยชน์ใหม่ปี 2568 เงินเบี้ย การรักษาพยาบาล และอุปกรณ์ช่วย",
      href: "/disability-benefits",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "สิทธิลดหย่อนภาษี",
      description: "มาตรา 33, 35 และ ESG Tax Credit 200% สำหรับผู้ประกอบการ",
      href: "/tax-benefits",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Briefcase,
      title: "ทรัพยากรและที่ดิน",
      description: "ที่ดินราชพัสดุ 12,450 ไร่ ค่าเช่าถูก 80% และระบบจอง",
      href: "/resources",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Leaf,
      title: "นวัตกรรมเกษตรสีเขียว",
      description: "Smart IoT, Solar Farm, Biomass, Hydro Tech และสิทธิประโยชน์พรีเมียม",
      href: "/innovation",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Briefcase,
      title: "ความร่วมมือทางธุรกิจ",
      description: "4 หมวดธุรกิจ: ฟาร์ม แปรรูป หัตถกรรม โลจิสติกส์",
      href: "/partnership",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "แดชบอร์ดและสถิติ",
      description: "2.1M คนพิการ 65,400 วิสาหกิจ 4.2B บาท งบประมาณ",
      href: "/dashboard",
      color: "bg-red-100 text-red-600",
    },
  ];

  const stats = [
    { label: "คนพิการเข้าถึงสิทธิ์", value: "2.1M+", icon: Users },
    { label: "วิสาหกิจมาตรฐาน", value: "65,400", icon: Briefcase },
    { label: "งบส่งเสริมชุมชน", value: "4.2B บาท", icon: TrendingUp },
    { label: "ที่ดินราชพัสดุ", value: "12,450 ไร่", icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              TechGreen Platform 2026
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              นวัตกรรมเพื่อความเท่าเทียม สนับสนุนผู้พิการ ผู้ประกอบการ และ ชุมชน
            </p>
            <p className="text-lg text-gray-400 mb-8">
              แพลตฟอร์มข้อมูลครบถ้วนสำหรับสิทธิประโยชน์ นวัตกรรม และการพัฒนาคุณภาพชีวิต ภายใต้ระเบียบพระราชกฤษฎีกาปี 2568
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/disability-benefits">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  สำหรับผู้พิการ
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/tax-benefits">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                  สำหรับผู้ประกอบการ
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">เนื้อหาหลักของแพลตฟอร์ม</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ข้อมูลครบถ้วนสำหรับสิทธิประโยชน์ นวัตกรรม ทรัพยากร และการพัฒนาคุณภาพชีวิต
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href} className="block">
                  <Card className="h-full p-8 hover:shadow-xl transition cursor-pointer group">
                    <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center text-green-500 font-semibold group-hover:translate-x-2 transition">
                      เรียนรู้เพิ่มเติม
                      <ArrowRight className="ml-2" size={18} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">ต้องการเรียนรู้เพิ่มเติม?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            เข้าไปในศูนย์การเรียนรู้ของเรา เพื่อค้นหาบทความ คู่มือ และทรัพยากรที่มีประโยชน์
          </p>
          <Link href="/learning">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <BookOpen className="mr-2" size={20} />
              เข้าศูนย์การเรียนรู้
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
