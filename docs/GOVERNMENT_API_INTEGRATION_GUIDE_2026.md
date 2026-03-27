# คู่มือการเชื่อมต่อ API ข้อมูลภาครัฐ (Data.go.th) - TechGreen Platform 2026

เอกสารฉบับนี้สรุปขั้นตอนการเชื่อมต่อ การดูแลรักษา และการตั้งค่าระบบ TechGreen เพื่อใช้งานร่วมกับข้อมูลกลางภาครัฐ (Data.go.th / Opend) ตามมาตรฐานปี 2026

## 1. ข้อมูลทางเทคนิค (Technical Specifications)

ระบบ TechGreen เชื่อมต่อกับ Data.go.th ผ่านส่วนของ Backend (Proxy Mode) เพื่อความปลอดภัยและความเสถียร โดยมีรายละเอียดดังนี้:

| หัวข้อ | รายละเอียด |
| :--- | :--- |
| **Backend Service** | `server/services/govDataService.ts` |
| **API Protocol** | REST / CKAN API |
| **Authentication** | API Key (ส่งผ่าน Header: `api-key`) |
| **Base URL** | `https://opend.data.go.th/get-ckan` (รองรับการ Normalize อัตโนมัติ) |
| **Data Format** | JSON (รองรับ Fallback เป็น CSV/XLSX สำหรับข้อมูลบางประเภท) |

## 2. การตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)

เพื่อให้ระบบทำงานได้ถูกต้อง ต้องตั้งค่าตัวแปรในไฟล์ `.env` หรือในระบบ CI/CD (GitHub Secrets / Render Dashboard) ดังนี้:

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น/ตัวอย่าง |
| :--- | :--- | :--- |
| `DATA_GO_TH_API_KEY` | คีย์สำหรับเรียกใช้งาน API (ได้จาก opend.data.go.th) | *ต้องระบุ (Secret)* |
| `DATA_GO_TH_BASE_URL` | URL หลักของบริการ API | `https://opend.data.go.th/get-ckan` |
| `DATA_GO_TH_AGRICULTURE_RESOURCE_ID` | ID ชุดข้อมูลราคาสินค้าเกษตร | `888c3098-9040-4202-9014-9989a5342a77` |
| `DATA_GO_TH_WEATHER_RESOURCE_ID` | ID ชุดข้อมูลพยากรณ์อากาศ | `f9293671-6101-447a-8f74-8d4841d6b059` |

## 3. ระบบความปลอดภัยและการจัดการข้อผิดพลาด (Security & Error Handling)

ระบบได้รับการออกแบบมาเพื่อรองรับสถานการณ์ที่ API ภายนอกขัดข้อง (Degraded Mode):

1.  **Backend Proxy:** Frontend จะไม่เรียก API ของรัฐโดยตรง แต่จะเรียกผ่าน `/api/trpc/govData.*` เพื่อป้องกันการรั่วไหลของ API Key
2.  **Automatic Normalization:** ระบบจะตรวจสอบ Content-Type หาก API ส่งคืน HTML (เช่น เมื่อ Token หมดอายุ) ระบบจะแจ้งเตือนผ่าน Log และส่งสถานะ `degraded` ไปยัง UI
3.  **Keyword Fallback:** หาก Resource ID ที่ระบุไว้ใช้งานไม่ได้ ระบบจะพยายามค้นหาชุดข้อมูลใหม่โดยใช้ Keyword (เช่น "ราคาสินค้าเกษตร") อัตโนมัติ
4.  **Caching:** ข้อมูลจะถูกเก็บไว้ในหน่วยความจำ (Cache) เป็นเวลา 1 ชั่วโมงเพื่อลดจำนวนการเรียก API และเพิ่มความเร็วในการแสดงผล

## 4. ขั้นตอนการตรวจสอบระบบ (System Verification)

หากพบว่าข้อมูลไม่แสดงผลบนหน้า Dashboard ให้ดำเนินการตรวจสอบดังนี้:

1.  **ตรวจสอบ API Health:** เรียก `GET /api/health` เพื่อดูสถานะการเชื่อมต่อเบื้องต้น
2.  **ตรวจสอบ Token:** ตรวจสอบว่า `DATA_GO_TH_API_KEY` ยังไม่หมดอายุและมีสิทธิ์เข้าถึงชุดข้อมูลที่ต้องการ
3.  **Run Smoke Test:** ใช้คำสั่ง `pnpm smoke:test` เพื่อทดสอบการดึงข้อมูลจริงจาก API ภาครัฐ
4.  **ตรวจสอบ Logs:** ดู Log ในระบบ Render หรือในโฟลเดอร์ `.manus-logs` เพื่อหาข้อความ Error ที่ส่งมาจาก Data.go.th

## 5. การปรับปรุง GitHub Workflows

ระบบ CI/CD (`.github/workflows/ci.yml` และ `deploy-pages.yml`) ได้รับการตั้งค่าให้:
- ตรวจสอบความถูกต้องของ Type (`pnpm check`)
- รัน Unit Test ก่อนการ Deploy
- ทำการ Smoke Test หลังการ Deploy ไปยัง GitHub Pages เพื่อยืนยันว่าการเชื่อมต่อ API ยังทำงานได้ปกติ

---
*จัดทำโดย: Manus AI Agent (TechGreen Development Team)*
*วันที่: 28 มีนาคม 2026*
