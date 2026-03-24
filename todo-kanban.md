# TechGreen Kanban TODO

อัปเดตล่าสุด: 2026-03-25

> รูปแบบ Kanban สำหรับติดตามงานแบบเร็ว: **Now / Next / Later**

---

## Now

- [ ] Apply migration ในเครื่องปลายทางด้วย `pnpm db:push`
- [ ] ตรวจ MySQL service และ connection ให้พร้อมใช้งานต่อเนื่อง
- [ ] ทบทวน dataset ID ใน `govData.dashboard` ให้เสถียรระยะยาว
- [ ] รันและบันทึก smoke test สำหรับเส้นทางสำคัญ
  - [ ] `/learning`
  - [ ] `/learning/:slug`
  - [ ] `/admin/content-studio`
  - [ ] `/open-data`
  - [ ] `/open-data/energy`
- [ ] สร้าง Deployment Checklist สำหรับ production handover

---

## Next

- [ ] เพิ่มระบบ Favorite/Pin datasets ในหน้า `/open-data/energy`
- [ ] เพิ่ม KPI summary ในหน้า Energy (จำนวนชุดข้อมูล/หน่วยงาน/อัปเดตล่าสุด)
- [ ] ทำ scheduled refresh รายชั่วโมงสำหรับข้อมูล Open Data สำคัญ
- [ ] เก็บ snapshot ข้อมูลย้อนหลังเพื่อใช้ดูแนวโน้ม
- [ ] เพิ่ม integration test สำหรับ API `govData.energyGroup` และ fallback path

---

## Later

- [ ] เพิ่ม member onboarding flow สำหรับผู้ใช้ใหม่
- [ ] ขยายระบบ notification UX สำหรับสมาชิก
- [ ] เพิ่มค้นหา/กรองผู้ใช้ใน User Management
- [ ] ทำ executive dashboard สำหรับผู้บริหารหน่วยงาน
- [ ] จัดทำรายงานอบรม/คู่มือเวอร์ชัน infographic สำหรับประชาชน

---

## References

- `todo.md`
- `docs/TECHGREEN_PLATFORM_DEVELOPER_GUIDE.md`
- `docs/SKILLED_API_WEB_DEV.md`
- `docs/TECHGREEN_THAI_OFFICIAL_TRAINING_GUIDE.md`
