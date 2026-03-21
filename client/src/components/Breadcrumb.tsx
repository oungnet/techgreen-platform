import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  "/": "หน้าแรก",
  "/disability-benefits": "สิทธิประโยชน์ผู้พิการ",
  "/tax-benefits": "สิทธิลดหย่อนภาษี",
  "/resources": "ทรัพยากร",
  "/innovation": "นวัตกรรม",
  "/partnership": "ความร่วมมือ",
  "/dashboard": "แดชบอร์ด",
  "/dashboard-user": "แดชบอร์ดของฉัน",
  "/learning": "เรียนรู้",
  "/profile": "โปรไฟล์",
  "/email-preferences": "ตั้งค่าอีเมล",
  "/admin": "Admin Dashboard",
  "/admin/users": "จัดการผู้ใช้",
  "/admin/content": "จัดการเนื้อหา",
  "/admin/articles": "จัดการบทความ",
  "/admin/analytics": "วิเคราะห์ข้อมูล",
  "/admin/moderation": "ตรวจสอบเนื้อหา",
  "/admin/campaigns": "แคมเปญ",
  "/analytics": "สถิติสมาชิก",
  "/member-dashboard": "แดชบอร์ดสมาชิก",
  "/contact": "ติดต่อเรา",
  "/register": "สมัครสมาชิก",
  "/login": "เข้าสู่ระบบ",
  "/apply-benefits": "สมัครสิทธิประโยชน์",
};

export default function Breadcrumb() {
  const [location] = useLocation();

  // Don't show breadcrumb on home page
  if (location === "/") {
    return null;
  }

  // Build breadcrumb items
  const pathParts = location.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "หน้าแรก", href: "/" },
  ];

  let currentPath = "";
  for (const part of pathParts) {
    currentPath += `/${part}`;
    const label = routeLabels[currentPath] || part.replace(/-/g, " ");
    breadcrumbs.push({ label, href: currentPath });
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-3 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
