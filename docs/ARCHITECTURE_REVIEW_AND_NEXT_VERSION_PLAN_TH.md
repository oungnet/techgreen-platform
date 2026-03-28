# สรุปการออกแบบรอบล่าสุด + ตรวจข้อบกพร่องระบบปัจจุบัน + แผนเวอร์ชันถัดไป

เอกสารนี้สรุปสิ่งที่เพิ่มเข้ามาในรอบพัฒนา CKAN Integration และวิเคราะห์จุดปรับปรุงเชิงระบบเพื่อใช้วางแผนเวอร์ชันถัดไป

## 1) สถาปัตยกรรมที่เพิ่มในรอบนี้
## 1.1 Backend Integration Layer (TechGreen -> CKAN)
- เพิ่ม service กลางสำหรับ CKAN API:
  - `server/services/ckanService.ts`
- เพิ่ม router เฉพาะงาน CKAN:
  - `server/routers/ckan.ts`
- ผูกเข้าระบบ tRPC เดิม:
  - `server/routers.ts`

หลักการ:
- แยก business logic ออกจาก route
- ใช้ cache ในหน่วยความจำ (TTL ตาม env) ลดการยิง CKAN ซ้ำ
- แยกสิทธิ์ endpoint:
  - `publicStatus` = public
  - `datasets` / `datasetDetail` = protected
  - `invalidateCache` = admin

## 1.2 Frontend Catalog Sample
- เพิ่มหน้าใหม่:
  - `client/src/pages/OpenDataCatalog.tsx`
- เพิ่ม route:
  - `/open-data/catalog`
- เพิ่มเมนูนำทาง:
  - `client/src/components/NavigationEnhanced.tsx`

หลักการ:
- แสดงสถานะ CKAN ก่อน
- ถ้าไม่ล็อกอินให้แสดงปุ่มไป login
- ถ้าล็อกอินแล้วจึงโหลด dataset list/detail จริง

## 1.3 Staging Runbook + Smoke Scripts
- คู่มือติดตั้ง staging แบบทีละคำสั่ง:
  - `INSTALL_RUNBOOK_STAGING.md`
- สคริปต์เช็ก CKAN:
  - `scripts/ckan-health-check.mjs`
- สคริปต์เช็กสะพาน TechGreen->CKAN:
  - `scripts/techgreen-ckan-smoke.mjs`

## 1.4 CI/CD หลัง deploy
- เพิ่มงาน post-deploy ใน workflow:
  - `.github/workflows/deploy-pages.yml`
- ตรวจ:
  - CKAN health
  - TechGreen CKAN bridge contract

---

## 2) ภาพรวม Data Flow ที่ใช้งานจริง
1. Frontend เรียก tRPC endpoint ที่ TechGreen backend
2. Backend อ่าน env และส่งคำขอไป CKAN API
3. Backend normalize payload + cache
4. ส่ง response กลับ frontend

ข้อดี:
- ไม่ต้องเปิด CKAN API key ฝั่ง browser
- เปลี่ยนแหล่ง CKAN ได้ที่ env โดยไม่ต้อง rebuild frontend
- จัดการ policy auth/role ได้ในจุดเดียว

---

## 3) ข้อบกพร่อง/ความเสี่ยงที่ตรวจพบในระบบปัจจุบัน
## 3.1 In-memory cache ไม่ shared ข้าม instance
ผลกระทบ:
- ถ้าขยายหลาย instance จะไม่ใช้ cache ร่วมกัน
ข้อเสนอ:
- ย้าย cache ไป Redis พร้อม key versioning

## 3.2 tRPC protected endpoint ยังไม่มี rate limit เฉพาะจุด
ผลกระทบ:
- เสี่ยงถูกยิง query ถี่ในช่วงพีค
ข้อเสนอ:
- เพิ่ม API rate limit ที่ `/api/trpc/ckan.*`

## 3.3 CKAN schema แตกต่างกันตามหน่วยงาน
ผลกระทบ:
- field บางตัวอาจไม่ครบ/ชื่อไม่เหมือน
ข้อเสนอ:
- สร้าง normalization layer แบบ schema profile per organization

## 3.4 Monitoring ยังเน้น smoke พื้นฐาน
ผลกระทบ:
- ยังไม่เห็น latency/error distribution เชิงลึก
ข้อเสนอ:
- เพิ่ม metrics + alert (`p95 latency`, error ratio, cache hit ratio)

## 3.5 Authentication/Authorization policy ยังพึ่ง session เดี่ยว
ผลกระทบ:
- หากต้องต่อ SSO หน่วยงานภายนอกจะต้องขยาย auth layer
ข้อเสนอ:
- เตรียม OIDC federation สำหรับเวอร์ชันถัดไป

---

## 4) แผนพัฒนาเวอร์ชันถัดไป (ตัดสินใจแนะนำ)
## เฟส A: Reliability (แนะนำทำก่อน)
1. ย้าย CKAN cache ไป Redis
2. เพิ่ม retry + circuit breaker สำหรับ CKAN action calls
3. เพิ่ม structured logging (request id, user id, action name)

## เฟส B: Security & Governance
1. เพิ่ม rate limit เฉพาะ endpoint CKAN
2. ทำ API key rotation policy
3. เพิ่ม audit trail สำหรับ admin action (cache invalidate, sync trigger)

## เฟส C: Data Product
1. เพิ่ม scheduled sync (nightly) เก็บ snapshot metadata
2. ทำหน้า compare dataset versions
3. เพิ่ม data quality score ต่อ dataset

---

## 5) Definition of Done ที่แนะนำสำหรับรอบถัดไป
- [ ] Redis cache ใช้งานจริงใน production
- [ ] มี dashboard latency/error ของ CKAN integration
- [ ] มี rate limit policy และ test ครบ
- [ ] มี fallback behavior ที่ตรวจสอบได้เมื่อ CKAN down
- [ ] มีเอกสาร runbook incident response
