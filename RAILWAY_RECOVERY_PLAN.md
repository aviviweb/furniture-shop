# תוכנית שיקום מקיפה - Railway Deployment

## 📋 סקירה כללית

תוכנית זו מכסה את כל השלבים לתיקון סופי ומוחלט של בעיות Railway deployment.

---

## ✅ שלב 1: Authentication ו-Project

### 1.1 Railway Token
- **סטטוס:** ✅ Token מוגדר ב-`fix-railway-auto.ps1`
- **ערך:** `8e8781e6-22bd-4f5f-9317-11132ed484ff`
- **בדיקה:** `railway status` - אמור להציג Project

### 1.2 Project Link
- **בדיקה:** `railway status`
- **צריך לראות:** `Project: furniture-shop`

---

## ✅ שלב 2: Infrastructure

### 2.1 PostgreSQL
- **בדיקה:** Railway Dashboard → Postgres Service → Status: Online
- **Variables:** `DATABASE_URL` צריך להיות ב-API Service

### 2.2 Redis
- **בדיקה:** Railway Dashboard → Redis Service → Status: Online
- **Variables:** `REDIS_URL` צריך להיות ב-API ו-Worker Services

---

## 🔧 שלב 3: API Service Configuration

### Build Command
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

### Start Command
```
pnpm --filter @furniture/api start
```

### Port
`4000`

### Pre-deploy Step
```
pnpm --filter @furniture/prisma migrate deploy
```

### Environment Variables
- `DEMO_MODE=false`
- `JWT_SECRET=<generate>`
- `PORT=4000`
- `DATABASE_URL` (אוטומטי)
- `REDIS_URL` (אוטומטי)
- `FRONTEND_URL` (אחרי קבלת URL)

---

## 🔧 שלב 4: Web Service Configuration

### Build Command
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

### Start Command
```
pnpm --filter @furniture/web start
```

### Port
`3000`

### Environment Variables (חובה!)
- `NEXT_PUBLIC_API_URL=https://<api-url>.railway.app/api`
- `NEXT_PUBLIC_TENANT_ID=furniture-demo`
- `NEXT_PUBLIC_BRAND_NAME=Furniture Shop`
- `NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9`
- `NEXT_PUBLIC_DEMO_MODE=false`
- `NODE_ENV=production`
- `PORT=3000`

---

## 🔧 שלב 5: Worker Service Configuration

### Build Command
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
```

### Start Command
```
pnpm --filter @furniture/worker start
```

### Environment Variables
- `REDIS_URL` (אוטומטי)
- `DATABASE_URL` (אופציונלי)

---

## 📝 שלב 6: Migrations

### דרך Pre-deploy (מומלץ)
Pre-deploy step ב-API Service יריץ migrations אוטומטית.

### דרך CLI
```powershell
pnpm railway:migrate
```

---

## ✅ שלב 7: וידוא תיקוני קוד

### PrismaService
- ✅ Retry logic עם exponential backoff
- ✅ Connection pooling
- **קובץ:** `apps/api/src/modules/prisma/prisma.service.ts`

### Health Check
- ✅ `/api/health` endpoint
- **קובץ:** `apps/api/src/modules/app.controller.ts`

### apiDelete
- ✅ Function נוסף
- **קובץ:** `apps/web/lib/api.ts`

---

## 🚀 שלב 8: פריסה

### סדר פריסה
1. API Service
2. Web Service
3. Worker Service

### פקודות
```powershell
pnpm deploy:api
pnpm deploy:web
pnpm deploy:worker
```

---

## 🔍 שלב 9: בדיקות

### Health Check
```
https://<api-url>/api/health
```

### Logs
- Railway Dashboard → Service → Logs
- אין ENOTFOUND errors
- Database connected successfully

### Web App
```
https://<web-url>
```

---

## 📋 Checklist סופי

- [ ] כל Services Online
- [ ] כל Variables מוגדרים
- [ ] Build Commands נכונים
- [ ] Pre-deploy step מוגדר
- [ ] Migrations רצות
- [ ] Health check עובד
- [ ] אין Build errors
- [ ] אין Runtime errors
- [ ] Web app נטען
- [ ] API עובד

---

## 📚 קבצים חשובים

- `railway.toml` - Configuration
- `fix-railway-auto.ps1` - Auto-fix script
- `RAILWAY_DEPLOYMENT_ISSUES.md` - Troubleshooting
- `FIX_WEB_BUILD_FAILURE.md` - Web build fixes
- `QUICK_FIX_RAILWAY.md` - Quick fixes

