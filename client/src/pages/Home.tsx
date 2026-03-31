import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Database,
  Handshake,
  Leaf,
  LineChart,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";

const pillars = [
  {
    title: "Content Hub",
    description: "คลังบทความชุมชนพร้อมระบบจัดหมวดหมู่และค้นหาแบบใช้งานจริง",
    icon: BookOpen,
    href: "/learning",
  },
  {
    title: "Open Data Center",
    description: "ดึงข้อมูลภาครัฐจาก data.go.th และแสดงผลแบบ Dashboard เดียว",
    icon: Database,
    href: "/open-data",
  },
  {
    title: "Content Studio",
    description: "พื้นที่จัดการเนื้อหาและระบบดูแลคุณภาพข้อมูลสำหรับทีมผู้ดูแล",
    icon: ShieldCheck,
    href: "/admin/content-studio",
  },
  {
    title: "Partnership Network",
    description: "เชื่อมภาครัฐ เอกชน และประชาชน ด้วยข้อมูลชุดเดียวกัน",
    icon: Handshake,
    href: "/partnership",
  },
];

const highlights = [
  { label: "บทความองค์ความรู้", value: "Content Hub", icon: BookOpen },
  { label: "แดชบอร์ดข้อมูลเปิด", value: "Open Data", icon: LineChart },
  { label: "การมีส่วนร่วมชุมชน", value: "People First", icon: Users },
  { label: "โฟกัสสีเขียว", value: "Tech + Green", icon: Leaf },
];

const quickLinks = [
  { label: "สิทธิประโยชน์ผู้พิการ", href: "/disability-benefits", icon: Sprout },
  { label: "สิทธิลดหย่อนภาษี", href: "/tax-benefits", icon: Building2 },
  { label: "Open Data Catalog", href: "/open-data/catalog", icon: Database },
  { label: "แดชบอร์ดผู้ใช้", href: "/dashboard-user", icon: Users },
];

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.5),transparent_35%)]" />
        <div className="container relative py-20 md:py-24">
          <div className="max-w-4xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-200">
              TECHGREEN PLATFORM 2026
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              โครงสร้างเว็บไซต์ใหม่
              <span className="block text-emerald-300">สำหรับข้อมูลชุมชนและข้อมูลภาครัฐ</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
              ออกแบบให้ใช้งานง่ายสำหรับประชาชนและเจ้าหน้าที่ พร้อมโครงสร้างหน้าเว็บที่สอดคล้องกันทั้งระบบ
              เน้นความชัดเจน ความเร็ว และรองรับการเติบโตของข้อมูลในอนาคต
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/learning">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                  เข้าศูนย์เนื้อหา
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/open-data">
                <Button variant="outline" className="border-slate-500 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-white">
                  เปิด Open Data Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="rounded-2xl border-slate-200 p-5">
                <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-lg font-semibold text-slate-900">{item.value}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container pb-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">แกนหลักของเว็บไซต์</h2>
            <p className="text-sm text-slate-600">วางโครง IA ใหม่ให้ทุกหน้ามีประสบการณ์การใช้งานที่เชื่อมต่อกัน</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link key={pillar.title} href={pillar.href}>
                <Card className="group h-full rounded-2xl border-slate-200 p-6 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg">
                  <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-2 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
                  <p className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700">
                    ไปยังหน้าใช้งาน
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container py-10">
        <Card className="rounded-2xl border-slate-200 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">ลิงก์ใช้งานด่วน</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40">
                    <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
