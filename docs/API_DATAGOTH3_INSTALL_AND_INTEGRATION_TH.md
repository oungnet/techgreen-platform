# คู่มือการติดตั้ง API และการใช้งานเชื่อมต่อข้อมูลกลาง (Data.go.th / Opend)

เอกสารฉบับนี้จัดทำเพื่อใช้งานกับระบบ TechGreen โดยอ้างอิงแนวทางจากคู่มือ `API-DATAGOTH3USERMANUAL.pdf` และปรับให้ตรงกับโครงสร้างโค้ดในโปรเจกต์นี้

อัปเดตล่าสุด: 28 มีนาคม 2026

## 1) วัตถุประสงค์

- ตั้งค่าและเชื่อมต่อ Data API จากภาครัฐให้ทำงานได้จริงในระบบ
- ใช้งานข้อมูลกลางผ่าน backend service อย่างปลอดภัย
- รองรับกรณี API ภายนอกไม่พร้อมใช้งาน (degraded/fallback)

## 2) สิ่งที่ต้องมีก่อนเริ่ม

1. บัญชีผู้ใช้บน `https://data.go.th`
2. เปิดหน้า “สำหรับนักพัฒนา” หรือ `https://opend.data.go.th`
3. ลงทะเบียนใช้งานบริการ API และแผนบริการที่ได้รับอนุญาต (ตัวอย่าง: `Opend` / `opend-search`)
4. API Key (User Token) สำหรับเรียก API

หมายเหตุสำคัญจากคู่มือ:
- ควรส่ง `api-key` ผ่าน HTTP Header
- หากไม่ส่ง key หรือ key ไม่ถูกต้อง จะไม่สามารถรับผลลัพธ์ API ได้ตามปกติ

## 3) รูปแบบการเรียก API ตามคู่มือ

ตัวอย่าง endpoint (CKAN ผ่าน Opend):
- `https://opend.data.go.th/get-ckan/datastore_search?resource_id=<resource_id>`

ตัวอย่างเรียกด้วย cURL:

```bash
curl -X GET \
  -H "api-key: <YOUR_API_KEY>" \
  "https://opend.data.go.th/get-ckan/datastore_search?resource_id=<RESOURCE_ID>"
```

## 4) การตั้งค่าในโปรเจกต์ TechGreen

แก้ไฟล์ `.env`:

```env
DATA_GO_TH_API_KEY=<YOUR_API_KEY>
DATA_GO_TH_BASE_URL=https://opend.data.go.th/get-ckan
DATA_GO_TH_AGRICULTURE_RESOURCE_ID=888c3098-9040-4202-9014-9989a5342a77
DATA_GO_TH_WEATHER_RESOURCE_ID=f9293671-6101-447a-8f74-8d4841d6b059
DATA_GO_TH_ALLOW_PUBLIC_FALLBACK=false
```

ค่าแนะนำ:
- ใช้ `https://opend.data.go.th/get-ckan` ตามตัวอย่าง CKAN API ในคู่มือ
- เปิด `DATA_GO_TH_ALLOW_PUBLIC_FALLBACK=true` เฉพาะกรณีต้องการ retry แบบไม่ส่ง key
- สำหรับ production แนะนำ `DATA_GO_TH_ALLOW_PUBLIC_FALLBACK=false` เพื่อบังคับใช้งานผ่าน key เท่านั้น

## 5) โครงสร้างโค้ดที่เชื่อมต่อข้อมูลกลาง

1. Service หลักเรียก Data API:
- `server/services/govDataService.ts`

2. Router ที่เปิดให้ frontend ใช้งาน:
- `server/routers/govData.ts`
- endpoint สำคัญ:
  - `govData.dashboard`
  - `govData.energyGroup`

3. หน้าจอแสดงผลข้อมูล:
- `client/src/pages/OpenDataDashboard.tsx`
- `client/src/pages/EnergyDataPage.tsx`

## 6) แนวทางเชื่อมต่อข้อมูลกลางในระบบจริง

1. Frontend เรียกผ่าน backend ของเราเท่านั้น (ไม่เรียก Data.go.th ตรงจาก browser)
2. Backend จัดการ:
- ใส่ `api-key` ให้
- ตั้ง timeout/retry
- แปลงข้อมูลให้อยู่ในรูปแบบที่ UI ใช้ร่วมกัน
- cache เพื่อลด API call ซ้ำ
- degraded mode เมื่อ API ภายนอกไม่พร้อม
- รองรับ strict key mode ตามนโยบาย Data.go.th

3. Frontend แสดงสถานะข้อมูล:
- `ok`
- `degraded`
- พร้อมข้อความอธิบายเหตุผลสำหรับผู้ใช้งาน

## 7) ทดสอบหลังตั้งค่า

1. ตรวจ type + test:

```bash
pnpm check
pnpm test
```

2. ตรวจ smoke test:

```bash
FRONTEND_URL=http://127.0.0.1:3000 API_BASE_URL=http://127.0.0.1:3000 pnpm smoke:test
```

3. ตรวจ API backend โดยตรง:

```bash
curl http://127.0.0.1:3000/api/health
curl "http://127.0.0.1:3000/api/trpc/govData.dashboard"
```

## 8) แนวปฏิบัติด้านความปลอดภัย

1. ห้าม commit API key ลง Git
2. เก็บคีย์ใน `.env` หรือ GitHub Secrets เท่านั้น
3. rotate key หากเคยเผยแพร่หน้าจอ/ข้อความที่มี key
4. จำกัดการเข้าถึง endpoint ฝั่ง admin ด้วย role-based access

## 9) การแก้ปัญหาที่พบบ่อย

1. เรียก API ได้ HTML แทน JSON
- มักเกิดจาก key/สิทธิ์ไม่ตรง endpoint
- ตรวจแผนบริการที่ผูกกับ token

2. `404` จาก `datastore_search`
- resource_id ไม่ถูกต้อง หรือ dataset ไม่เปิดให้เรียกผ่านแผนที่มี

3. Dashboard ไม่แสดงกราฟ
- ระบบอาจอยู่โหมด `degraded`
- ตรวจข้อความ error ในหน้า Open Data และตรวจ `smoke-report`

## 10) Checklist ก่อนส่งมอบระบบ

- [ ] ตั้งค่า `DATA_GO_TH_API_KEY` ใน environment ครบทุก environment
- [ ] smoke test ผ่าน
- [ ] หน้า Open Data แสดงสถานะข้อมูลได้ถูกต้อง
- [ ] มี fallback เมื่อ API ภายนอกไม่พร้อม
- [ ] ไม่พบ secret ใน source code/repo
