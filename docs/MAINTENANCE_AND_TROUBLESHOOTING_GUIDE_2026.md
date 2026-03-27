# คู่มือการดูแลรักษาและแก้ปัญหา TechGreen Platform 2026

เอกสารฉบับนี้จัดทำเพื่อให้ผู้ดูแลระบบ (System Administrator) และทีมพัฒนา (Development Team) สามารถดูแลรักษาและแก้ไขปัญหาของระบบ TechGreen ได้อย่างมีประสิทธิภาพ

## 1. สถานะการทำงานของระบบ (System Health Check)

### 1.1 การตรวจสอบเบื้องต้น (Quick Health Check)

ใช้คำสั่งต่อไปนี้เพื่อตรวจสอบสถานะการทำงานของระบบ:

```bash
# ตรวจสอบ API Health Endpoint
curl http://127.0.0.1:3000/api/health

# ตรวจสอบการเชื่อมต่อ Database
curl http://127.0.0.1:3000/api/trpc/health.check

# ตรวจสอบการเชื่อมต่อ Data.go.th API
curl http://127.0.0.1:3000/api/trpc/govData.dashboard
```

### 1.2 การตรวจสอบรายละเอียด (Detailed Diagnostics)

ใช้ Smoke Test เพื่อทดสอบการทำงานของระบบโดยละเอียด:

```bash
# ตั้งค่าตัวแปรสภาพแวดล้อม
export FRONTEND_URL=http://127.0.0.1:3000
export API_BASE_URL=http://127.0.0.1:3000
export SMOKE_STRICT_EXTERNAL=false

# รัน Smoke Test
pnpm smoke:test

# ดูผลลัพธ์รายละเอียด
cat artifacts/smoke-report.json | jq .
```

## 2. ปัญหาที่พบบ่อยและวิธีแก้ไข (Common Issues & Solutions)

### 2.1 ปัญหา: Dashboard ไม่แสดงข้อมูลเกษตร/อากาศ

**สาเหตุที่เป็นไปได้:**
- API Key หมดอายุหรือไม่ถูกต้อง
- Resource ID ไม่ตรงกับชุดข้อมูลในระบบ Data.go.th
- ระบบ Data.go.th ไม่พร้อมใช้งาน (Maintenance)

**วิธีแก้ไข:**
1. ตรวจสอบว่า `DATA_GO_TH_API_KEY` ถูกตั้งค่าในไฟล์ `.env` หรือ Render Dashboard
2. ลองเรียก API โดยตรงเพื่อทดสอบ:
   ```bash
   curl -H "api-key: YOUR_API_KEY" \
     "https://opend.data.go.th/get-ckan/datastore_search?resource_id=888c3098-9040-4202-9014-9989a5342a77"
   ```
3. หากได้ผลลัพธ์เป็น HTML แทน JSON ให้ตรวจสอบ Token ที่ opend.data.go.th
4. หากต้องการเปลี่ยน Resource ID ให้อัปเดตค่า `DATA_GO_TH_AGRICULTURE_RESOURCE_ID` และ `DATA_GO_TH_WEATHER_RESOURCE_ID` ใน Render Dashboard

### 2.2 ปัญหา: หน้า Energy Data ไม่โหลดข้อมูล

**สาเหตุที่เป็นไปได้:**
- ระบบ API ของ Data.go.th ไม่พร้อมใช้งาน
- Timeout ในการดึงข้อมูล (มากกว่า 15 วินาที)
- ข้อมูลชุดข้อมูลพลังงานไม่พร้อมใช้งาน

**วิธีแก้ไข:**
1. ตรวจสอบ Log ในระบบ Render เพื่อดูข้อความ Error
2. ลองเรียก API ด้วยคำสั่ง:
   ```bash
   curl -H "api-key: YOUR_API_KEY" \
     "https://opend.data.go.th/get-ckan/package_search?fq=groups:energy&rows=5"
   ```
3. หากไม่ได้ผลลัพธ์ให้ติดต่อ Data.go.th Support

### 2.3 ปัญหา: ข้อผิดพลาด "401 Unauthorized" เมื่อเรียก API

**สาเหตุ:** API Key ไม่ถูกต้องหรือหมดอายุ

