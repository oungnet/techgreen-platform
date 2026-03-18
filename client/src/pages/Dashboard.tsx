import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const disabilityStats = [
    { type: "ตาบอด", count: 450000, percentage: 21 },
    { type: "หูหนวก", count: 380000, percentage: 18 },
    { type: "พิการทางกล", count: 620000, percentage: 30 },
    { type: "พิการทางจิตใจ", count: 380000, percentage: 18 },
    { type: "อื่นๆ", count: 270000, percentage: 13 },
  ];

  const enterpriseStats = [
    { name: "2020", enterprises: 45200, employees: 320000 },
    { name: "2021", enterprises: 50800, employees: 360000 },
    { name: "2022", enterprises: 58400, employees: 410000 },
    { name: "2023", enterprises: 62100, employees: 445000 },
    { name: "2024", enterprises: 65400, employees: 480000 },
  ];

  const budgetAllocation = [
    { name: "สิทธิประโยชน์ผู้พิการ", value: 2100, color: "#3b82f6" },
    { name: "ส่งเสริมวิสาหกิจ", value: 1200, color: "#10b981" },
    { name: "ทรัพยากรและที่ดิน", value: 800, color: "#f59e0b" },
    { name: "นวัตกรรมเกษตร", value: 900, color: "#8b5cf6" },
    { name: "อื่นๆ", value: 200, color: "#6b7280" },
  ];

  const regionalData: Array<{ region: string; disabilities: number; enterprises: number }> = [
    { region: "กรุงเทพ", disabilities: 280000, enterprises: 12500 },
    { region: "เชียงใหม่", disabilities: 150000, enterprises: 5800 },
    { region: "ขอนแก่น", disabilities: 180000, enterprises: 7200 },
    { region: "สงขลา", disabilities: 120000, enterprises: 4500 },
    { region: "อื่นๆ", disabilities: 770000, enterprises: 35400 },
  ];

  const keyMetrics = [
    {
      label: "คนพิการทั้งประเทศ",
      value: "2.1M",
      change: "+5%",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "วิสาหกิจมาตรฐาน",
      value: "65,400",
      change: "+8%",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "งบประมาณรวม",
      value: "4.2B",
      change: "+12%",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "ที่ดินราชพัสดุ",
      value: "12,450 ไร่",
      change: "+3%",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">แดชบอร์ดและสถิติ</h1>
          <p className="text-xl text-red-100">
            ข้อมูลสถิติและการวิเคราะห์ประสิทธิภาพของแพลตฟอร์ม TechGreen 2025
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyMetrics.map((metric, index) => (
              <Card key={index} className={`p-6 ${metric.color}`}>
                <p className="text-sm font-medium opacity-75 mb-2">{metric.label}</p>
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <p className="text-sm font-semibold">เพิ่มขึ้น {metric.change}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-8">
          {/* Disability Types */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">การแบ่งประเภทผู้พิการ</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={disabilityStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {disabilityStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {disabilityStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm font-medium text-gray-600">{stat.type}</p>
                  <p className="text-lg font-bold text-slate-900">{(stat.count / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">{stat.percentage}%</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Enterprise Growth */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">การเติบโตของวิสาหกิจ (2020-2024)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enterpriseStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="enterprises"
                  stroke="#10b981"
                  name="จำนวนวิสาหกิจ"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="employees"
                  stroke="#3b82f6"
                  name="จำนวนคนงาน"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Budget Allocation */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">การจัดสรรงบประมาณ (พันล้านบาท)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetAllocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {budgetAllocation.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }}></div>
                  <p className="text-sm font-medium text-gray-600">{item.name}</p>
                  <p className="text-lg font-bold text-slate-900">{item.value}B</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Regional Distribution */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">การกระจายตัวตามภูมิภาค</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-slate-900">ภูมิภาค</th>
                    <th className="text-right py-3 px-4 font-bold text-slate-900">คนพิการ</th>
                    <th className="text-right py-3 px-4 font-bold text-slate-900">วิสาหกิจ</th>
                    <th className="text-right py-3 px-4 font-bold text-slate-900">ร้อยละ</th>
                  </tr>
                </thead>
                <tbody>
                  {regionalData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-slate-900">{row.region}</td>
                      <td className="text-right py-3 px-4 text-gray-700">{(row.disabilities / 1000).toFixed(0)}K</td>
                      <td className="text-right py-3 px-4 text-gray-700">{(row.enterprises / 100).toFixed(0)}00</td>
                      <td className="text-right py-3 px-4 text-gray-700">
                        {(((row.enterprises as number) / 65400) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">สรุปข้อมูลสำคัญ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4">ผู้พิการ</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ จำนวนทั้งหมด: 2.1 ล้านคน</li>
                <li>✓ ได้รับสิทธิประโยชน์: 1.8 ล้านคน (85.7%)</li>
                <li>✓ ทำงานในวิสาหกิจ: 450,000 คน</li>
                <li>✓ อัตราการจ้าง: 15%</li>
              </ul>
            </Card>

            <Card className="p-8 border-l-4 border-l-green-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4">วิสาหกิจ</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ จำนวนทั้งหมด: 65,400 วิสาหกิจ</li>
                <li>✓ จ้างงาน: 480,000 คน</li>
                <li>✓ รายได้รวม: 125 พันล้านบาท</li>
                <li>✓ อัตราการเติบโต: 8% ต่อปี</li>
              </ul>
            </Card>

            <Card className="p-8 border-l-4 border-l-yellow-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4">ทรัพยากร</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ ที่ดินราชพัสดุ: 12,450 ไร่</li>
                <li>✓ ค่าเช่าถูกกว่า: 80%</li>
                <li>✓ ระยะเวลาเช่า: 3-5 ปี</li>
                <li>✓ จำนวนจังหวัด: 77 จังหวัด</li>
              </ul>
            </Card>

            <Card className="p-8 border-l-4 border-l-purple-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4">งบประมาณ</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ งบประมาณรวม: 4.2 พันล้านบาท</li>
                <li>✓ สิทธิประโยชน์: 2.1 พันล้านบาท</li>
                <li>✓ ส่งเสริมวิสาหกิจ: 1.2 พันล้านบาท</li>
                <li>✓ นวัตกรรม: 900 ล้านบาท</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">ข้อมูลเชิงลึก</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3">📈 การเติบโตที่เร็ว</h3>
              <p className="text-gray-700">
                วิสาหกิจเติบโตด้วยอัตรา 8% ต่อปี โดยมีการจ้างงานเพิ่มขึ้นอย่างต่อเนื่อง
              </p>
            </Card>

            <Card className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3">🌍 การกระจายตัวกว้าง</h3>
              <p className="text-gray-700">
                ทั่วประเทศ 77 จังหวัด พร้อมสนับสนุนทั้งในเมืองและชนบท
              </p>
            </Card>

            <Card className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3">💡 นวัตกรรมเพิ่มขึ้น</h3>
              <p className="text-gray-700">
                นวัตกรรมเกษตรสีเขียว IoT Solar Farm ได้รับการนำมาใช้เพิ่มขึ้น
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
