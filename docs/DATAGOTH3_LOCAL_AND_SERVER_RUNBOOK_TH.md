# Data.go.th Runbook (Local + Server)

อัปเดตล่าสุด: 28 มีนาคม 2026

เอกสารนี้สรุปขั้นตอนปฏิบัติแบบใช้งานจริงทั้งบนเครื่องพัฒนา (Local) และบนเซิร์ฟเวอร์ (Production)

## 1) Local (เครื่องพัฒนา)

ตั้งค่า `.env` ขั้นต่ำ:

```env
NODE_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/techgreen_db
DATA_GO_TH_API_KEY=<YOUR_KEY>
DATA_GO_TH_BASE_URL=https://opend.data.go.th/get-ckan
DATA_GO_TH_ALLOW_PUBLIC_FALLBACK=false
```

รันตรวจระบบ:

```bash
pnpm env:check
pnpm check
pnpm test
pnpm dev
```

ตรวจ API:

```bash
curl http://127.0.0.1:3000/api/health
curl "http://127.0.0.1:3000/api/trpc/govData.dashboard"
```

## 2) Server (Production)

ตั้งค่า env ในระบบ deploy (Render/อื่น ๆ):

- `NODE_ENV=production`
- `DATABASE_URL=<cloud-mysql-url>`
- `SESSION_SECRET=<long-random>`
- `JWT_SECRET=<long-random>`
- `FRONTEND_ORIGINS=https://oungnet.github.io`
- `DATA_GO_TH_API_KEY=<YOUR_KEY>`
- `DATA_GO_TH_BASE_URL=https://opend.data.go.th/get-ckan`
- `DATA_GO_TH_ALLOW_PUBLIC_FALLBACK=false`

หลัง deploy:

1. เช็ก `GET /api/health` ต้องได้ JSON `status: ok`
2. เช็ก `GET /api/trpc/govData.dashboard` ต้องตอบ JSON
3. ตั้ง GitHub Secret `VITE_API_BASE_URL=https://<backend-domain>`
4. Re-run GitHub Pages workflow

## 3) อาการผิดปกติและแนวทางแก้

### ได้ HTML แทน JSON จาก Data.go.th

- ตรวจ `api-key` และแผนบริการที่ผูก token
- ตรวจว่า endpoint เป็น `https://opend.data.go.th/get-ckan/...`

### หน้าเว็บเปิดได้ แต่ API เรียกไม่ได้

- `VITE_API_BASE_URL` ไม่ใช่ backend จริง
- backend `/api/health` ตอบไม่ใช่ JSON

### GitHub Actions smoke ล้ม

- ตรวจ `VITE_API_BASE_URL`
- ดาวน์โหลด `smoke-report` จาก artifacts เพื่อตรวจ endpoint ที่ล้ม

