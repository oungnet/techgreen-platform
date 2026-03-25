# Security Hardening Guide - TechGreen Platform

เอกสารนี้สรุปแนวทาง hardening ระบบ TechGreen สำหรับใช้งาน production อย่างปลอดภัย

อัปเดตล่าสุด: 2026-03-25

---

## 1) Secret Management

## สิ่งที่ต้องทำ
- เก็บ secret ใน environment variables เท่านั้น
- ไม่เก็บ secret ลง repo, markdown, หรือ screenshot
- แยก secret ตาม environment (dev/staging/prod)
- ตั้งรอบเวลา rotate key เป็นประจำ

## ถ้า secret เคยถูกเผยแพร่
- Rotate ทันที
- อัปเดต runtime env
- ตรวจ log การใช้งานผิดปกติย้อนหลัง

---

## 2) Authentication & Session Security

## ควรบังคับ
- ใช้รหัสผ่าน hash (`bcrypt`) เท่านั้น
- จำกัดการลองรหัสผ่านซ้ำ (rate limit)
- session cookie ต้องตั้ง:
  - `httpOnly: true`
  - `sameSite: "lax"` หรือเข้มกว่านี้ตามบริบท
  - `secure: true` ใน production
- ตั้ง `SESSION_SECRET` แบบสุ่มยาวอย่างน้อย 32 bytes

## สำหรับ OAuth
- ระบุ callback URL เฉพาะโดเมน production
- ไม่ใช้ wildcard redirect
- ตรวจ state/anti-CSRF ใน flow ให้ครบ

---

## 3) HTTP Security Headers

แนะนำใช้ `helmet` และปรับค่าให้เหมาะกับ UI/asset ของระบบ

- [ ] `Content-Security-Policy` (เริ่มจาก report-only แล้วค่อย enforce)
- [ ] `X-Frame-Options: DENY` หรือ `SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Strict-Transport-Security` (เมื่อเปิด HTTPS ครบแล้ว)

---

## 4) TLS / HTTPS / Network

- [ ] บังคับ HTTPS ทุก route
- [ ] Redirect HTTP -> HTTPS
- [ ] เปิด HSTS หลังยืนยัน TLS เสถียร
- [ ] จำกัด inbound ports เฉพาะที่จำเป็น
- [ ] ใช้ reverse proxy ที่เชื่อถือได้
- [ ] ตั้ง `trust proxy` ให้ถูกต้องเมื่อ deploy หลัง proxy

---

## 5) API Security (Internal + External)

## 5.1 tRPC/Backend API
- [ ] ตรวจ input ด้วย zod ทุก endpoint
- [ ] จำกัดขนาด payload (`express.json` limit)
- [ ] ป้องกัน brute force ด้วย rate limit
- [ ] ใช้ role checks (admin/user) ครบทั้ง backend+frontend

## 5.2 External API (data.go.th)
- [ ] ส่ง `api-key` ผ่าน header เท่านั้น
- [ ] timeout ทุก request
- [ ] validate response type/redirect
- [ ] ทำ cache เพื่อลด call ซ้ำ
- [ ] ทำ fallback เมื่อ endpoint ภายนอกล้มเหลว

---

## 6) Database Hardening

- [ ] แยก account DB ตามสิทธิ์ (least privilege)
- [ ] จำกัดการเข้าถึง DB ด้วย network policy
- [ ] เปิด backup schedule + restore test
- [ ] บันทึก migration history
- [ ] ทดสอบ rollback แผน migration

---

## 7) File Upload Security

- [ ] ตรวจชนิดไฟล์ตาม MIME และ extension
- [ ] จำกัดขนาดไฟล์สูงสุด
- [ ] randomize key/path ของไฟล์
- [ ] ไม่เปิด public URL โดยไม่จำเป็น
- [ ] สแกนไฟล์ (ถ้าองค์กรมี antivirus pipeline)

---

## 8) Frontend Security

- [ ] หลีกเลี่ยง `dangerouslySetInnerHTML` โดยไม่ sanitize
- [ ] sanitize markdown/HTML ก่อนแสดงผล
- [ ] ป้องกัน open redirect จาก query params
- [ ] ตรวจ third-party script ที่โหลดเข้าหน้าเว็บ

---

## 9) Logging, Audit, Monitoring

- [ ] บันทึก auth events (login success/fail, logout)
- [ ] บันทึก admin actions สำคัญ (create/update/delete content)
- [ ] ปิดการ log ข้อมูลลับ (token/password)
- [ ] ตั้ง alert เมื่อ error rate พุ่งผิดปกติ
- [ ] เก็บ audit trail สำหรับ incident investigation

---

## 10) CI/CD Security Controls

- [ ] เปิด branch protection บน `main`
- [ ] บังคับ PR review ก่อน merge
- [ ] Require status checks (check/test/build)
- [ ] เปิด secret scanning
- [ ] เปิด dependency alerts และอัปเดตแพ็กเกจเสี่ยง

---

## 11) Incident Response (แผนขั้นต่ำ)

เมื่อพบเหตุผิดปกติ:
1. แยกสาเหตุ (auth, API, DB, infra)
2. จำกัดผลกระทบ (disable endpoint/rotate keys)
3. rollback ถ้าจำเป็น
4. ตรวจ log ย้อนหลังเพื่อหาขอบเขตผลกระทบ
5. จัดทำ postmortem และมาตรการป้องกันซ้ำ

---

## 12) Security Verification Checklist (ก่อน Go-Live)

- [ ] ไม่มี secret จริงใน repo
- [ ] env production ครบและถูกต้อง
- [ ] cookies/https/security headers ผ่าน
- [ ] role-based access ผ่านการทดสอบ
- [ ] endpoint สำคัญมี rate limit + validation
- [ ] backup/restore ทดสอบแล้ว
- [ ] monitoring/alert พร้อมใช้งาน

---

## Recommended Immediate Actions for TechGreen

- [ ] Rotate `DATA_GO_TH_API_KEY` ที่เคยเปิดเผยแล้ว
- [ ] ตรวจซ้ำทุกเอกสารใน `docs/` ว่าไม่มี secret จริง
- [ ] เพิ่ม middleware: `helmet` + `express-rate-limit`
- [ ] ทำ checklist security review ก่อนทุก release
