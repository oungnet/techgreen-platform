# TechGreen Platform Developer Guide

เอกสารฉบับนี้สรุปภาพรวมการพัฒนาแพลตฟอร์ม **TechGreen (Ban Non-Yai Smarter)** ตั้งแต่โครงสร้างระบบ, ขั้นตอนพัฒนา, การเชื่อมต่อฐานข้อมูล, การทำ Open Data Integration, ไปจนถึงผลทดสอบล่าสุด

วันที่สรุปเอกสาร: **25 มีนาคม 2026**

---

## 1) วัตถุประสงค์ของโครงการ

### 1.1 เป้าหมายหลัก
- พัฒนาแพลตฟอร์มชุมชนดิจิทัลที่จัดการเนื้อหาได้ (Content + CMS)
- มีระบบสมาชิกและสิทธิ์ใช้งาน (Admin/User)
- เชื่อมข้อมูลภาครัฐแบบเปิด (Thai Government Open Data) เพื่อใช้งานจริง
- รองรับทั้ง Desktop/Tablet/Mobile

### 1.2 ผลลัพธ์ที่ต้องการ
- ผู้ใช้ทั่วไปเข้าถึงบทความ, ให้คะแนน, แสดงความคิดเห็น
- ผู้ดูแลระบบจัดการบทความและสื่อผ่าน CMS
- แดชบอร์ด Open Data แสดงข้อมูลจริงจาก API
- โค้ดแยกส่วนชัดเจน (Services / Routes / UI Components)

### 1.3 ประโยชน์เชิงระบบ
- โครงสร้างพร้อมต่อยอดเชิงผลิตจริง
- ลดการเรียก API ซ้ำด้วย cache
- บริหารข้อมูลสำคัญได้ตรงกลุ่ม (เช่นกลุ่มพลังงาน)
- ทดสอบและบำรุงรักษาง่ายขึ้นด้วยการแยก concern

---

## 2) เทคโนโลยีที่ใช้

- Backend: `Node.js`, `Express`, `tRPC`
- Database: `MySQL` + `Drizzle ORM` (`mysql2`)
- Frontend: `React` + `Tailwind CSS`
- Auth: `Passport.js` (Local + Google + Facebook)
- Chart: `chart.js` + `react-chartjs-2`
- API client: `axios`

---

## 3) สถานะฐานข้อมูลและ Schema

ระบบเชื่อมฐานข้อมูลเรียบร้อยแล้วที่:
- [`server/db.ts`](/A:/Projects/techgreen-platform/server/db.ts)

Schema หลักที่ใช้งาน:
- `users`
- `articles`
- `files`
- `comments`
- `ratings`

เพิ่มเติมระหว่างพัฒนา:
- `authCredentials` (เก็บ `passwordHash` สำหรับ Local Login)
- ไฟล์ schema: [`drizzle/schema.ts`](/A:/Projects/techgreen-platform/drizzle/schema.ts)

Migration ที่สร้าง:
- [`drizzle/0005_yielding_living_lightning.sql`](/A:/Projects/techgreen-platform/drizzle/0005_yielding_living_lightning.sql)

> หมายเหตุ: ช่วงหนึ่ง `db:push` สร้าง migration สำเร็จแต่ `migrate` fail เพราะ MySQL ไม่พร้อม (`ECONNREFUSED`) ก่อนเปิด service DB

---

## 4) สรุปงานพัฒนาตามหัวข้อผลงาน

## 4.1 Professional UI/UX Redesign

### สิ่งที่ทำ
- ปรับธีมระบบเป็น Emerald + Slate
- ใช้ฟอนต์ Sarabun ทั้งระบบ
- ทำหน้า Content Hub แบบ Card Grid + Skeleton Loader
- เพิ่มหน้า Article Detail รองรับ Markdown
- รองรับ responsive

