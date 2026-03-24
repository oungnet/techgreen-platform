# Skilled API Web-Dev

คู่มือย่อยสำหรับนักพัฒนาเพื่อใช้งาน API และพัฒนา Web ในโปรเจกต์ TechGreen แบบรวดเร็วและมีมาตรฐาน

## 1) Scope
- Backend API integration (tRPC + external API)
- Frontend data rendering (React + Tailwind)
- Validation, caching, error fallback, and testing

## 2) Core Principles
- แยกโค้ดชัดเจน: `services` / `routers` / `pages` / `components`
- ห้าม hardcode token ใน source code
- ใช้ typed contract (zod + TypeScript) ทุก endpoint
- ถ้า external API ไม่เสถียร ต้องมี fallback UI เสมอ

## 3) API Workflow (Recommended)
1. สร้าง service ใน `server/services/*`
2. เพิ่ม route ใน `server/routers/*`
3. register router ใน `server/routers.ts`
4. เรียกผ่าน `trpc.*.useQuery/useMutation` ที่ฝั่ง client
5. ทำ loading/error/success states ให้ครบ
6. เพิ่ม cache strategy (memory/ttl)

## 4) Data.go.th Integration Standard
- Header: `api-key: <token>`
- Preferred search path for energy group:
  - `https://www.data.go.th/api/3/action/package_search?fq=groups:energy`
- ควร parse resource preview เฉพาะ CSV/JSON
- ต้อง handle encoding fallback สำหรับ CSV ภาษาไทย

## 5) UI/UX Standard (TechGreen)
- Theme: Emerald + Slate
- Typography: Sarabun
- Responsive: mobile-first
- Dashboard cards + data preview table + export button

## 6) Essential Commands
```powershell
pnpm check
pnpm db:push
pnpm dev
curl.exe -s "http://localhost:3000/api/trpc/govData.energyGroup?batch=1&input=%7B%7D"
```

## 7) Done Criteria
- Type check ผ่าน (`pnpm check`)
- Route สำคัญตอบ 200
- API ได้ข้อมูลจริงหรือ fallback ชัดเจน
- เอกสารอัปเดตใน `docs/`

## 8) Related Files
- `/docs/TECHGREEN_PLATFORM_DEVELOPER_GUIDE.md`
- `/server/services/govDataService.ts`
- `/server/routers/govData.ts`
- `/client/src/pages/OpenDataDashboard.tsx`
- `/client/src/pages/EnergyDataPage.tsx`
