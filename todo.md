# TechGreen Platform - Master TODO (Cleaned)

อัปเดตล่าสุด: 2026-03-25
เจ้าของงาน: TechGreen Dev Team

---

## Snapshot

### สถานะรวม
- ระบบแกนหลักใช้งานได้แล้ว: Database, Auth, Content Hub, CMS, Open Data (Energy)
- โค้ดผ่าน TypeScript check ล่าสุด (`pnpm check`)
- มีเอกสารคู่มือครบทั้งนักพัฒนาและเวอร์ชันอบรมภาษาไทย

### ประเด็นสำคัญที่ต้องติดตาม
- ต้องยืนยันการใช้งาน MySQL ในสภาพแวดล้อมปลายทางก่อน apply migration รอบสุดท้าย
- `govData.dashboard` ชุด dataset เดิมมีโอกาสล้มเหลวจากต้นทาง (มี fallback พร้อมแล้ว)

---

## Done (Completed)

## 1) Core Platform
- [x] เชื่อมต่อฐานข้อมูล MySQL ผ่าน `mysql2` + Drizzle
- [x] จัดโครงสร้าง schema หลัก: `users`, `articles`, `files`, `comments`, `ratings`
- [x] เพิ่มระบบจัดเก็บไฟล์และการแชร์ไฟล์
- [x] สร้าง tRPC routers หลักสำหรับระบบใช้งานจริง

## 2) Authentication & Access Control
- [x] รองรับเข้าสู่ระบบหลายช่องทาง: Email/Password, Google, Facebook (Passport)
- [x] ย้ายการเก็บรหัสผ่าน local จาก memory ไปเก็บ hash ในฐานข้อมูล (`authCredentials`)
- [x] แยกสิทธิ์ Admin/User ใน backend middleware และ frontend route guard

## 3) Content & CMS
- [x] หน้า Content Hub (`/learning`) แบบ card grid + filter + pagination + skeleton loading
- [x] หน้า Article Detail (`/learning/:slug`) รองรับ Markdown
- [x] ระบบแสดงความคิดเห็นและให้คะแนนใต้บทความ
- [x] หน้า Admin Content Studio พร้อม Rich Text Editor และอัปโหลดรูป

## 4) Open Data Integration
- [x] สร้าง service เรียก API + ระบบ cache 1 ชั่วโมง
- [x] สร้างหน้า Open Data Dashboard (`/open-data`)
- [x] สร้างหน้า Energy Explorer (`/open-data/energy`) สำหรับข้อมูลกลุ่มพลังงาน
- [x] รองรับค้นหา, แบ่งหน้า, preview data, export CSV
- [x] เพิ่ม fallback เมื่อ endpoint dashboard หลักไม่พร้อม

## 5) UI/UX
- [x] ปรับธีมหลักเป็น Emerald + Slate
- [x] ใช้ Sarabun เป็นฟอนต์หลักทั้งระบบ
- [x] ปรับ responsive ให้ใช้งานได้ดีบนมือถือและแท็บเล็ต

## 6) Documentation
- [x] `docs/TECHGREEN_PLATFORM_DEVELOPER_GUIDE.md`
- [x] `docs/SKILLED_API_WEB_DEV.md`
- [x] `docs/TECHGREEN_THAI_OFFICIAL_TRAINING_GUIDE.md`
- [x] ปรับ `.env.example` ให้สอดคล้องกับระบบล่าสุด

---

## In Progress / Blocked

## A) Database Migration Apply (Environment Block)
- [ ] Apply migration ในเครื่องปลายทางด้วย `pnpm db:push`
- สาเหตุค้าง: MySQL บางช่วงเวลาไม่พร้อม (`ECONNREFUSED`)
- แนวทาง: ตรวจ service DB และสิทธิ์ connection ก่อนรันซ้ำ

## B) Dashboard Dataset Stability
- [ ] ทบทวน dataset ID ใน `govData.dashboard` ให้เสถียรระยะยาว
- สถานะปัจจุบัน: มี fallback หน้า Energy พร้อมใช้งาน

---

## Backlog (Prioritized)

## P1 - ควรทำถัดไป (สำคัญสูง)
- [ ] เพิ่มระบบบันทึก dataset ที่สนใจ (Favorite/Pin) ในหน้า `/open-data/energy`
- [ ] เพิ่มชุดทดสอบ smoke test สำหรับเส้นทางสำคัญ
  - `/learning`
  - `/learning/:slug`
  - `/admin/content-studio`
  - `/open-data`
  - `/open-data/energy`
- [ ] สร้าง Deployment Checklist สำหรับส่งมอบ production

## P2 - เพิ่มความน่าใช้และความต่อเนื่องของข้อมูล
- [ ] สร้าง scheduled refresh (รายชั่วโมง) สำหรับข้อมูล Open Data สำคัญ
- [ ] เก็บ snapshot ข้อมูลย้อนหลังสำหรับดูแนวโน้ม
- [ ] เพิ่มหน้าสรุป KPI ข้อมูลพลังงาน (จำนวนชุดข้อมูล, หน่วยงาน, วันที่อัปเดต)

## P3 - ต่อขยายระบบชุมชน
- [ ] เพิ่ม member onboarding flow สำหรับผู้ใช้ใหม่
- [ ] เพิ่มระบบแจ้งเตือนเชิงใช้งานจริง (notification UX)
- [ ] เพิ่มฟังก์ชันค้นหา/กรองผู้ใช้ใน User Management

---

## Quality Gates (ก่อนปล่อยใช้งานจริง)

- [ ] `pnpm check` ต้องผ่าน
- [ ] route สำคัญต้องตอบ 200
- [ ] auth flow ต้องทดสอบครบ (local + social)
- [ ] open data route ต้องมีทั้ง success path และ fallback path
- [ ] ตรวจความถูกต้องเอกสารกับสถานะโค้ดจริงอีกครั้ง

---

## Quick Commands

```powershell
pnpm check
pnpm db:push
pnpm dev
curl.exe -s "http://localhost:3000/api/trpc/govData.energyGroup?batch=1&input=%7B%7D"
```

---

## Reference Files

- `server/db.ts`
- `drizzle/schema.ts`
- `server/_core/passport.ts`
- `server/_core/authRoutes.ts`
- `server/services/govDataService.ts`
- `server/routers/govData.ts`
- `client/src/pages/Learning.tsx`
- `client/src/pages/ArticleDetail.tsx`
- `client/src/pages/AdminContentStudio.tsx`
- `client/src/pages/OpenDataDashboard.tsx`
- `client/src/pages/EnergyDataPage.tsx`