### ไฟล์สำคัญ
- [`client/src/index.css`](/A:/Projects/techgreen-platform/client/src/index.css)
- [`client/src/pages/Learning.tsx`](/A:/Projects/techgreen-platform/client/src/pages/Learning.tsx)
- [`client/src/components/ContentHubCard.tsx`](/A:/Projects/techgreen-platform/client/src/components/ContentHubCard.tsx)
- [`client/src/pages/ArticleDetail.tsx`](/A:/Projects/techgreen-platform/client/src/pages/ArticleDetail.tsx)
- [`client/src/components/MarkdownArticle.tsx`](/A:/Projects/techgreen-platform/client/src/components/MarkdownArticle.tsx)
- [`client/src/lib/markdown.ts`](/A:/Projects/techgreen-platform/client/src/lib/markdown.ts)

---

## 4.2 Advanced Authentication (Multi-Provider)

### สิ่งที่ทำ
- ใช้ Passport.js สำหรับ session/auth
- รองรับ Email/Password, Google, Facebook
- เพิ่มการเก็บรหัสผ่านแบบ hash ลง DB จริง
- รักษา Access Control Admin/User ที่ tRPC middleware

### ไฟล์สำคัญ
- [`server/_core/passport.ts`](/A:/Projects/techgreen-platform/server/_core/passport.ts)
- [`server/_core/authRoutes.ts`](/A:/Projects/techgreen-platform/server/_core/authRoutes.ts)
- [`server/_core/trpc.ts`](/A:/Projects/techgreen-platform/server/_core/trpc.ts)
- [`server/db.ts`](/A:/Projects/techgreen-platform/server/db.ts)

---

## 4.3 CMS + Media + Interaction

### สิ่งที่ทำ
- หน้า Admin Content Studio
- Rich Text Editor (editable + toolbar)
- อัปโหลดรูปขึ้นระบบ `files` ผ่าน API
- ผูก comments/ratings ใต้บทความ

### ไฟล์สำคัญ
- [`client/src/pages/AdminContentStudio.tsx`](/A:/Projects/techgreen-platform/client/src/pages/AdminContentStudio.tsx)
- [`client/src/components/RichTextEditor.tsx`](/A:/Projects/techgreen-platform/client/src/components/RichTextEditor.tsx)
- [`server/routers/files.ts`](/A:/Projects/techgreen-platform/server/routers/files.ts)
- [`client/src/components/ArticleComments.tsx`](/A:/Projects/techgreen-platform/client/src/components/ArticleComments.tsx)
- [`client/src/components/ArticleRating.tsx`](/A:/Projects/techgreen-platform/client/src/components/ArticleRating.tsx)

---

## 4.4 Thai Government Open Data Integration (API)

### เป้าหมาย
เชื่อมข้อมูล Open Data ภาครัฐเพื่อแสดงผลแบบใช้งานจริง โดยเน้นกลุ่มข้อมูลพลังงานก่อน

### สิ่งที่ทำจริง

#### 1) Dashboard API พื้นฐาน
- สร้าง service `fetchGovData()` + cache 1 ชั่วโมง
- สร้าง route `govData.dashboard`
- สร้างหน้า `/open-data`

#### 2) Energy Data Explorer (สำคัญ)
- วิเคราะห์คู่มือ API และแนว CKAN
- ดึงข้อมูลกลุ่ม `energy` ผ่าน CKAN action API:
  - `package_search` + `fq=groups:energy`
- ดึง resource ตัวอย่าง (CSV/JSON)
- สร้างหน้า `/open-data/energy` พร้อม
  - ค้นหา
  - แบ่งหน้า
  - preview ข้อมูลตัวอย่าง
  - export CSV
  - ลิงก์ไป dataset/resource จริง

### ไฟล์สำคัญ
- [`server/services/govDataService.ts`](/A:/Projects/techgreen-platform/server/services/govDataService.ts)
- [`server/routers/govData.ts`](/A:/Projects/techgreen-platform/server/routers/govData.ts)
- [`client/src/pages/OpenDataDashboard.tsx`](/A:/Projects/techgreen-platform/client/src/pages/OpenDataDashboard.tsx)
- [`client/src/pages/EnergyDataPage.tsx`](/A:/Projects/techgreen-platform/client/src/pages/EnergyDataPage.tsx)