**วิธีแก้ไข:**
1. ไปที่ https://opend.data.go.th
2. ลงชื่อเข้าใช้ด้วยบัญชี Data.go.th
3. ไปที่ "สำหรับนักพัฒนา" (Developer Section)
4. สร้าง API Key ใหม่
5. อัปเดตค่า `DATA_GO_TH_API_KEY` ใน Render Dashboard

### 2.4 ปัญหา: Database Connection Error

**สาเหตุ:** ไม่สามารถเชื่อมต่อกับ MySQL Database

**วิธีแก้ไข:**
1. ตรวจสอบว่า `DATABASE_URL` ถูกตั้งค่าอย่างถูกต้อง
2. ตรวจสอบว่า Database Server ยังทำงานอยู่
3. ตรวจสอบสิทธิ์การเข้าถึง (Username/Password)
4. ทดสอบการเชื่อมต่อด้วยคำสั่ง:
   ```bash
   mysql -h <host> -u <user> -p<password> -D <database>
   ```

## 3. การอัปเดตและการบำรุงรักษา (Updates & Maintenance)

### 3.1 การอัปเดต API Key

เมื่อต้องการเปลี่ยน API Key ใหม่:

1. เข้าไปที่ Render Dashboard (https://dashboard.render.com)
2. เลือก Service `techgreen-api`
3. ไปที่ "Environment" tab
4. แก้ไขค่า `DATA_GO_TH_API_KEY`
5. บันทึกการเปลี่ยนแปลง (Render จะ Redeploy โดยอัตโนมัติ)

### 3.2 การอัปเดต Resource ID

หากต้องการใช้ชุดข้อมูลใหม่จาก Data.go.th:

1. ค้นหา Resource ID ใหม่จาก https://data.go.th
2. อัปเดตค่าใน Render Dashboard:
   - `DATA_GO_TH_AGRICULTURE_RESOURCE_ID`
   - `DATA_GO_TH_WEATHER_RESOURCE_ID`
3. ทดสอบการทำงานด้วย Smoke Test

### 3.3 การ Restart Service

หากต้องการ Restart เซิร์ฟเวอร์:

1. เข้าไปที่ Render Dashboard
2. เลือก Service `techgreen-api`
3. คลิก "Restart" ที่มุมบนขวา
4. รอให้ Service เริ่มต้นใหม่ (ประมาณ 1-2 นาที)

## 4. การตรวจสอบ Log (Log Monitoring)

### 4.1 ดู Log ใน Render Dashboard

1. เข้าไปที่ Render Dashboard
2. เลือก Service `techgreen-api`
3. ไปที่ "Logs" tab
4. ค้นหา Error Messages ที่เกี่ยวข้อง

### 4.2 ดู Log ในระบบท้องถิ่น

ในระหว่างการพัฒนา:

```bash
# ดู Log ของ Browser Console
cat .manus-logs/browserConsole.log

# ดู Log ของ Server
tail -f .manus-logs/serverOutput.log
```

## 5. Checklist การดูแลรักษาประจำเดือน (Monthly Maintenance Checklist)

- [ ] ตรวจสอบสถานะ API Health
- [ ] ตรวจสอบว่า API Key ยังใช้งานได้
- [ ] รัน Smoke Test เพื่อยืนยันการทำงาน
- [ ] ตรวจสอบ Log เพื่อหา Error ที่ผิดปกติ
- [ ] อัปเดต Dependencies (ถ้ามี Security Updates)
- [ ] ทดสอบการ Backup ของ Database
- [ ] ตรวจสอบ Disk Space บนเซิร์ฟเวอร์

## 6. ติดต่อสำหรับความช่วยเหลือ (Support Contacts)

| หน่วยงาน | ช่องทาง | หมายเหตุ |
| :--- | :--- | :--- |
| **Data.go.th Support** | contact@dga.or.th | สำหรับปัญหา API ข้อมูลภาครัฐ |
| **Render Support** | support@render.com | สำหรับปัญหาการ Deploy |
| **TechGreen Team** | kula-noi@techgreen.local | สำหรับปัญหาระบบ TechGreen |

---
*เอกสารนี้จัดทำโดย: Manus AI Agent*
*วันที่อัปเดตล่าสุด: 28 มีนาคม 2026*
*เวอร์ชัน: 1.0*
