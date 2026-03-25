# Backend Deployment And URL Setup

อัปเดตล่าสุด: 2026-03-25

## เป้าหมาย

- นำ Backend API ของ TechGreen ขึ้นออนไลน์
- ได้ URL จริงสำหรับตั้งค่า `VITE_API_BASE_URL` ใน GitHub Actions
- ให้เว็บ GitHub Pages เรียก API ได้จากโดเมนภายนอกอย่างถูกต้อง

## 1) เตรียมค่า Environment ของ Backend

กำหนดค่าขั้นต่ำในผู้ให้บริการ Cloud (เช่น Render/Railway):

- `NODE_ENV=production`
- `PORT` (ให้ platform กำหนดได้)
- `DATABASE_URL=<mysql-url-production>`
- `SESSION_SECRET=<long-random-secret>`
- `FRONTEND_ORIGINS=https://oungnet.github.io`
- `SESSION_COOKIE_SAMESITE=none`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `DATA_GO_TH_API_KEY`

หมายเหตุ: ถ้าหน้าเว็บ production อยู่หลายโดเมน ให้ใส่ `FRONTEND_ORIGINS` เป็น comma-separated เช่น  
`https://oungnet.github.io,https://example.org`

## 2) Deploy Backend ด้วย Render (แนะนำเริ่มต้นเร็ว)

โปรเจกต์นี้มีไฟล์ `render.yaml` แล้ว:

- `render.yaml`

ขั้นตอน:

1. เข้า Render และสร้าง `Blueprint` จาก GitHub repo นี้
2. ตรวจค่า service name และคำสั่ง build/start:
   - Build: `pnpm install --frozen-lockfile && pnpm build`
   - Start: `pnpm start`
3. ใส่ Environment Variables ให้ครบ (ตามข้อ 1)
4. Deploy
5. หลัง deploy สำเร็จ ให้ทดสอบ:
   - `https://<your-render-domain>/api/health`

ถ้าขึ้น JSON สถานะ `ok` แปลว่า backend พร้อมใช้งาน

## 3) วิธีหา Backend URL จริง

หลัง deploy สำเร็จ URL จริงจะเป็นโดเมนของ provider เช่น:

- `https://techgreen-api.onrender.com`
- `https://techgreen-api.up.railway.app`

ให้ใช้เฉพาะโดเมนหลัก (ไม่ต้องใส่ `/api/trpc`)

## 4) ตั้งค่า GitHub Secret สำหรับ Frontend

ใน GitHub repo:

1. `Settings` -> `Secrets and variables` -> `Actions`
2. กด `New repository secret`
3. Name: `VITE_API_BASE_URL`
4. Value: `https://<your-backend-domain>`

จากนั้น re-run workflow `Deploy GitHub Pages` หรือ push ใหม่ 1 commit

## 5) Smoke Test หลังออนไลน์

1. เว็บ: `https://oungnet.github.io/techgreen-platform/`
2. Backend health: `https://<your-backend-domain>/api/health`
3. ลองหน้า:
   - `/techgreen-platform/learning`
   - `/techgreen-platform/open-data`
4. เปิด DevTools ตรวจว่า request ไป `https://<your-backend-domain>/api/trpc/...`

## 6) ปัญหาที่พบบ่อย

### เว็บเปิดได้ แต่ API fail
- ยังไม่ได้ตั้ง `VITE_API_BASE_URL`
- หรือ backend URL ผิดโดเมน

### ล็อกอินไม่ติด หลังแยกโดเมน
- `FRONTEND_ORIGINS` ยังไม่ตรงโดเมนจริง
- `SESSION_COOKIE_SAMESITE` ยังไม่เป็น `none`
- production ต้องเป็น HTTPS

### Deploy fail เพราะ DB
- `DATABASE_URL` ไม่ถูกต้อง
- MySQL ยังไม่ allow จาก public cloud IP

