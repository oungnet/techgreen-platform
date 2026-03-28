# คู่มือกู้ระบบฐานข้อมูลในเครื่อง (Local Database Recovery)

เอกสารนี้ใช้เมื่อระบบเชื่อมต่อฐานข้อมูลไม่ได้ (`ECONNREFUSED`, พอร์ต 3306 ปิด)

## 1) ตรวจสถานะฐานข้อมูลอย่างเร็ว

```powershell
pnpm db:check
```

ถ้าขึ้น `FAILED ECONNREFUSED` แปลว่า MySQL ยังไม่พร้อม

## 2) ตั้งค่า MySQL ใหม่แบบอัตโนมัติ (Windows)

```powershell
pwsh ./scripts/setup-local-mysql.ps1 -InstallIfMissing
```

สคริปต์จะ:

- ตรวจว่ามี MySQL/MariaDB service หรือไม่
- ติดตั้ง MySQL ผ่าน `winget` เมื่อยังไม่พบ service
- start service และตรวจพอร์ต `3306`

## 3) ตั้งค่า DATABASE_URL ใน `.env`

ตัวอย่าง local:

```env
DATABASE_URL=mysql://root:1234@localhost:3306/techgreen_db
```

## 4) สร้าง/อัปเดต schema

```powershell
pnpm db:push
```

## 5) ตรวจซ้ำ

```powershell
pnpm db:check
pnpm dev
```

## หมายเหตุสำคัญ

- สำหรับ production (Render) ห้ามใช้ `localhost` ใน `DATABASE_URL`
- ต้องใช้ Cloud MySQL host ที่เข้าถึงจากอินเทอร์เน็ตได้
