# คู่มือจัดการไฟล์คอนฟิกที่มักเกิดปัญหา (TechGreen)

อัปเดตล่าสุด: 2026-03-27

## ไฟล์ที่ต้องตรวจทุกครั้งก่อน Deploy

1. `render.yaml`
2. `.env` (local)
3. `.env.example` และ `.env.render.example`
4. `.github/workflows/deploy-pages.yml`
5. `scripts/smoke-test.mjs`

## อาการที่พบล่าสุด และแนวทางแก้

### 1) `smoke` fail บน GitHub Actions

สาเหตุหลัก:

- `VITE_API_BASE_URL` ชี้ไปโดเมนที่ยังไม่ออนไลน์จริง
- backend URL ตอบ `404` ที่ `/api/health`

แนวทาง:

- ใช้ URL backend จริงจาก Render service เท่านั้น
- ทดสอบ `https://<backend>/api/health` ให้ได้ `200` ก่อนค่อย re-run workflow

### 2) ใส่ค่า Data.go.th endpoint ไม่ตรง

สาเหตุ:

- ใช้ `https://data.go.th/api/3/action` ซึ่งไม่ตรง flow ในโค้ดบริการปัจจุบัน

แนวทาง:

- ตั้ง `DATA_GO_TH_BASE_URL=https://opend.data.go.th/get-ckan`

### 3) ใช้ `DATABASE_URL=localhost` ใน production

แนวทาง:

- ใช้ MySQL URL ที่เข้าถึงจาก Render ได้จริง
- หลีกเลี่ยง localhost เมื่อ `NODE_ENV=production`

### 4) key ใน `.env` ซ้ำ

ผลกระทบ:

- ตัวแปรท้ายไฟล์จะทับค่าก่อนหน้า ทำให้ดีบักยาก

แนวทาง:

- รัน `pnpm env:check` ก่อน deploy ทุกครั้ง

## คำสั่งตรวจคอนฟิกอย่างเร็ว

```bash
pnpm env:check
pnpm check
pnpm test
```

## เช็กลิสต์ขั้นต่ำก่อนกด Deploy

1. Render backend ขึ้นสถานะ `Live`
2. `GET /api/health` = `200`
3. GitHub secret `VITE_API_BASE_URL` เป็นโดเมน backend จริง
4. Deploy Pages ผ่าน `build + deploy + smoke`

