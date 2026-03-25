# Deployment Checklist - TechGreen Platform

เอกสารนี้ใช้เป็นรายการตรวจสอบก่อน-ระหว่าง-หลังการ deploy ระบบ TechGreen ขึ้น production

อัปเดตล่าสุด: 2026-03-25

---

## A) Pre-Deploy (ต้องผ่านก่อน)

- [ ] ยืนยันว่า source code อยู่ branch ที่จะปล่อยจริง
- [ ] Pull latest จาก remote และ resolve conflicts
- [ ] ตรวจสอบว่าไม่มี secret จริงอยู่ในไฟล์ source
- [ ] ยืนยันว่า `.env` ไม่ถูก track ใน git
- [ ] ตรวจว่า `.env.example` ใช้ค่า placeholder เท่านั้น
- [ ] เปลี่ยน (rotate) token/API key ที่เคยเปิดเผยแล้ว

### คำสั่งแนะนำ
```powershell
git status
git branch
git fetch --all
git pull
```

```powershell
# ค้นหา secret ที่อาจเผลอค้างในโค้ด
git grep -n "DATA_GO_TH_API_KEY\|SESSION_SECRET\|GOOGLE_CLIENT_SECRET\|FACEBOOK_APP_SECRET\|CVCWtKLL"
```

---

## B) Code Quality Gate

- [ ] TypeScript check ผ่าน
- [ ] Unit tests ผ่าน (ถ้ามี)
- [ ] Build ผ่าน
- [ ] ไม่มี error สำคัญจาก lint/checker ภายในทีม

### คำสั่งแนะนำ
```powershell
pnpm check
pnpm test
pnpm build
```

---

## C) Database Readiness

- [ ] MySQL production เข้าถึงได้จาก runtime
- [ ] ยืนยันสิทธิ์ user DB (อ่าน/เขียนตามจำเป็น)
- [ ] Backup schema/data ก่อน migration
- [ ] รัน migration แล้วผ่าน

### คำสั่งแนะนำ
```powershell
pnpm db:push
```

> หมายเหตุ: หากเจอ `ECONNREFUSED` ให้ตรวจ host/port/firewall และสถานะ MySQL service

---

## D) Environment Variables (Production)

ตั้งค่าในระบบ deploy platform เท่านั้น (ห้าม commit)

- [ ] `NODE_ENV=production`
- [ ] `PORT` (ตาม platform)
- [ ] `DATABASE_URL`
- [ ] `SESSION_SECRET` (สุ่มยาว ปลอดภัย)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `FACEBOOK_APP_ID`
- [ ] `FACEBOOK_APP_SECRET`
- [ ] `DATA_GO_TH_API_KEY` (token ล่าสุดหลัง rotate)
- [ ] `DATA_GO_TH_BASE_URL` (ถ้ามี override)
- [ ] ค่า integration อื่นที่ระบบต้องใช้

---

## E) Deployment Steps

- [ ] สร้าง release branch
- [ ] commit งานล่าสุด
- [ ] push ขึ้น GitHub
- [ ] เปิด Pull Request เข้า `main`
- [ ] ผ่าน status checks และ review
- [ ] merge เข้าสาขา production
- [ ] trigger deploy อัตโนมัติ/manual ตาม pipeline

### ตัวอย่างคำสั่ง git
```powershell
git checkout -b codex/release-techgreen-<date>
git add .
git commit -m "release: TechGreen production update"
git push -u origin codex/release-techgreen-<date>
```

---

## F) Post-Deploy Validation (Smoke Test)

### เส้นทางเว็บ
- [ ] `/learning`
- [ ] `/learning/:slug`
- [ ] `/admin/content-studio`
- [ ] `/open-data`
- [ ] `/open-data/energy`

### API
- [ ] `govData.energyGroup` ตอบข้อมูลจริง
- [ ] `govData.dashboard` ทำงานหรือ fallback ได้ตามออกแบบ

### Auth
- [ ] Local login ผ่าน
- [ ] Google login ผ่าน
- [ ] Facebook login ผ่าน
- [ ] Session logout/expire ถูกต้อง
- [ ] Admin route guard ทำงานถูกต้อง

---

## G) Monitoring & Rollback

- [ ] เปิด log aggregation / error tracking
- [ ] ตั้ง health check endpoint
- [ ] เก็บ baseline metrics (error rate, latency, memory)
- [ ] เตรียม rollback plan

### Rollback Plan (ขั้นต่ำ)
- [ ] revert release commit หรือ deploy previous image
- [ ] rollback migration (หากจำเป็น)
- [ ] ทดสอบ smoke test ซ้ำหลัง rollback

---

## H) Handover Checklist

- [ ] อัปเดตเอกสารผู้ดูแลระบบ
- [ ] แจ้งทีมปฏิบัติการเรื่อง env + token ใหม่
- [ ] ยืนยันผู้รับผิดชอบ incident response
- [ ] บันทึก release note

---

## Related Docs
- `docs/TECHGREEN_PLATFORM_DEVELOPER_GUIDE.md`
- `docs/SKILLED_API_WEB_DEV.md`
- `docs/TECHGREEN_THAI_OFFICIAL_TRAINING_GUIDE.md`
- `docs/SECURITY_HARDENING.md`
