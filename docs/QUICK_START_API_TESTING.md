# Quick Start: API Testing Guide - TechGreen Platform 2026

คู่มือการทดสอบ API ของระบบ TechGreen Platform ให้ทำงานได้จริงอย่างรวดเร็ว

## 1. เตรียมความพร้อม (Setup)

### 1.1 ตรวจสอบตัวแปรสภาพแวดล้อม

```bash
# ตรวจสอบไฟล์ .env
cat .env | grep DATA_GO_TH

# ควรได้ผลลัพธ์:
# DATA_GO_TH_API_KEY=CVCWtKLL89o5jKgOmly5hzcemaZwz4Dj
# DATA_GO_TH_BASE_URL=https://opend.data.go.th/get-ckan
# DATA_GO_TH_AGRICULTURE_RESOURCE_ID=888c3098-9040-4202-9014-9989a5342a77
# DATA_GO_TH_WEATHER_RESOURCE_ID=f9293671-6101-447a-8f74-8d4841d6b059
```

### 1.2 เริ่ม Development Server

```bash
# Terminal 1: เริ่ม Backend + Frontend
cd /path/to/techgreen-platform
pnpm dev

# ควรได้ผลลัพธ์:
# Server running on http://localhost:10000/
```

## 2. ทดสอบ API ขั้นพื้นฐาน (Basic Testing)

### 2.1 ทดสอบ Health Check

```bash
# ตรวจสอบว่า Server ทำงานอยู่
curl http://localhost:10000/api/health

# ควรได้ผลลัพธ์:
# {"status":"ok"}
```

### 2.2 ทดสอบ tRPC Endpoint - Dashboard

```bash
# ทดสอบการดึงข้อมูล Dashboard
curl "http://localhost:10000/api/trpc/govData.dashboard"

# ควรได้ผลลัพธ์ (JSON):
# {
#   "result": {
#     "data": {
#       "status": "ok",
#       "agriculture": {
#         "fetchedAt": "2026-03-28T...",
#         "cached": false,
#         "rawCount": 100,
#         "trend": [...],
#         "preview": [...]
#       },
#       "weather": {...}
#     }
#   }
# }
```

### 2.3 ทดสอบ tRPC Endpoint - Energy Group

```bash
# ทดสอบการค้นหา Energy Group
curl "http://localhost:10000/api/trpc/govData.energyGroup?input=%7B%22start%22:0,%22limit%22:5%7D"

# ควรได้ผลลัพธ์ (JSON):
# {
#   "result": {
#     "data": {
#       "datasets": [
#         {
#           "id": "...",
#           "title": "...",
#           "organization": "...",
#           "resourceCount": 3,
#           "sampleRows": [...]
#         }
#       ],
#       "total": 42,
#       "fetchedAt": "...",
#       "cached": false
#     }
#   }
# }
```

## 3. ทดสอบการแสดงผลบน Frontend

### 3.1 เปิดหน้า Dashboard

1. เปิด Browser ไปที่ `http://localhost:10000`
2. ไปที่ `/open-data` หรือคลิก "Open Data Dashboard"
3. ตรวจสอบว่าข้อมูลแสดงผล:
   - ✅ กราฟแนวโน้มราคาเกษตร
   - ✅ Widget ข้อมูลอากาศ (พื้นที่, สภาพอากาศ, อุณหภูมิ, ความชื้น)
   - ✅ ตารางข้อมูลตัวอย่าง

### 3.2 เปิด Browser DevTools เพื่อตรวจสอบ Error

1. กด `F12` เพื่อเปิด DevTools
2. ไปที่ Tab "Console" เพื่อดู Error messages
3. ไปที่ Tab "Network" เพื่อดู API requests

## 4. ทดสอบ API ข้อมูลภาครัฐโดยตรง (Direct API Testing)

### 4.1 ทดสอบการเชื่อมต่อ Data.go.th

```bash
# ทดสอบ API ข้อมูลภาครัฐโดยตรง
API_KEY="CVCWtKLL89o5jKgOmly5hzcemaZwz4Dj"

# ค้นหา Package ในกลุ่ม Energy
curl -H "api-key: $API_KEY" \
  "https://opend.data.go.th/get-ckan/package_search?fq=groups:energy&rows=5"

# ดึงข้อมูลจาก Resource ID
curl -H "api-key: $API_KEY" \
  "https://opend.data.go.th/get-ckan/datastore_search?resource_id=888c3098-9040-4202-9014-9989a5342a77&limit=10"
```

### 4.2 ตรวจสอบ Response Status

```bash
# ตรวจสอบ HTTP Status Code
curl -w "\nHTTP Status: %{http_code}\n" \
  -H "api-key: $API_KEY" \
  "https://opend.data.go.th/get-ckan/package_search?fq=groups:energy&rows=5"

# ควรได้ HTTP 200
```

## 5. ทดสอบ Caching (Cache Testing)

### 5.1 ตรวจสอบว่า Cache ทำงาน

