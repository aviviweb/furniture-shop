# מדריך פריסה מהיר ל-Railway

## שלב 1: התחברות ל-Railway

```powershell
railway login
```

## שלב 2: יצירת/קישור פרויקט

### אופציה A: יצירת פרויקט חדש
```powershell
railway init
```

### אופציה B: קישור לפרויקט קיים
```powershell
railway link
```

## שלב 3: יצירת Services

```powershell
railway service create api
railway service create web
railway service create worker
```

## שלב 4: יצירת Database ו-Redis

```powershell
railway add postgresql
railway add redis
```

## שלב 5: הגדרת Environment Variables

השתמש בסקריפט האוטומטי (מומלץ):
```powershell
pnpm railway:setup
```

או הגדר ידנית דרך Railway Dashboard:
1. עבור לכל service → Variables
2. הוסף את המשתנים הנדרשים (ראה DEPLOY.md)

## שלב 6: הרצת Migrations

```powershell
pnpm railway:migrate
```

## שלב 7: פריסה

```powershell
# פריסת כל ה-services
pnpm deploy:all

# או פריסה נפרדת:
pnpm deploy:api
pnpm deploy:web
pnpm deploy:worker
```

## בדיקת מצב

```powershell
# בדיקת מצב כללי
pnpm railway:check

# הצגת Logs
pnpm railway:logs:api
pnpm railway:logs:web
```

## משתני סביבה נדרשים

### API Service:
- `DEMO_MODE=false`
- `JWT_SECRET=<strong-random-secret>`
- `PORT=4000`
- `FRONTEND_URL=<web-service-url>`
- `DATABASE_URL` (אוטומטי מ-PostgreSQL)
- `REDIS_URL` (אוטומטי מ-Redis)

### Web Service:
- `NEXT_PUBLIC_API_URL=<api-service-url>/api`
- `NEXT_PUBLIC_TENANT_ID=furniture-demo`
- `NEXT_PUBLIC_BRAND_NAME=Furniture Shop`
- `NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9`
- `NEXT_PUBLIC_DEMO_MODE=false`
- `NODE_ENV=production`
- `PORT=3000`

### Worker Service:
- `REDIS_URL` (אוטומטי מ-Redis)
- `DATABASE_URL` (אוטומטי מ-PostgreSQL)

