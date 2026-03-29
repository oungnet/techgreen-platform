# Skilled API Implementation Guide - TechGreen Platform 2026

คู่มือการปรับปรุงและการใช้งาน API ของระบบ TechGreen Platform ตามมาตรฐาน Skilled API Web-Dev ปี 2026

## 1. สถานะการปรับปรุงระบบ (Implementation Status)

### 1.1 สมบูรณ์แล้ว (Completed)

| ส่วนประกอบ | ไฟล์ | สถานะ | หมายเหตุ |
| :--- | :--- | :--- | :--- |
| **Service Layer** | `server/services/govDataService.ts` | ✅ | รองรับ Caching (1 hour TTL), Error Fallback, Keyword Discovery |
| **Router Layer** | `server/routers/govData.ts` | ✅ | tRPC endpoints: `dashboard`, `energyGroup` |
| **Type Safety** | `zod` validation | ✅ | ทุก input มี Zod schema |
| **Environment** | `server/_core/env.ts` | ✅ | ตัวแปร API Key, Base URL, Resource IDs |
| **Frontend Hook** | `useQuery/useMutation` | ✅ | React Query integration พร้อม |

### 1.2 ต้องปรับปรุง (In Progress)

| ส่วนประกอบ | ไฟล์ | ปัญหา | วิธีแก้ไข |
| :--- | :--- | :--- | :--- |
| **Frontend Dashboard** | `client/src/pages/OpenDataDashboard.tsx` | ยังไม่แสดงข้อมูล | ตรวจสอบ API endpoint และ Error handling |
| **Energy Page** | `client/src/pages/EnergyDataPage.tsx` | ยังไม่โหลดข้อมูล | เพิ่ม Loading state และ Error boundary |
| **API Health Check** | `/api/health` | ยังไม่ตอบสนอง | ตรวจสอบ Server startup |

## 2. API Workflow ตามมาตรฐาน Skilled API Web-Dev

### 2.1 ขั้นตอนการสร้าง API Endpoint ใหม่

#### Step 1: สร้าง Service ใน `server/services/`

```typescript
// server/services/myNewService.ts
import axios from "axios";
import { ENV } from "../_core/env";

export async function fetchMyData(params: Record<string, unknown>) {
  const response = await axios.get("https://api.example.com/data", {
    headers: {
      "Authorization": `Bearer ${ENV.myApiKey}`,
    },
    params,
    timeout: 15000,
  });

  if (response.status !== 200) {
    throw new Error(`API returned status ${response.status}`);
  }

  return response.data;
}
```

#### Step 2: เพิ่ม Route ใน `server/routers/`

```typescript
// server/routers/myRouter.ts
import { publicProcedure, router } from "../_core/trpc";
import { fetchMyData } from "../services/myNewService";
import { z } from "zod";

export const myRouter = router({
  getData: publicProcedure
    .input(
      z.object({
        query: z.string().max(100),
        limit: z.number().int().min(1).max(50).default(10),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const data = await fetchMyData({
          q: input?.query ?? "",
          limit: input?.limit ?? 10,
        });
        return {
          success: true,
          data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          data: [], // Fallback data
        };
      }
    }),
});
```

#### Step 3: Register Router ใน `server/routers.ts`

```typescript
import { myRouter } from "./routers/myRouter";

export const appRouter = router({
  // ... existing routers
  myRouter,
});
```

#### Step 4: ใช้ใน Frontend

```typescript
// client/src/pages/MyPage.tsx
import { trpc } from "@/lib/trpc";

export function MyPage() {
  const { data, isLoading, error } = trpc.myRouter.getData.useQuery({
    query: "search term",
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## 3. Data.go.th Integration - ตามมาตรฐาน

### 3.1 การเรียก API ข้อมูลภาครัฐ

**Header ที่จำเป็น:**
```
api-key: <YOUR_API_KEY>
Accept: application/json
```

**ตัวอย่างการค้นหา Energy Group:**
```bash
curl -H "api-key: YOUR_API_KEY" \
  "https://opend.data.go.th/get-ckan/package_search?fq=groups:energy&rows=10"
```

**Response Structure:**
```json
{
  "success": true,
  "result": {
    "count": 42,
    "results": [
      {
        "id": "dataset-id",
        "name": "dataset-name",
        "title": "Dataset Title",
        "resources": [
          {
            "id": "resource-id",
            "name": "Resource Name",
            "format": "CSV",
            "datastore_active": true
          }
        ]
      }
    ]
  }
}
```

### 3.2 Error Handling Strategy

ระบบ TechGreen ใช้ **Graceful Degradation** เมื่อ API ภาครัฐไม่พร้อมใช้งาน:

```typescript
// ตัวอย่างจาก govDataService.ts
try {
  return await fetchGovData(primaryId);
} catch (error) {
  // Fallback 1: ค้นหาด้วย Keyword
  const discoveredId = await discoverResourceIdByKeyword("ราคาสินค้าเกษตร");
  if (discoveredId) {
    return await fetchGovData(discoveredId);
  }
  
  // Fallback 2: ส่งข้อมูลว่าง (Empty State)
  return {
    records: [],
    fetchedAt: new Date().toISOString(),
    cached: false,
    sourceUrl: baseUrl,
  };
}
```

## 4. Caching Strategy

### 4.1 Memory Cache (1 Hour TTL)

```typescript
const ONE_HOUR_MS = 60 * 60 * 1000;
const govCache = new Map<string, GovCacheEntry>();

