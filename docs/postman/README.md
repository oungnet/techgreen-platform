# ชุดทดสอบ Postman สำหรับ TechGreen

ไฟล์ในโฟลเดอร์นี้ใช้สำหรับทดสอบ API ที่เกี่ยวข้องกับระบบ TechGreen ทั้งฝั่ง Backend และ Data.go.th

## ไฟล์ที่ต้องใช้

- `TechGreen-API.postman_collection.json`
- `TechGreen-API.postman_environment.json`

## ขั้นตอนใช้งาน

1. เปิด Postman
2. Import ไฟล์ Collection และ Environment ทั้ง 2 ไฟล์
3. เลือก Environment ชื่อ `TechGreen Local/Prod Environment`
4. ตั้งค่า Environment Variables

## ค่าที่ต้องใส่

- `backend_base_url`
  - ใส่ URL backend จริงของระบบ TechGreen
  - ตัวอย่าง: `https://techgreen-api.onrender.com`

- `data_go_api_key`
  - ใส่ API Key ของ Data.go.th (Opend / opend-search)
  - ใช้ค่าจริงจากบัญชีที่ได้รับสิทธิ์

- `data_go_ckan_base_url`
  - ค่าเริ่มต้นคือ `https://opend.data.go.th/get-ckan`
  - ถ้าหน่วยงานเปลี่ยน endpoint ในอนาคต ให้ปรับค่านี้ตามคู่มือล่าสุด

## ลำดับการทดสอบที่แนะนำ

1. `01 Backend / Health Check`
2. `01 Backend / TRPC: govData.dashboard`
3. `01 Backend / TRPC: govData.energyGroup`
4. `02 Data.go.th Direct / CKAN package_show (agriculture dataset)`
5. `02 Data.go.th Direct / CKAN package_show (weather dataset)`
6. `02 Data.go.th Direct / CKAN package_search (energy group)`

## เกณฑ์ผ่านเบื้องต้น

- ทุก request ควรได้ `HTTP 200`
- รายการที่มี test script ต้องขึ้นว่า `Test Results: PASS`

## ปัญหาที่พบบ่อย

- ได้ HTML แทน JSON:
  - ตรวจสอบ `data_go_api_key` ว่าถูกต้องและมีสิทธิ์กับบริการ Opend

- `401` หรือ `403`:
  - token หมดอายุ/สิทธิ์ไม่ตรงแผนบริการ

- Backend ผ่านบาง API แต่ไม่ผ่าน `govData.*`:
  - ตรวจสอบ `.env` ฝั่ง backend ว่ามี `DATA_GO_TH_API_KEY` และ `DATA_GO_TH_BASE_URL` ถูกต้อง

