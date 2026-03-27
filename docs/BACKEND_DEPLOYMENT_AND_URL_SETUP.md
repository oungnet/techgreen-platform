# Backend Deployment And URL Setup

อัปเดตล่าสุด: 2026-03-27

## เอกสารที่เกี่ยวข้อง (อ่านตามลำดับ)

1. `docs/ARCHITECTURE_ALIGNMENT_2026_TH.md`
2. `render.yaml`
3. `.github/workflows/deploy-pages.yml`
4. `docs/DEPLOYMENT_CHECKLIST.md`

เอกสารฉบับนี้ใช้เป็นคู่มือปฏิบัติจริง โดยเชื่อม flow backend -> frontend -> smoke test ให้ครบขั้นตอน

## เป้าหมาย

- นำ Backend API ของ TechGreen ขึ้นออนไลน์ผ่าน Render
- ได้ URL จริงสำหรับตั้งค่า `VITE_API_BASE_URL` ใน GitHub Actions
- ให้เว็บ GitHub Pages เรียก API ได้จากโดเมนภายนอกอย่างถูกต้องและปลอดภัย

## Flow มาตรฐาน (End-to-End)

1. Deploy backend จาก `render.yaml`
2. ตรวจ `GET /api/health` ให้ผ่าน
3. ตั้ง `VITE_API_BASE_URL` ใน GitHub Secrets
4. Deploy frontend ผ่าน GitHub Pages workflow
5. ตรวจ smoke test และหน้าใช้งานจริง (`/learning`, `/open-data`)

## 1) เตรียม Environment ของ Backend

ค่าหลักที่ต้องมีใน Render (บางค่า generate ได้จาก blueprint):

- `NODE_ENV=production`
- `PORT=10000` (หรือให้ platform จัดการ)
- `DATABASE_URL=<mysql-url-production>`
- `SESSION_SECRET=<strong-random>`
- `JWT_SECRET=<strong-random>`
- `FRONTEND_ORIGINS=https://oungnet.github.io`
- `SESSION_COOKIE_SAMESITE=none`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `DATA_GO_TH_API_KEY`
- `DATA_GO_TH_BASE_URL=https://opend.data.go.th/get-ckan`
- `DATA_GO_TH_AGRICULTURE_RESOURCE_ID=888c3098-9040-4202-9014-9989a5342a77`
- `DATA_GO_TH_WEATHER_RESOURCE_ID=f9293671-6101-447a-8f74-8d4841d6b059`

หมายเหตุ:

- หากรองรับหลายโดเมน frontend ให้ใส่ `FRONTEND_ORIGINS` แบบ comma-separated
- ห้ามใส่ secret ลงในโค้ดหรือ commit

## 2) Deploy Backend ด้วย Render Blueprint

โปรเจกต์นี้มีไฟล์ deploy พร้อมใช้งานแล้ว:

- `render.yaml`

ขั้นตอน:

1. เข้า Render แล้วเลือกสร้าง `Blueprint` จาก GitHub repo นี้
2. ตรวจ service `techgreen-api` และคำสั่ง:
   - Build: `corepack enable && pnpm install --frozen-lockfile && pnpm build`
   - Start: `pnpm start`
3. กรอกค่า env ที่ตั้ง `sync: false` ให้ครบ โดยเฉพาะ `DATABASE_URL` และ `DATA_GO_TH_API_KEY`
4. Deploy และรอ build เสร็จ

## 3) ยืนยัน Backend URL จริง

ตัวอย่าง URL หลัง deploy:

- `https://techgreen-api.onrender.com`
- `https://techgreen-api.up.railway.app`

ให้ใช้เฉพาะโดเมนหลักเป็นค่า `VITE_API_BASE_URL` (ไม่ต้องต่อ `/api/trpc`)

ทดสอบขั้นต่ำ:

- `https://<your-backend-domain>/api/health` ต้องได้ `200`

## 4) ตั้งค่า GitHub Secret สำหรับ Frontend

ไปที่ GitHub repo:

1. `Settings` -> `Secrets and variables` -> `Actions`
2. สร้างหรืออัปเดต secret ชื่อ `VITE_API_BASE_URL`
3. ตั้งค่าเป็น `https://<your-backend-domain>`

จากนั้น:

- push ใหม่ 1 commit หรือ re-run workflow `Deploy GitHub Pages`

## 5) ตรวจ Frontend + Smoke หลัง Deploy

### ตรวจหน้าเว็บ

- `https://oungnet.github.io/techgreen-platform/`
- `https://oungnet.github.io/techgreen-platform/learning`
- `https://oungnet.github.io/techgreen-platform/open-data`

### ตรวจ smoke job

- Workflow: `.github/workflows/deploy-pages.yml`
- ต้องผ่านอย่างน้อย:
  - frontend routes
  - backend `/api/health`
- external data checks (`govData.*`) เป็น soft-check ได้เมื่อไม่ได้เปิด strict mode

## 6) ปัญหาที่พบบ่อยและแนวทางแก้

### เว็บเปิดได้ แต่ API fail

- ยังไม่ได้ตั้ง `VITE_API_BASE_URL`
- หรือ `VITE_API_BASE_URL` ใส่ผิดโดเมน

### ตั้ง `VITE_API_BASE_URL` เป็น `api.data.go.th`

- ใช้ไม่ได้กับระบบนี้
- ค่านี้ต้องเป็น backend ของคุณเอง ไม่ใช่ปลายทาง data.go.th ตรงๆ

### ล็อกอินไม่ติดหลังแยกโดเมน

- `FRONTEND_ORIGINS` ไม่ตรงโดเมนจริง
- `SESSION_COOKIE_SAMESITE` ไม่ใช่ `none`
- OAuth callback URL ยังเป็นโดเมนเก่า

### Deploy fail เพราะ DB

- `DATABASE_URL` ไม่ถูกต้อง
- MySQL ยังไม่เปิดสิทธิ์ให้ cloud runtime

## 7) Quick Verification Commands

```bash
# local type check + tests
pnpm check
pnpm test

# local smoke (ต้องตั้ง FRONTEND_URL และ API_BASE_URL ก่อน)
pnpm smoke:test
```


