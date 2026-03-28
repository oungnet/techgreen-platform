# แนวทางนำ CKAN Open-D มาใช้กับ TechGreen (ก่อนติดตั้งจริง)

## 1) สรุปข้อมูลที่ตรวจพบจากแหล่งที่ให้มา
- ชุดไฟล์ `ckan-docker-thai-gdc-master.zip` มี `docker-compose.yml`, `.env.template`, โฟลเดอร์ `nginx/`, `postgresql/` และชี้ไปที่ image `thepaeth/ckan-thai_gdc:v3.0.4`
- แต่ `README.txt` ใน zip ระบุชัดว่าเป็น **WORK IN PROGRESS** จึงไม่ควรใช้เป็นแหล่งอ้างอิงหลักเพียงแหล่งเดียว
- Repo กลุ่ม Open-D ที่เข้าถึงได้บน GitLab (`opend`) มีเอกสารติดตั้ง CKAN 2.10.7 + extension `ckanext-thai_gdc` ค่อนข้างครบ และสอดคล้องกับบริบทไทย (metadata, harvesting, สถิติ, ภาษาไทย)

ข้อสรุปสำคัญ:
- ใช้ zip เป็น “ตัวอย่างโครงสร้าง docker” ได้
- ใช้เอกสารใน GitLab Open-D เป็น “แหล่งอ้างอิงหลัก” สำหรับการติดตั้งใช้งานจริง

---

## 2) แนวทางนำไปใช้ประโยชน์กับหน่วยงาน
## 2.1 ประโยชน์เชิงงานข้อมูล
- จัดทำบัญชีข้อมูลหน่วยงาน (Agency Data Catalog) ตามแนวทาง GDC
- บริหาร metadata มาตรฐานภาครัฐไทย
- รองรับการเชื่อมโยงข้อมูลกับศูนย์กลาง (harvesting/เชื่อม API)
- เพิ่มการค้นหา/แท็กภาษาไทย และ view ข้อมูลหลายรูปแบบ (ตาราง, ภาพ, PDF, แผนที่)

## 2.2 ประโยชน์เชิงระบบ
- มี workflow การเผยแพร่ข้อมูลที่เป็นระบบ (เจ้าของข้อมูล, ผู้ตรวจ, ผู้อนุมัติ)
- แยกสิทธิ์การใช้งานระดับหน่วยงาน
- ตรวจสอบสถิติการเข้าใช้และการดาวน์โหลดได้

## 2.3 ประโยชน์ต่อ TechGreen
- แยก “CMS ชุมชน” (TechGreen) ออกจาก “Data Catalog กลาง” (CKAN Open-D) แต่เชื่อมกันผ่าน API
- หน้า Open Data ของ TechGreen ดึงข้อมูลผ่าน proxy/backend ของตัวเอง ลดการเปิด key ฝั่ง browser
- ใช้ข้อมูลรัฐ+เอกชนร่วมกันใน dashboard เดียว

---

## 3) โครงสร้างโปรแกรมที่แนะนำ (ก่อนเริ่มติดตั้ง)
ให้วางเป็นสถาปัตยกรรม 2 ระบบเชื่อมกัน:

1. `TechGreen Platform` (มีอยู่แล้ว):
- Node.js + Drizzle + MySQL + Tailwind
- ทำหน้าที่ Portal, CMS, Auth, Dashboard กลาง

2. `CKAN Open-D` (ใหม่):
- CKAN 2.10.7 + PostgreSQL + Solr + Redis + Nginx
- ติดตั้ง extension ไทย: `thai_gdc`, `opendstats`, `scheming`, `hierarchy`, `xloader`, `dcat`, `geoview`, `pdfview`, `showcase`

การเชื่อมต่อ:
- TechGreen เรียก CKAN API ผ่าน service layer:
  - `server/services/ckan/ckanClient.ts`
  - `server/services/ckan/catalogSync.ts`
  - `server/routes/ckan.ts`
- ใช้ cache ในฝั่ง TechGreen (TTL 5–60 นาที ตาม endpoint)
- ทำ background sync รายวันสำหรับ metadata/dataset list

ตัวแปรแวดล้อมที่ควรวางแผน:
- `CKAN_BASE_URL`
- `CKAN_API_KEY` (service account)
- `CKAN_ORG_ID` (ถ้าล็อกเฉพาะหน่วยงาน)
- `CKAN_TIMEOUT_MS`
- `CKAN_SYNC_CRON`

---

## 4) ทางเลือกการติดตั้ง (แนะนำลำดับ)
## ทางเลือก A: Docker Compose (แนะนำเริ่มต้นเร็ว)
เหมาะกับ:
- ทดสอบ/PoC/หน่วยงานเริ่มต้น
- ต้องการขึ้นระบบเร็วและ rollback ง่าย

