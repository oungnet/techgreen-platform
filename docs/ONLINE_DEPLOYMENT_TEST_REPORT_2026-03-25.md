# รายงานทดสอบการนำระบบขึ้นออนไลน์ (TechGreen)

วันที่ทดสอบ: 25 มีนาคม 2026  
ผู้ทดสอบ: Codex (ร่วมกับทีมพัฒนา)

## 1) วัตถุประสงค์

- ยืนยันว่าโปรเจกต์ build และรันได้จริง
- ยืนยันว่าเส้นทางเว็บสำคัญใช้งานได้
- ยืนยันว่า API ภาครัฐ (`govData.dashboard`, `govData.energyGroup`) เรียกใช้งานได้ โดยระบบไม่ล่มเมื่อเจอข้อจำกัดภายนอก
- เตรียมระบบสำหรับ GitHub Pages และการปล่อยออนไลน์แบบปลอดภัย

## 2) งานที่ดำเนินการ

### 2.1 ตรวจลิงก์ออนไลน์

- GitHub Repository: `https://github.com/oungnet/techgreen-platform/` ตอบกลับปกติ
- GitHub Pages: `https://oungnet.github.io/techgreen-platform/` ยัง `404` (ยังไม่ deploy จาก GitHub Actions ที่ branch `main`)

### 2.2 ตรวจและปรับระบบ deployment

- เพิ่ม workflow สำหรับ GitHub Pages:
  - `.github/workflows/deploy-pages.yml`
- รองรับ base path ของ GitHub Pages และ API base URL:
  - `client/src/main.tsx`

### 2.3 ปรับปรุง Gov Data Service

ไฟล์ที่ปรับ:
- `server/services/govDataService.ts`

สิ่งที่ปรับ:
- เปลี่ยนแนวทางเรียกข้อมูลเป็น CKAN action API (`data.go.th/api/3/action`)
- เพิ่ม fallback request เมื่อการส่ง `api-key` แล้วได้ HTML/redirect
- ป้องกันระบบล้มทั้งก้อน โดยให้ `govData.dashboard` คืนค่าแบบ `degraded` แทนการ throw 500
- คง caching 1 ชั่วโมงตามข้อกำหนด

## 3) คำสั่งที่ใช้จริง

```powershell
pnpm db:push
pnpm check
pnpm exec vite build --base "/techgreen-platform/"
pnpm dev
```

ทดสอบ endpoint ผ่าน HTTP:

- `/learning`
- `/learning/:slug`
- `/admin/content-studio`
- `/open-data`
- `/api/trpc/govData.dashboard`
- `/api/trpc/govData.energyGroup`

## 4) ผลทดสอบ

### 4.1 โครงสร้างและ build

- `pnpm check` ผ่าน
- `pnpm exec vite build --base "/techgreen-platform/"` ผ่าน

### 4.2 หน้าเว็บสำคัญ

สถานะจากการทดสอบ local dev:
- `/learning` = 200
- `/learning/test-slug` = 200
- `/admin/content-studio` = 200
- `/open-data` = 200

### 4.3 API Gov Data

สถานะจากการทดสอบ:
- `govData.dashboard` = 200 (โหมด `degraded`, ไม่ล่ม)
- `govData.energyGroup` = 200 (ได้ข้อมูลจริงจากกลุ่มพลังงาน เช่น `total=3921`)

## 5) ปัญหาที่พบและแนวทางแก้

### ปัญหา A: `pnpm db:push` ล้มเหลว

อาการ:
- `ECONNREFUSED` ระหว่าง migrate

สาเหตุ:
- MySQL ในเครื่องทดสอบยังไม่เปิด/เข้าถึงไม่ได้

แนวทางแก้:
- ตรวจ service MySQL, host/port, user/password ใน `.env`
- จากนั้นรัน `pnpm db:push` ซ้ำ

### ปัญหา B: `govData.dashboard` เคยได้ 500

อาการเดิม:
- API ภายนอกส่ง HTML/redirect (เช่นหน้า `register_api`) ทำให้ backend โยน 500

สาเหตุ:
- สิทธิ์ token กับ endpoint บางชุดข้อมูลไม่ตรงกัน หรือ endpoint ตอบกลับไม่ใช่ JSON

แนวทางแก้:
- เพิ่ม fallback และ degraded mode ใน `govDataService`
- ระบบยังตอบกลับได้และหน้าเว็บไม่ล่ม

## 6) ขั้นตอนปล่อยออนไลน์ (Production)

1. ตรวจให้ branch พร้อมปล่อย
2. Commit และ push ขึ้น `main`
3. ที่ GitHub: Settings > Pages > Source = `GitHub Actions`
4. ตั้ง GitHub Secrets:
   - `VITE_API_BASE_URL`
   - ค่า secret อื่นตามระบบจริง
5. รอ workflow `Deploy GitHub Pages` สำเร็จ
6. ตรวจหน้าเว็บ:
   - `https://oungnet.github.io/techgreen-platform/`

## 7) หมายเหตุสำคัญด้านสถาปัตยกรรม

- GitHub Pages เป็น static hosting: ให้บริการเฉพาะ frontend
- Backend API ต้องออนไลน์แยก (เช่น VPS/Cloud Run/Render) แล้วตั้ง `VITE_API_BASE_URL` ให้ชี้ endpoint จริง
- หาก API ภายนอกมีข้อจำกัดสิทธิ์ ระบบจะแสดงผลแบบ degraded โดยไม่ทำให้หน้าเว็บล่ม

## 8) เช็กลิสต์ก่อนส่งมอบ

- [ ] MySQL production เข้าถึงได้
- [ ] `pnpm db:push` ผ่านในสภาพแวดล้อมจริง
- [ ] GitHub Actions deploy ผ่าน
- [ ] GitHub Pages เปิดหน้าได้
- [ ] OAuth callback URL ตั้งค่าตรงโดเมนจริง
- [ ] ยืนยัน `VITE_API_BASE_URL` ชี้ backend ที่ใช้งานจริง