---

## 5) การวิเคราะห์คู่มือ API รัฐบาล (DGA)

แหล่งคู่มือที่ใช้:
- [`C:\Users\admin-01\Downloads\DGA\2025-07-08-051605.3384232025-03-07-DATAGOTH3USERMANUAL.pdf`](C:/Users/admin-01/Downloads/DGA/2025-07-08-051605.3384232025-03-07-DATAGOTH3USERMANUAL.pdf)

### ประเด็นสำคัญจากเอกสาร
- นักพัฒนาต้องลงทะเบียนรับ API Key ก่อนใช้งาน
- ควรส่ง `api-key` ใน HTTP Header
- แนะนำ CKAN Data API (`datastore_search`) เป็นแนวหลัก
- โครงสร้าง API บนแพลตฟอร์มจริงอาจมี reverse/redirect ตามบริการ

### ข้อสังเกตจากการทดสอบจริง
- endpoint บางชุดข้อมูลเกิด redirect/ไม่พบ (404/302)
- กลุ่ม `energy` ผ่าน CKAN action API (`package_search`) ใช้งานได้จริงและเสถียรกว่าในสถานการณ์ทดสอบ

---

## 6) คำสั่งที่ใช้ระหว่างพัฒนา (สำคัญ)

## 6.1 ตรวจสอบโปรเจกต์และไฟล์
```powershell
Get-ChildItem -Force
Get-ChildItem client -Recurse -File
Get-ChildItem server -Recurse -File
Get-Content package.json
```

## 6.2 ตรวจสอบ TypeScript
```powershell
pnpm check
```

## 6.3 Migration และฐานข้อมูล
```powershell
pnpm db:push
```

## 6.4 รันระบบ
```powershell
pnpm dev
```

## 6.5 ทดสอบ route
```powershell
Invoke-WebRequest http://localhost:3000/open-data
Invoke-WebRequest http://localhost:3000/open-data/energy
Invoke-WebRequest http://localhost:3000/learning
Invoke-WebRequest http://localhost:3000/admin/content-studio
```

## 6.6 ทดสอบ tRPC API
```powershell
curl.exe -s "http://localhost:3000/api/trpc/govData.energyGroup?batch=1&input=%7B%7D"
curl.exe -i "http://localhost:3000/api/trpc/govData.dashboard?batch=1&input=%7B%7D"
```

## 6.7 ดึงข้อความจาก PDF (วิเคราะห์คู่มือ)
```powershell
pnpm add -D pdf-parse
# ใช้ Node script อ่าน PDF แล้ว extract text เฉพาะช่วง Developer section
```

---

## 7) ผลทดสอบระบบ (ล่าสุด)

วันที่ทดสอบหลัก: **24-25 มีนาคม 2026**

### 7.1 Type check
- `pnpm check` = ผ่าน

### 7.2 Route ทดสอบหน้าเว็บ
- `/open-data` = 200
- `/open-data/energy` = 200
- `/learning` = 200
- `/learning/smart-farming-iot` = 200
- `/admin/content-studio` = 200

### 7.3 API ทดสอบ
- `govData.energyGroup` = สำเร็จ, ได้ข้อมูลจริง (`datasets + sampleRows`)
- `govData.dashboard` = บางกรณีล้มเหลวตามสิทธิ์/endpoint ของ dataset เดิม, จึงวาง fallback ไปหน้า energy

### 7.4 คุณภาพข้อมูลตัวอย่าง
- อ่าน sample จาก CSV/JSON ได้
- มีบาง resource encoding ไม่ตรง UTF-8 จึงเพิ่ม logic decode แบบ fallback (windows-874)

---