```bash
# ครั้งแรก: ควรได้ "cached": false
curl "http://localhost:10000/api/trpc/govData.dashboard" | jq '.result.data.agriculture.cached'

# ครั้งที่สอง (ภายใน 1 ชั่วโมง): ควรได้ "cached": true
curl "http://localhost:10000/api/trpc/govData.dashboard" | jq '.result.data.agriculture.cached'
```

### 5.2 ล้าง Cache และทดสอบใหม่

หากต้องการทดสอบการดึงข้อมูลใหม่:

1. Restart Server: `Ctrl+C` แล้ว `pnpm dev`
2. Cache จะถูกล้าง
3. ทดสอบใหม่ด้วยคำสั่ง curl ข้างบน

## 6. ทดสอบ Error Handling (Error Scenarios)

### 6.1 ทดสอบเมื่อ API Key ไม่ถูกต้อง

```bash
# ลบ API Key ชั่วคราว
export DATA_GO_TH_API_KEY=""

# Restart Server
pnpm dev

# ทดสอบ Endpoint
curl "http://localhost:10000/api/trpc/govData.dashboard"

# ควรได้ status: "degraded" พร้อม error message
```

### 6.2 ทดสอบเมื่อ Resource ID ไม่ถูกต้อง

```bash
# แก้ไขไฟล์ .env
DATA_GO_TH_AGRICULTURE_RESOURCE_ID="invalid-resource-id"

# Restart Server
pnpm dev

# ทดสอบ Endpoint
curl "http://localhost:10000/api/trpc/govData.dashboard"

# ควรได้ status: "degraded" และระบบจะพยายามค้นหา Resource ID ใหม่
```

## 7. Smoke Test (Automated Testing)

### 7.1 รัน Smoke Test

```bash
# ตั้งค่าตัวแปรสภาพแวดล้อม
export FRONTEND_URL=http://127.0.0.1:10000
export API_BASE_URL=http://127.0.0.1:10000
export SMOKE_STRICT_EXTERNAL=false

# รัน Smoke Test
pnpm smoke:test

# ควรได้ผลลัพธ์:
# ✅ Health check passed
# ✅ govData.dashboard passed
# ✅ govData.energyGroup passed
```

### 7.2 ดูรายงาน Smoke Test

```bash
# ดูรายงานรายละเอียด
cat artifacts/smoke-report.json | jq .

# ดูเฉพาะ Passed/Failed
cat artifacts/smoke-report.json | jq '.tests[] | {name: .name, status: .status}'
```

## 8. Type Check & Validation

### 8.1 ตรวจสอบ TypeScript Errors

```bash
# ตรวจสอบว่าไม่มี Type errors
pnpm check

# ควรได้ผลลัพธ์:
# ✅ No type errors found
```

### 8.2 ตรวจสอบ Environment Variables

```bash
# ตรวจสอบความสอดคล้องของตัวแปรสภาพแวดล้อม
pnpm env:check

# ควรได้ผลลัพธ์:
# ✅ All environment variables are consistent
```

## 9. Troubleshooting

### ปัญหา: "Cannot GET /api/trpc/govData.dashboard"

**สาเหตุ:** Server ไม่ได้เริ่มต้นอย่างถูกต้อง

**วิธีแก้:**
```bash
# ตรวจสอบ Port
lsof -i :10000

# ถ้ามี Process อื่นใช้ Port 10000 ให้ Kill มัน
kill -9 <PID>

# Restart Server
pnpm dev
```

### ปัญหา: "API returned status 401"

**สาเหตุ:** API Key ไม่ถูกต้อง

**วิธีแก้:**
```bash
# ตรวจสอบ API Key
echo $DATA_GO_TH_API_KEY

# ถ้าว่าง ให้ตั้งค่าใหม่
export DATA_GO_TH_API_KEY="CVCWtKLL89o5jKgOmly5hzcemaZwz4Dj"

# Restart Server
pnpm dev
```

### ปัญหา: "data.go.th returned HTML instead of JSON"

**สาเหตุ:** API Token หมดอายุหรือไม่มีสิทธิ์เข้าถึง

**วิธีแก้:**
1. ไปที่ https://opend.data.go.th
2. ลงชื่อเข้าใช้ด้วยบัญชี
3. สร้าง API Key ใหม่
4. อัปเดตค่า `.env` และ restart server

## 10. Done Criteria Checklist

- [ ] Health check ตอบ HTTP 200
- [ ] `govData.dashboard` ตอบ HTTP 200 พร้อมข้อมูล
- [ ] `govData.energyGroup` ตอบ HTTP 200 พร้อมข้อมูล
- [ ] Frontend แสดงกราฟ + widget + ตาราง
- [ ] Cache ทำงาน (ตรวจสอบ `cached: true` ในครั้งที่สอง)
- [ ] Error handling ทำงาน (ทดสอบเมื่อ API Key ไม่ถูกต้อง)
- [ ] Type check ผ่าน (`pnpm check`)
- [ ] Smoke test ผ่านทั้งหมด (`pnpm smoke:test`)

---
*เอกสารนี้จัดทำโดย: Manus AI Agent*
*วันที่อัปเดตล่าสุด: 28 มีนาคม 2026*
*เวอร์ชัน: 1.0*
