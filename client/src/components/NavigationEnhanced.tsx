import { Link } from "wouter";
import { Menu, X, LogOut, Settings, BarChart3, Users, Mail, Shield, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function NavigationEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "หน้าแรก", href: "/" },
    {
      label: "สิทธิประโยชน์",
      submenu: [
        { label: "สิทธิประโยชน์ผู้พิการ", href: "/disability-benefits" },
        { label: "สิทธิลดหย่อนภาษี", href: "/tax-benefits" },
      ],
    },
    {
      label: "ทรัพยากร",
      submenu: [
        { label: "ทรัพยากรและที่ดิน", href: "/resources" },
        { label: "นวัตกรรมเกษตร", href: "/innovation" },
      ],
    },
    { label: "ความร่วมมือ", href: "/partnership" },
    {
      label: "ข้อมูลเปิด",
      submenu: [
        { label: "Open Data Dashboard", href: "/open-data" },
        { label: "Energy Explorer", href: "/open-data/energy" },
        { label: "Open Data Catalog", href: "/open-data/catalog" },
      ],
    },
    { label: "แดชบอร์ด", href: "/dashboard" },
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
      window.location.href = `/learning?search=${encodeURIComponent(searchQuery)}`;
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-green-400 transition">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">NY</span>
            </div>
            <span>Ban Non-Yai Smarter!</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 hover:text-green-400 transition flex items-center gap-1">
                      {item.label}
                      <ChevronDown size={16} />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-0 w-48 bg-white text-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={item.href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 hover:text-green-400 transition">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Search, Auth & User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหา..."
                    className="px-3 py-2 rounded-md text-sm text-gray-900 w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
                    autoFocus
                  />
                  <button type="submit" className="p-2 hover:bg-slate-700 rounded-md transition">
                    <Search size={18} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-slate-700 rounded-md transition"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>

                    {/* User Menu Items */}
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon size={16} />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Admin Menu Items */}
                    {user.role === "admin" && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50">
                          ADMIN PANEL
                        </div>
                        {adminMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon size={16} />
                              <span className="text-sm">{item.label}</span>
                            </Link>
                          );
                        })}
                      </>
                    )}

                    {/* Logout */}
                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition"
                      >
                        <LogOut size={16} />
                        <span className="text-sm">ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href={getLoginUrl()}>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                    เข้าสู่ระบบ
                  </Button>
                </a>
                <Link href="/register">
                  <Button className="bg-green-500 hover:bg-green-600">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-slate-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา..."
                className="flex-1 px-3 py-2 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button type="submit" className="p-2 hover:bg-slate-700 rounded-md transition">
                <Search size={18} />
              </button>
            </form>

            {/* Mobile Menu Items */}
            {navItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 hover:text-green-400 transition flex items-center justify-between"
                    >
                      {item.label}
                      <ChevronDown size={16} className={openDropdown === item.label ? "rotate-180" : ""} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-3 py-2 rounded-md text-sm hover:bg-slate-700 transition"
                            onClick={() => setIsOpen(false)}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 hover:text-green-400 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth Section */}
            <div className="border-t border-slate-700 pt-4 mt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 text-sm font-semibold mb-2">{user.name}</div>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-700 transition"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    );
                  })}

                  {user.role === "admin" && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 mt-2">ADMIN</div>
                      {adminMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-700 transition"
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon size={16} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-slate-700 transition mt-2"
                  >
                    <LogOut size={16} />
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <a href={getLoginUrl()} className="block">
                    <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-slate-900">
                      เข้าสู่ระบบ
                    </Button>
                  </a>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600">
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
