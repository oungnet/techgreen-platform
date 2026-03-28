# INSTALL_RUNBOOK_STAGING.md

คู่มือนี้ออกแบบให้ทำตามทีละคำสั่งสำหรับเครื่อง Staging จริง โดยโฟกัสการเชื่อม **TechGreen <-> CKAN Open-D**

## 0) ขอบเขต
- ติดตั้ง CKAN Open-D บน Docker (เครื่อง Linux/VM แยก)
- ตั้งค่า TechGreen ให้ดึงข้อมูล CKAN ผ่าน backend (ไม่เปิด key ฝั่ง browser)
- รันทดสอบ health + smoke ครบ flow

---

## 1) เตรียมเครื่อง Staging (CKAN Host)
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

## 2) ดึงชุดติดตั้ง CKAN Open-D
```bash
cd ~
git clone https://gitlab.nectec.or.th/opend/ckan-docker-thai-gdc.git ckan-docker
cd ckan-docker
cp .env.template .env
```

## 3) แก้ค่า `.env` ของ CKAN
แก้เฉพาะค่าหลักต่อไปนี้:
```bash
nano .env
```

ค่าที่ต้องแก้:
- `POSTGRES_PASSWORD=<strong-password>`
- `DATASTORE_READONLY_PASSWORD=<strong-password>`
- `NGINX_PORT=80`
- `DEFAULT_URL=http://<CKAN_DOMAIN_OR_IP>`
- `CKAN_SYSADMIN_NAME=<admin>`
- `CKAN_SYSADMIN_PASSWORD=<strong-password>`
- `CKAN_SYSADMIN_EMAIL=<admin@email>`

รายการ plugin แนะนำ:
```env
CKAN__PLUGINS=thai_gdc showcase stats opendstats activity image_view datatables_view text_view webpage_view resource_proxy geo_view geojson_view shp_view xloader datastore pdf_view dcat dcat_json_interface structured_data scheming_datasets hierarchy_display hierarchy_form envvars
CKAN__VIEWS__DEFAULT_VIEWS=image_view datatables_view text_view webpage_view pdf_view geo_view geojson_view shp_view
```

## 4) สตาร์ต CKAN
```bash
docker compose up -d --build
docker compose ps
```

ตรวจ log กรณีไม่ขึ้น:
```bash
docker compose logs -f ckan
docker compose logs -f db
docker compose logs -f solr
```

## 5) ตรวจ CKAN API บนเครื่อง CKAN Host
```bash
curl "http://<CKAN_DOMAIN_OR_IP>/api/3/action/site_read"
curl "http://<CKAN_DOMAIN_OR_IP>/api/3/action/package_search?rows=1"
```

---

## 6) ตั้งค่า TechGreen ให้เชื่อม CKAN
บนเครื่องที่รัน TechGreen:

```bash
cd /path/to/techgreen-platform
cp .env.example .env
```

แก้ `.env`:
```env
# Existing
DATABASE_URL=mysql://root:@127.0.0.1:3307/techgreen_db

# New CKAN integration
CKAN_BASE_URL=http://<CKAN_DOMAIN_OR_IP>
CKAN_API_KEY=<ckan-api-key-if-required>
CKAN_DEFAULT_ORGANIZATION=
CKAN_CACHE_TTL_SEC=300
```

หมายเหตุ:
- ถ้า CKAN เปิด public read endpoint ได้ อาจเว้น `CKAN_API_KEY` ชั่วคราวได้
- production ควรใช้ HTTPS

---

## 7) ติดตั้ง dependency + migrate DB (TechGreen)
```bash
pnpm install --frozen-lockfile
pnpm db:check
pnpm db:push
```

---

## 8) ทดสอบ CKAN โดยตรงจาก TechGreen scripts
```bash
pnpm ckan:health
```

ผลที่คาดหวัง:
- แสดง `OK`
- มี `packageCount` มากกว่า/เท่ากับ 0

---

## 9) เปิด TechGreen และทดสอบ endpoint เชื่อม CKAN
```bash
pnpm dev
```

อีก terminal:
```bash
curl http://127.0.0.1:10000/api/health
curl http://127.0.0.1:10000/api/trpc/ckan.publicStatus
```

ทดสอบ smoke:
```bash
pnpm ckan:smoke
```

## 9.1 ทดสอบ protected endpoint แบบมี session (optional)
เมื่อมี cookie session ของผู้ใช้ที่ login แล้ว:
```bash
TECHGREEN_SESSION_COOKIE='tg.sid=<session-cookie-value>' pnpm ckan:smoke
```

---

## 10) Route ที่เพิ่มใน TechGreen
- `GET /api/trpc/ckan.publicStatus` (public)
- `GET /api/trpc/ckan.datasets` (protected: ต้อง login)
- `GET /api/trpc/ckan.datasetDetail` (protected: ต้อง login)
- `POST /api/trpc/ckan.invalidateCache` (admin only)

---

## 11) ปัญหาที่พบบ่อย
1. `CKAN action ... HTTP 403/401`
- ตรวจ `CKAN_API_KEY`
- ตรวจสิทธิ์ key ใน CKAN

2. `HTTP 404 /api/3/action/...`
- ตรวจ `CKAN_BASE_URL`
- ควรตั้งค่าเป็นโดเมนหลัก เช่น `https://your-ckan.gov` (ระบบจะเติม `/api/3/action` ให้อัตโนมัติ)

3. timeout
- เปิดพอร์ต firewall
- ตรวจ reverse proxy/nginx

---

## 12) คำสั่ง rollback/cleanup (Staging)
CKAN:
```bash
cd ~/ckan-docker
docker compose down
```

TechGreen:
```bash
pkill -f "tsx watch server/_core/index.ts" || true
```

---

## 13) Checklist ก่อนส่ง UAT
- [ ] CKAN web เข้าได้
- [ ] CKAN API `site_read` ผ่าน
- [ ] TechGreen `ckan.publicStatus` ผ่าน
- [ ] `pnpm ckan:health` ผ่าน
- [ ] `pnpm ckan:smoke` ผ่าน
- [ ] มีการบันทึกค่า env และแยก secret ตามมาตรฐานหน่วยงาน