## 8) โครงสร้างการแยกส่วน (Best Practice ที่ทำแล้ว)

- Services (Business/API logic): `server/services/*`
- Routes (tRPC endpoints): `server/routers/*`
- Components (UI ย่อย): `client/src/components/*`
- Pages (entry UI): `client/src/pages/*`

ผลลัพธ์: บำรุงรักษาง่าย, เพิ่ม feature ได้เร็ว, test ทีละ layer ได้ชัดเจน

---

## 9) ความปลอดภัยข้อมูลสำคัญ

- ควรเก็บ token เฉพาะใน `.env`
- ห้าม commit token จริงลง Git
- เอกสารตัวอย่างใช้ placeholder เช่น
  - `DATA_GO_TH_API_KEY=your-data-go-th-api-key`

ไฟล์ตัวอย่าง env:
- [`/.env.example`](/A:/Projects/techgreen-platform/.env.example)

---

## 10) สรุปภาพรวมการพัฒนา

TechGreen ถูกพัฒนาให้พร้อมใช้งานในมุมหลักแล้ว:
- โครงสร้างฐานข้อมูลและ backend พร้อม
- ระบบ auth หลายช่องทางพร้อม role
- CMS ใช้งานได้จริงพร้อม media upload
- Content Hub + Article Detail พร้อม interaction
- Open Data เชื่อมใช้งานจริงได้ โดยเน้นกลุ่มพลังงานเป็นระบบข้อมูลสำคัญหลัก

ผลลัพธ์คือระบบมีทั้งความพร้อมเชิงเทคนิคและความพร้อมเชิงปฏิบัติการสำหรับการใช้งานในชุมชน

---

## 11) ภาคผนวก: ไฟล์ที่เกี่ยวข้องกับงานรอบนี้

- [`server/db.ts`](/A:/Projects/techgreen-platform/server/db.ts)
- [`drizzle/schema.ts`](/A:/Projects/techgreen-platform/drizzle/schema.ts)
- [`server/_core/passport.ts`](/A:/Projects/techgreen-platform/server/_core/passport.ts)
- [`server/_core/authRoutes.ts`](/A:/Projects/techgreen-platform/server/_core/authRoutes.ts)
- [`server/services/govDataService.ts`](/A:/Projects/techgreen-platform/server/services/govDataService.ts)
- [`server/routers/govData.ts`](/A:/Projects/techgreen-platform/server/routers/govData.ts)
- [`client/src/pages/OpenDataDashboard.tsx`](/A:/Projects/techgreen-platform/client/src/pages/OpenDataDashboard.tsx)
- [`client/src/pages/EnergyDataPage.tsx`](/A:/Projects/techgreen-platform/client/src/pages/EnergyDataPage.tsx)
- [`client/src/pages/Learning.tsx`](/A:/Projects/techgreen-platform/client/src/pages/Learning.tsx)
- [`client/src/pages/ArticleDetail.tsx`](/A:/Projects/techgreen-platform/client/src/pages/ArticleDetail.tsx)
- [`client/src/pages/AdminContentStudio.tsx`](/A:/Projects/techgreen-platform/client/src/pages/AdminContentStudio.tsx)
- [`client/src/components/RichTextEditor.tsx`](/A:/Projects/techgreen-platform/client/src/components/RichTextEditor.tsx)
- [`client/src/components/ContentHubCard.tsx`](/A:/Projects/techgreen-platform/client/src/components/ContentHubCard.tsx)
- [`client/src/components/MarkdownArticle.tsx`](/A:/Projects/techgreen-platform/client/src/components/MarkdownArticle.tsx)
- [`client/src/lib/markdown.ts`](/A:/Projects/techgreen-platform/client/src/lib/markdown.ts)
- [`client/src/index.css`](/A:/Projects/techgreen-platform/client/src/index.css)
- [`drizzle/0005_yielding_living_lightning.sql`](/A:/Projects/techgreen-platform/drizzle/0005_yielding_living_lightning.sql)

