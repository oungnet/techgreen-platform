import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, Settings, BarChart3, Users, Mail, Shield, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const navItems = [
    { label: "หน้าแรก", href: "/" },
    { label: "สิทธิประโยชน์", href: "/disability-benefits" },
    { label: "ภาษี", href: "/tax-benefits" },
    { label: "ทรัพยากร", href: "/resources" },
    { label: "นวัตกรรม", href: "/innovation" },
    { label: "เรียนรู้", href: "/learning" },
  ];

  const userMenuItems = [
    { label: "โปรไฟล์", href: "/profile", icon: Settings },
    { label: "แดชบอร์ด", href: "/dashboard-user", icon: BarChart3 },
    { label: "ตั้งค่าอีเมล", href: "/email-preferences", icon: Mail },
  ];

  const adminMenuItems = [
    { label: "Admin Dashboard", href: "/admin", icon: Shield },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Moderation", href: "/admin/moderation", icon: Users },
    { label: "Campaigns", href: "/admin/campaigns", icon: Mail },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/learning?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white shadow-xl border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl hover:text-green-400 transition-all group">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
              <span className="text-white font-black">NY</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg tracking-tight">Ban Non-Yai</span>
              <span className="text-xs text-green-500 font-medium">Digital Community</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-green-400 transition-all">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden xl:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ค้นหาข้อมูล สิทธิประโยชน์ บทความ..."
                className="w-full bg-slate-800 border-slate-700 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </form>
          </div>

          {/* Right Side - Auth & User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role}</span>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 animate-in fade-in zoom-in duration-200">
                      <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                        <p className="font-bold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 text-slate-600 hover:text-green-600 transition-all"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon size={18} className="text-slate-400" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      {user.role === "admin" && (
                        <div className="border-t border-slate-100 mt-1 pt-1 bg-slate-50/50">
                          <div className="px-5 py-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                            Admin Control
                          </div>
                          {adminMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-100 text-slate-600 hover:text-emerald-600 transition-all"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Icon size={18} className="text-slate-400" />
                                <span className="text-sm font-medium">{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition-all"
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-bold">ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href={getLoginUrl()}>
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl">
                    เข้าสู่ระบบ
                  </Button>
                </a>
                <Link href="/register">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 px-6">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="p-2 text-slate-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-8 pt-2 space-y-1 border-t border-slate-800 animate-in slide-in-from-top duration-300">
            {/* Mobile Search */}
            <div className="px-3 mb-4 pt-2">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="w-full bg-slate-800 border-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </form>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-green-400 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="border-t border-slate-800 pt-4 mt-4">
              {isAuthenticated && user ? (
                <div className="space-y-1">
                  <div className="px-4 py-3 flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{user.name}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </div>
                  
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon size={18} className="text-slate-500" />
                        {item.label}
                      </Link>
                    );
                  })}

                  {user.role === "admin" && (
                    <div className="pt-2">
                      <div className="px-4 py-2 text-[10px] font-black text-slate-500 tracking-widest uppercase">ADMIN PANEL</div>
                      {adminMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon size={18} className="text-slate-500" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all mt-2"
                  >
                    <LogOut size={18} />
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <div className="px-3 space-y-3 pt-2">
                  <a href={getLoginUrl()} className="block">
                    <Button variant="outline" className="w-full h-12 text-white border-slate-700 hover:bg-slate-800 rounded-xl">
                      เข้าสู่ระบบ
                    </Button>
                  </a>
                  <Link href="/register" className="block">
                    <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl">
                      สมัครสมาชิก
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
