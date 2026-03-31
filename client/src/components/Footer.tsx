import { Link } from "wouter";
import { Database, Facebook, Globe2, Linkedin, Mail, MapPin, Phone, Sparkles } from "lucide-react";

const sectionLinks = [
  {
    title: "ศูนย์ข้อมูล",
    links: [
      { label: "หน้าแรก", href: "/" },
      { label: "คลังความรู้", href: "/learning" },
      { label: "Open Data Dashboard", href: "/open-data" },
      { label: "Open Data Catalog", href: "/open-data/catalog" },
    ],
  },
  {
    title: "บริการหลัก",
    links: [
      { label: "สิทธิประโยชน์ผู้พิการ", href: "/disability-benefits" },
      { label: "สิทธิลดหย่อนภาษี", href: "/tax-benefits" },
      { label: "ทรัพยากรชุมชน", href: "/resources" },
      { label: "ความร่วมมือ", href: "/partnership" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              TECHGREEN OFFICIAL PLATFORM
            </div>
            <h3 className="text-2xl font-bold">TechGreen Platform 2026</h3>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              แพลตฟอร์มข้อมูลชุมชนและข้อมูลภาครัฐที่ออกแบบใหม่ให้ใช้งานง่าย สะอาด และรองรับการทำงานร่วมกัน
              ระหว่างประชาชน หน่วยงานรัฐ และภาคเอกชน
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1">
                <Database className="h-3.5 w-3.5" />
                Open Data Enabled
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1">
                <Globe2 className="h-3.5 w-3.5" />
                Responsive Experience
              </span>
            </div>
          </div>

          {sectionLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold text-emerald-300">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-300 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-t border-slate-800 pt-6 md:grid-cols-2">
          <div className="space-y-2 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> สายด่วน 1479</p>
            <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> support@techgreen.go.th</p>
            <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> กรุงเทพมหานคร</p>
          </div>
          <div className="flex items-center justify-start gap-4 md:justify-end">
            <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white" aria-label="facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white" aria-label="linkedin">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400">© 2026 TechGreen Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}