ลำดับ:
1. Clone ชุด docker ที่ใช้งานจริงจาก Open-D
2. สร้าง `.env` จาก `.env.template`
3. ตั้งค่า password, port, default URL, plugin list
4. `docker compose up -d`
5. ตรวจ container health (ckan, db, solr, redis, nginx)
6. ทดสอบหน้าเว็บ + API

## ทางเลือก B: Source Install (Production คุมละเอียด)
เหมาะกับ:
- ต้องการปรับแต่งเชิงลึก/ควบคุม dependency/ระบบเดิมของหน่วยงาน
- รองรับ hardening/security policy เฉพาะองค์กร

ลำดับ:
1. Ubuntu LTS + PostgreSQL + Solr + Redis
2. Python 3.9 + CKAN 2.10.7
3. ตั้งค่า `ckan.ini`, database, datastore permissions
4. ติดตั้ง extension ตามลำดับ dependency
5. ตั้ง `uwsgi + supervisor + nginx`
6. ตั้ง cron สำหรับ `tracking`, `search-index`, `xloader`, `opendstats`

---

## 5) ลำดับ dependency ของ extension (สำคัญ)
แนะนำให้ลงตามลำดับนี้:
1. `ckanext-scheming`
2. `ckanext-hierarchy`
3. `ckanext-opendstats`
4. `ckanext-xloader`
5. `ckanext-dcat`
6. `ckanext-geoview`
7. `ckanext-pdfview`
8. `ckanext-showcase`
9. `ckanext-thai_gdc`

และตั้งค่า `ckan.plugins` ให้ `thai_gdc` อยู่ลำดับต้นตามคู่มือ

---

## 6) แผนทดสอบก่อนขึ้นใช้งานจริง (UAT/Go-live)
## 6.1 Smoke Test ระบบ CKAN
- เปิดหน้าเว็บ CKAN ได้
- Login sysadmin ได้
- สร้าง organization/dataset/resource ได้
- สร้าง datastore และ preview ได้
- เรียก `/api/3/action/package_search` ได้

## 6.2 Integration Test กับ TechGreen
- TechGreen เรียก CKAN API ผ่าน backend ได้
- Endpoint ภายในของ TechGreen เช่น `/api/ckan/datasets` ตอบกลับปกติ
- หน้า Open Data ของ TechGreen แสดงรายการ dataset ได้
- มี fallback/cached response เมื่อ CKAN ล่มชั่วคราว

## 6.3 Security Test
- ไม่เปิดเผย CKAN API key ฝั่ง frontend
- จำกัด CORS เฉพาะโดเมนที่อนุญาต
- บังคับ HTTPS ทั้งสองฝั่ง
- ทดสอบ role-based access และ audit log

---

## 7) แนวทางพัฒนาต่อในอนาคต
1. Data Quality Pipeline:
- เพิ่มตัวตรวจ metadata completeness + schema quality
- แจ้งเตือนชุดข้อมูลที่ขาด field สำคัญ

2. Federated Catalog:
- รวมหลายหน่วยงานเข้า index กลาง (cross-agency search)
- ใช้ harvesting schedule และ monitoring dashboard

3. API Gateway & Rate Limit:
- วาง API gateway หน้า CKAN
- กำหนด quota ตามผู้ใช้/หน่วยงาน

4. SSO ภาครัฐ:
- เชื่อมกับ IdP ส่วนกลาง (OIDC/SAML) เพื่อรวมบัญชีผู้ใช้

5. Observability:
- เก็บ metrics ของ CKAN + TechGreen ใน Prometheus/Grafana
- ทำ alert เมื่อ sync ล้มเหลวหรือ API latency สูงผิดปกติ

---

## 8) ข้อเสนอแนะเชิงปฏิบัติ (เริ่มทำได้ทันที)
1. ตั้ง sandbox แยก (`staging`) ด้วย Docker ก่อน
2. เชื่อม TechGreen -> CKAN เฉพาะ read-only API ในเฟสแรก
3. ผ่าน UAT แล้วค่อยเปิด write flow (publish/sync metadata)
4. ทำ backup/restore runbook สำหรับ PostgreSQL และ CKAN storage

---

## 9) ขอบเขตที่ควรระวัง
- ชุด zip ที่ได้รับมีข้อความ WIP จึงไม่ควรใช้ตรงๆ โดยไม่เทียบเอกสารล่าสุด
- คู่มือบางส่วนผูกกับ Ubuntu/Python/CKAN เวอร์ชันเฉพาะ ต้อง pin เวอร์ชันให้ตรง
- ชื่อ plugin และลำดับ plugin มีผลต่อหน้า UI/behavior จริง

---

## 10) Output ที่แนะนำในเฟสถัดไป
- เอกสาร `INSTALL_RUNBOOK_STAGING.md` แบบ command-by-command สำหรับเครื่องจริง
- สคริปต์ `ckan-health-check.sh` + `techgreen-ckan-smoke.mjs`
- แผน migration จากข้อมูลเดิม -> CKAN dataset/resource metadata
