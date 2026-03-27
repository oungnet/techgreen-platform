# โครงสร้างสถาปัตยกรรม TechGreen (ฉบับจัดแนวกับ Full Stack Template)

อัปเดตล่าสุด: 2026-03-27

## เป้าหมายของเอกสาร

เอกสารนี้จัดทำเพื่อเชื่อมความเข้าใจระหว่าง:

- Template อ้างอิงแบบแยก `backend/` และ `frontend/`
- โครงสร้างจริงของโปรเจกต์ TechGreen ในปัจจุบัน (Monorepo)
- รูปแบบการ deploy จริงที่ใช้งานอยู่ (`Render` + `GitHub Pages`)

เพื่อให้การพัฒนาต่อยอด, CI/CD, และการส่งมอบระบบแก่หน่วยงาน ใช้มาตรฐานเดียวกัน

## 1) Mapping โครงสร้าง (Template -> โครงสร้างจริง)

Template อ้างอิง:

- `backend/` (Express, routes, middleware, auth)
- `frontend/` (React + Vite)

โครงสร้างจริงใน repo:

- `server/` = backend ทั้งหมด (Express + tRPC + services + middleware)
- `client/` = frontend ทั้งหมด (React + Vite + Tailwind)
- `shared/` = schema/type/model ที่ใช้ร่วมกัน
- `drizzle/` + `drizzle.config.ts` = migration + ORM config
- `render.yaml` = backend deployment blueprint
- `.github/workflows/deploy-pages.yml` = frontend deployment (GitHub Pages)

สรุป: โปรเจกต์นี้เป็น **Monorepo แบบ Full Stack** ไม่ได้แยกเป็น 2 repo

## 2) โครงสร้างเป้าหมาย (แนะนำใช้ต่อจากนี้)

```
techgreen-platform/
├─ client/                    # Frontend app (Vite + React + Tailwind)
├─ server/                    # Backend API (Express + tRPC + services)
├─ shared/                    # Shared types/schemas
├─ drizzle/                   # DB migrations
├─ docs/                      # คู่มือ/รายงาน/คู่มืออบรม
├─ scripts/                   # CI / smoke / utility scripts
├─ render.yaml                # Deploy backend to Render
└─ .github/workflows/         # Deploy frontend (GitHub Pages) + CI
```

## 3) Deployment Topology ที่สอดคล้องกัน

### Frontend

- Host: GitHub Pages
- URL: `https://oungnet.github.io/techgreen-platform/`
- Build: ผ่าน GitHub Actions (`deploy-pages.yml`)

### Backend

- Host: Render (service: `techgreen-api`)
- Health: `https://<your-backend-domain>/api/health`
- Build/Start:
  - Build: `pnpm install --frozen-lockfile && pnpm build`
  - Start: `pnpm start`

### ตัวแปรเชื่อมสองฝั่ง

- GitHub Secret: `VITE_API_BASE_URL=https://<your-backend-domain>`
- Backend env: `FRONTEND_ORIGINS=https://oungnet.github.io`

## 4) สิ่งที่ถูกปรับใน render.yaml

ไฟล์ [render.yaml](A:\Projects\techgreen-platform\render.yaml) ได้ปรับให้รองรับ production ครบขึ้น:

- เพิ่ม `autoDeploy: true`
- เพิ่มการ generate secret อัตโนมัติ (`SESSION_SECRET`, `JWT_SECRET`)
- เพิ่ม env สำหรับ OAuth และ Data.go.th (`sync: false` เพื่อใส่ค่าจริงที่ Render)
- ตั้งค่า `DATA_GO_TH_BASE_URL` เป็น `https://opend.data.go.th/get-ckan`
- เติม resource id ค่าเริ่มต้นให้ตรงกับ use case เกษตร/อากาศ

## 5) ขั้นตอนใช้งานมาตรฐาน (ทีมพัฒนา)

1. Deploy backend ด้วย Render blueprint (`render.yaml`)
2. ตั้ง env ให้ครบใน Render โดยเฉพาะ `DATABASE_URL` และ `DATA_GO_TH_API_KEY`
3. ตรวจ `GET /api/health` ให้ได้ `200`
4. ตั้ง GitHub secret `VITE_API_BASE_URL` เป็น URL backend จริง
5. Push branch `main` เพื่อให้ GitHub Pages deploy frontend
6. ตรวจ smoke report หลัง deploy

## 6) ข้อควรระวังด้านความปลอดภัย

- ห้ามใส่ API key/token ลงไฟล์โค้ด
- เก็บค่า sensitive ใน Render env / GitHub Secrets เท่านั้น
- จำกัด CORS ผ่าน `FRONTEND_ORIGINS` ให้ตรงโดเมนจริง
- ใช้ HTTPS ทุกจุด (frontend/backend/oauth callback)

## 7) แนวทางขยายต่อในระยะถัดไป

- เพิ่มบริการ `worker` สำหรับงาน sync/cron ดึงข้อมูลภาครัฐ
- เพิ่ม cache layer (Redis) เพื่อรองรับโหลดสูง
- แยก `open-data` module เป็น service ภายในชัดเจนขึ้น (service boundary)