// ตรวจสอบ Cache
const cached = govCache.get(cacheKey);
if (cached && cached.expiresAt > Date.now()) {
  return cached.payload; // ใช้ Cached data
}

// ถ้า Cache หมดอายุ ให้ดึงข้อมูลใหม่
const newData = await fetchFromAPI();
govCache.set(cacheKey, {
  payload: newData,
  expiresAt: Date.now() + ONE_HOUR_MS,
  fetchedAt: new Date().toISOString(),
});
```

### 4.2 Cache Invalidation

หากต้องการล้าง Cache ทั้งหมด:

```bash
# ใน server/services/govDataService.ts
govCache.clear();
```

## 5. UI/UX Standards (TechGreen)

### 5.1 Design Tokens

| Element | Color | Font |
| :--- | :--- | :--- |
| **Primary** | Emerald-600 | Sarabun 600 |
| **Secondary** | Slate-700 | Sarabun 400 |
| **Background** | Slate-50 | Sarabun 400 |
| **Accent** | Emerald-400 | Sarabun 700 |

### 5.2 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Wide Desktop
```

### 5.3 Component Pattern

```typescript
// Loading State
<div className="animate-pulse">
  <div className="h-12 bg-slate-200 rounded" />
</div>

// Error State
<div className="bg-red-50 border border-red-200 rounded p-4">
  <p className="text-red-700">Error: {error.message}</p>
</div>

// Success State
<div className="bg-emerald-50 border border-emerald-200 rounded p-4">
  <p className="text-emerald-700">Data loaded successfully</p>
</div>
```

## 6. Testing & Validation

### 6.1 Type Check

```bash
pnpm check
```

ต้องผ่านโดยไม่มี TypeScript errors

### 6.2 API Health Check

```bash
# ตรวจสอบ Server Health
curl http://localhost:10000/api/health

# ตรวจสอบ tRPC Endpoint
curl "http://localhost:10000/api/trpc/govData.dashboard"
```

### 6.3 Smoke Test

```bash
pnpm smoke:test
```

ต้องผ่านทุก test cases

## 7. Done Criteria Checklist

- [ ] Type check ผ่าน (`pnpm check`)
- [ ] Route สำคัญตอบ HTTP 200
- [ ] API ได้ข้อมูลจริงหรือ fallback ชัดเจน
- [ ] Frontend แสดงข้อมูลหรือ Error message
- [ ] Loading state แสดงระหว่างการดึงข้อมูล
- [ ] Error state แสดงเมื่อ API ล้มเหลว
- [ ] Cache ทำงานได้ (ตรวจสอบ `cached: true` ใน response)
- [ ] เอกสารอัปเดตใน `docs/`
- [ ] Smoke test ผ่านทั้งหมด

## 8. Troubleshooting

### ปัญหา: API ตอบ 401 Unauthorized

**สาเหตุ:** API Key ไม่ถูกต้องหรือหมดอายุ

**วิธีแก้:**
1. ตรวจสอบ `DATA_GO_TH_API_KEY` ใน `.env`
2. ไปที่ https://opend.data.go.th สร้าง API Key ใหม่
3. อัปเดตค่า `.env` และ restart server

### ปัญหา: Frontend ไม่แสดงข้อมูล

**สาเหตุ:** API endpoint ไม่ตอบสนอง

**วิธีแก้:**
1. ตรวจสอบ Browser Console สำหรับ Error messages
2. ตรวจสอบ Network tab ใน DevTools
3. ตรวจสอบ Server logs: `tail -f .manus-logs/browserConsole.log`

### ปัญหา: Cache ไม่ทำงาน

**สาเหตุ:** Cache key ไม่ตรงกัน

**วิธีแก้:**
1. ตรวจสอบ `fetchedAt` ใน response (ต้องเป็นเวลาเดียวกัน)
2. ล้าง Cache: `govCache.clear()`
3. Restart server

## 9. References

- [Data.go.th API Documentation](https://opend.data.go.th)
- [tRPC Documentation](https://trpc.io)
- [React Query Documentation](https://tanstack.com/query)
- [Zod Documentation](https://zod.dev)

---
*เอกสารนี้จัดทำโดย: Manus AI Agent*
*วันที่อัปเดตล่าสุด: 28 มีนาคม 2026*
*เวอร์ชัน: 1.0*
