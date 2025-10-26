# מערכת SaaS לניהול חנות רהיטים (RTL)

מונורפו: Next.js 14 (Frontend), NestJS (API), BullMQ Worker, PostgreSQL (Prisma), Redis. תמיכה ב־Multi‑Tenant, White‑Label, מצב דמו/אמיתי, חשבוניות לפי החוק הישראלי, OCR, דוחות AI.

## הרצה מהירה
1. התקן תלותים: `pnpm install`
2. הרץ DB/Redis: `docker-compose up -d postgres redis`
3. בנייה וריצה: `pnpm dev` (מריץ web/api/worker במקביל)
4. זריעת נתונים: `cd packages/prisma && pnpm db:push && node seed.cjs`

Tenant ברירת מחדל: `furniture-demo`. דמו: `owner1@demo.local` / `changeme`.

## ENV חיוניים
- `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`
- אופציונלי: `OPENAI_API_KEY`, `GOOGLE_MAPS_API_KEY`, `CLOUDINARY_URL`, `STRIPE_SECRET_KEY`

## דיפלוי
- CI: `.github/workflows/ci.yml`
- Deploy: `.github/workflows/deploy.yml`, `railway.toml`

## נקודות API לדוגמה
- `POST /api/auth/login`
- `GET /api/companies/me`
- `POST /api/products` / `GET /api/products`
- `POST /api/orders`
- `POST /api/invoices`
- `POST /api/expenses/scan`
- `POST /api/deliveries/optimize`
- `POST /api/reports/generate`
- `PATCH /api/superadmin/toggleDemoMode`

## תאימות ישראלית
- מספור חשבוניות רציף לכל חברה; עיגון 2 ספרות; שמירת PDF/JSON; AuditLog; `allocationNumber` מעל תקרה; תמיכה ב־Credit Note בהמשך.

## Demo Mode (לשיווק במהירות)
- הרצה בפקודה אחת (Windows PowerShell):

```
pnpm run demo:up
```

- בדיקות עשן:

```
pnpm run demo:smoke
```

- ברירות מחדל:
  - API: `http://localhost:4010/api`
  - Web: `http://localhost:3010`