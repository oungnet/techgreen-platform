import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
  Users,
  Mail,
  Shield,
  BookOpen,
  Database,
  Home,
  ChevronDown,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

type NavItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  submenu?: Array<{ label: string; href: string }>;
};

export default function NavigationEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { label: "หน้าแรก", href: "/", icon: Home },
    {
      label: "ศูนย์เนื้อหา",
      icon: BookOpen,
      submenu: [
        { label: "คลังความรู้", href: "/learning" },
        { label: "แดชบอร์ดหลัก", href: "/dashboard" },
      ],
    },
    {
      label: "ข้อมูลเปิด",
      icon: Database,
      submenu: [
        { label: "Open Data Dashboard", href: "/open-data" },
        { label: "Energy Explorer", href: "/open-data/energy" },
        { label: "Open Data Catalog", href: "/open-data/catalog" },
      ],
    },
    {
      label: "สิทธิประโยชน์",
      icon: LineChart,
      submenu: [
        { label: "สิทธิประโยชน์ผู้พิการ", href: "/disability-benefits" },
        { label: "สิทธิลดหย่อนภาษี", href: "/tax-benefits" },
        { label: "ทรัพยากรชุมชน", href: "/resources" },
      ],
    },
    { label: "ความร่วมมือ", href: "/partnership", icon: Users },
  ];

  const userMenuItems = [
    { label: "โปรไฟล์", href: "/profile", icon: Settings },
    { label: "แดชบอร์ดผู้ใช้", href: "/dashboard-user", icon: BarChart3 },
    { label: "ตั้งค่าอีเมล", href: "/email-preferences", icon: Mail },
  ];

  const adminMenuItems = [
    { label: "Admin Dashboard", href: "/admin", icon: Shield },
    { label: "Content Studio", href: "/admin/content-studio", icon: BookOpen },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  const isActive = (href: string) => location === href || location.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-slate-950/95 text-slate-100 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-lg shadow-emerald-900/30">
              TG
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide text-emerald-300">TECHGREEN</p>
              <p className="text-xs text-slate-300">Ban Non-Yai Smarter</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (!item.submenu && item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      isActive(item.href)
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label} className="group relative">
                  <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="invisible absolute left-0 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                    {item.submenu?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block rounded-lg px-3 py-2 text-sm ${
                          isActive(sub.href)
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:border-emerald-500/60"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span>{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div className="p-1">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}

                      {user.role === "admin" && (
                        <>
                          <div className="my-1 border-t border-slate-200" />
                          {adminMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href={getLoginUrl()}>
                  <Button variant="outline" className="border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-white">
                    เข้าสู่ระบบ
                  </Button>
                </a>
                <Link href="/register">
                  <Button className="bg-emerald-600 text-white hover:bg-emerald-700">สมัครสมาชิก</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-slate-200 hover:bg-slate-800 xl:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="toggle-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-2 border-t border-slate-800 py-3 xl:hidden">
            {navItems.map((item) => {
              if (!item.submenu && item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      isActive(item.href)
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "text-slate-200 hover:bg-slate-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenDropdown((prev) => (prev === item.label ? null : item.label))}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-2 space-y-1 border-l border-slate-700 pl-3">
                      {item.submenu?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
