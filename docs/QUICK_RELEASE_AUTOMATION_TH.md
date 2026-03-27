# คู่มือรันอัตโนมัติ (ลดขั้นตอน Deploy)

ใช้สคริปต์นี้เพื่อลดงานมือให้น้อยที่สุด:

- trigger Render deploy hook (ถ้ามี)
- รอจน backend `/api/health` เป็น `status: ok`
- trigger re-run GitHub Actions (ถ้ามี token + run id)
- สร้างรายงานพร้อมลิงก์ไปตั้งค่า Secret

ไฟล์สคริปต์:

- `scripts/release-ready.ps1`

## ตัวอย่างการใช้งาน

```powershell
pwsh ./scripts/release-ready.ps1 `
  -BackendUrl "https://your-backend.example.com" `
  -RenderDeployHookUrl "https://api.render.com/deploy/srv-xxxx?key=xxxx" `
  -GitHubRepo "oungnet/techgreen-platform" `
  -GitHubToken "<github_pat>" `
  -GitHubRunId "23635257367"
```

ถ้าไม่มี hook/token ให้ตัดพารามิเตอร์นั้นออกได้:

```powershell
pwsh ./scripts/release-ready.ps1 -BackendUrl "https://your-backend.example.com"
```

## ผลลัพธ์

สคริปต์จะสร้างไฟล์:

- `artifacts/release-ready-report.md`

และจะแจ้งค่า `VITE_API_BASE_URL` ที่ต้องตั้งใน GitHub Secrets ให้ตรง backend ที่ผ่าน health แล้ว

