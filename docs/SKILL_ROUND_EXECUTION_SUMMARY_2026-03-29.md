# [Skill] สรุปกระบวนการทำงานรอบล่าสุด (CKAN + TechGreen)

วันที่ดำเนินการ: 29 มีนาคม 2026  
ขอบเขตงาน: ตรวจระบบที่ค้าง, ปรับโครงสร้างลิงก์หน้าเว็บจริง, ตรวจลิงก์เสีย 404, ทดสอบการทำงานร่วมกันระหว่าง CKAN และ TechGreen

---

## 1) เป้าหมายรอบงาน
1. ยืนยันว่าเส้นทางสำคัญของเว็บไม่เกิด 404
2. ทำให้โครงสร้างลิงก์หน้าเว็บสอดคล้องกับ route ที่มีจริง
3. ทดสอบการเชื่อมระบบ CKAN + TechGreen แบบ end-to-end
4. ยืนยันผลด้วย smoke test และรายงานที่ตรวจสอบย้อนหลังได้

---

## 2) กระบวนการที่ดำเนินการ
## 2.1 ตรวจและปรับ route/layer ฝั่ง Frontend
- ตรวจเส้นทางที่มีจริงใน `client/src/App.tsx`
- สแกนลิงก์ทั้งหมดที่ขึ้นต้นด้วย `/` จากไฟล์หน้าเว็บ/คอมโพเนนต์
- พบจุดเสี่ยง 404: ลิงก์ `/components` ถูกใช้งานแต่ยังไม่ผูก route จริง
- แก้ไข:
  - เพิ่ม route `/components` ให้ชี้ไป `ComponentShowcase`
  - เพิ่มลิงก์ `Open Data` และ `Data Catalog` ใน Footer
  - อัปเดต label ใน Breadcrumb สำหรับเส้นทางข้อมูลเปิดและหน้า components

## 2.2 เพิ่มเงื่อนไขทดสอบลิงก์ใน Smoke Test
- ปรับ `scripts/smoke-test.mjs` ให้ตรวจ route เพิ่ม:
  - `/open-data/catalog`
  - `/components`
- เพื่อป้องกัน regression ของลิงก์ในรอบถัดไป

## 2.3 ทดสอบระบบ CKAN + TechGreen
- ตรวจ DB local และ readiness:
  - `start-local-mysql-user.ps1`
  - `pnpm db:check`
- ตรวจ CKAN upstream:
  - `pnpm ckan:health`
- เปิดระบบและทดสอบ API bridge:
  - `GET /api/trpc/ckan.publicStatus` ต้องตอบ 200
  - `GET /api/trpc/ckan.datasets` (ไม่ล็อกอิน) ต้องตอบ 401
- รันทดสอบรวม:
  - `pnpm ckan:smoke`

---

## 3) ผลลัพธ์ที่ได้
## 3.1 เส้นทาง/ลิงก์
- ตรวจไม่พบลิงก์เสียในโค้ดหลังปรับ (`NO_POTENTIAL_BROKEN_LINKS`)
- Smoke test หน้าเว็บผ่านครบใน local:
  - `/`
  - `/learning`
  - `/open-data`
  - `/open-data/catalog`
  - `/components`

## 3.2 CKAN Integration
- `ckan.publicStatus` ตอบ `status: ok`
- `ckan.datasets` ตอบ `401` สำหรับผู้ใช้ไม่ล็อกอิน (ถูกต้องตาม policy)
- `pnpm ckan:smoke` ผ่าน

---

## 4) ไฟล์ที่แก้ไขในรอบนี้ (หลัก)
- `client/src/App.tsx`
- `client/src/components/Footer.tsx`
- `client/src/components/Breadcrumb.tsx`
- `scripts/smoke-test.mjs`

ไฟล์รายงานผลทดสอบที่สร้าง:
- `artifacts/smoke-report.links.json`
- `artifacts/techgreen-ckan-smoke.integration.json`

---

## 5) Commit ที่เกี่ยวข้อง
- `85a1eaa`  
  ข้อความ: `fix(routing): resolve broken links and extend smoke route coverage`

---

## 6) สถานะระบบหลังจบรอบ
- โครงสร้างลิงก์หน้าเว็บ: พร้อมใช้งาน
- จุดเสี่ยง 404 ที่พบ: แก้ไขแล้ว
- การทำงานร่วม CKAN + TechGreen: พร้อมใช้งานตามเงื่อนไขสิทธิ์
- Smoke test: ผ่านตามขอบเขตที่กำหนด

---

## 7) ข้อเสนอสำหรับรอบถัดไป
1. เพิ่มชุดทดสอบ login session จริง เพื่อยืนยัน `ckan.datasets` ตอบ 200 หลัง auth
2. เพิ่ม monitoring metric สำหรับ CKAN bridge (latency, error rate, cache hit)
3. ขยาย smoke test ไปยังเส้นทาง admin ที่สำคัญ (ภายใต้บัญชีทดสอบ)
