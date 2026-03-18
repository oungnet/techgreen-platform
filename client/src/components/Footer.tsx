import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">TechGreen Platform 2025</h3>
            <p className="text-sm text-gray-300">
              แพลตฟอร์มข้อมูลบูรณาการสำหรับผู้พิการ ผู้ประกอบการ และเจ้าหน้าที่ภาครัฐ ภายใต้ระเบียบพระราชกฤษฎีกาปี 2568
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">ลิงก์ด่วน</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/disability-benefits">
                  <a className="hover:text-green-400 transition">สิทธิประโยชน์ผู้พิการ</a>
                </Link>
              </li>
              <li>
                <Link href="/tax-benefits">
                  <a className="hover:text-green-400 transition">สิทธิลดหย่อนภาษี</a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="hover:text-green-400 transition">ทรัพยากร</a>
                </Link>
              </li>
              <li>
                <Link href="/innovation">
                  <a className="hover:text-green-400 transition">นวัตกรรม</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">เพิ่มเติม</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/partnership">
                  <a className="hover:text-green-400 transition">ความร่วมมือ</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="hover:text-green-400 transition">แดชบอร์ด</a>
                </Link>
              </li>
              <li>
                <Link href="/learning">
                  <a className="hover:text-green-400 transition">เรียนรู้</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">ติดต่อเรา</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span>1479 (สายด่วน)</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span>info@techgreen2025.go.th</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>กรุงเทพมหานคร</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-green-400 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <Linkedin size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-400">
            © 2025 TechGreen Platform. สงวนลิขสิทธิ์ทั้งหมด
          </p>
        </div>
      </div>
    </footer>
  );
}
