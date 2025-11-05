# מדריך פריסה ל-Railway - Production Deploy

מדריך מפורט להעברת האפליקציה ממצב דמו לייצור עם Railway.

## דרישות מוקדמות

1. **Railway Account** - חשבון פעיל ב-Railway
2. **Railway CLI** - מותקן ומחובר
3. **Git Repository** - קוד האפליקציה ב-GitHub/GitLab

## התקנת Railway CLI

```powershell
# התקנה גלובלית
pnpm add -g @railway/cli

# התחברות
railway login
```

## שלב 1: יצירת Railway Project

### דרך 1: דרך Dashboard
1. היכנס ל-[Railway Dashboard](https://railway.app)
2. לחץ על "New Project"
3. בחר "Deploy from GitHub repo" (אם יש repo) או "Empty Project"

### דרך 2: דרך CLI
```powershell
railway init
```

## שלב 2: יצירת Services

צריך ליצור 3 services:

1. **API Service** - Backend (NestJS)
2. **Web Service** - Frontend (Next.js)
3. **Worker Service** - Background Jobs (אופציונלי)

### דרך Dashboard:
1. בפרויקט → לחץ "New Service"
2. בחר "GitHub Repo" או "Empty Service"
3. חזור על הפעולה לכל service

### דרך CLI:
```powershell
# חיבור לפרויקט
railway link

# או יצירת service חדש
railway service create api
railway service create web
railway service create worker
```

## שלב 3: יצירת Database ו-Redis

### דרך Dashboard:
1. בפרויקט → "New" → "Database" → "PostgreSQL"
2. "New" → "Database" → "Redis"

### דרך CLI:
```powershell
railway add postgresql
railway add redis
```

## שלב 4: הגדרת משתני סביבה

### API Service Variables

העתק את הערכים מ-`apps/api/env.example` והגדר ב-Railway:

```powershell
# דרך CLI
railway variables set --service api DEMO_MODE=false
railway variables set --service api JWT_SECRET=<strong-random-secret>
railway variables set --service api PORT=4000
railway variables set --service api DATABASE_URL=<postgresql-url-from-railway>
railway variables set --service api REDIS_URL=<redis-url-from-railway>
railway variables set --service api FRONTEND_URL=https://<your-web-domain>.railway.app
```

**שירותים אופציונליים** (אם יש לך API keys):
```powershell
railway variables set --service api SENDGRID_API_KEY=<key>
railway variables set --service api TWILIO_ACCOUNT_SID=<sid>
railway variables set --service api TWILIO_AUTH_TOKEN=<token>
railway variables set --service api STRIPE_SECRET_KEY=<key>
railway variables set --service api GOOGLE_MAPS_API_KEY=<key>
railway variables set --service api OPENAI_API_KEY=<key>
railway variables set --service api CLOUDINARY_URL=<url>
```

### Web Service Variables

```powershell
railway variables set --service web NEXT_PUBLIC_TENANT_ID=<tenant-id>
railway variables set --service web NEXT_PUBLIC_API_URL=https://<api-domain>.railway.app/api
railway variables set --service web NEXT_PUBLIC_BRAND_NAME="Your Brand Name"
railway variables set --service web NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
railway variables set --service web NEXT_PUBLIC_DEMO_MODE=false
railway variables set --service web NODE_ENV=production
railway variables set --service web PORT=3000
```

### Worker Service Variables

```powershell
railway variables set --service worker REDIS_URL=<redis-url-from-railway>
railway variables set --service worker DATABASE_URL=<postgresql-url-from-railway>
```

**שירותים אופציונליים** (אם יש לך API keys):
```powershell
railway variables set --service worker SENDGRID_API_KEY=<key>
railway variables set --service worker TWILIO_ACCOUNT_SID=<sid>
railway variables set --service worker TWILIO_AUTH_TOKEN=<token>
railway variables set --service worker OPENAI_API_KEY=<key>
```

## שלב 5: הגדרת Railway.toml

הקובץ `railway.toml` כבר מוגדר:

```toml
[project]
name = "furniture-saas"

[services.api]
path = "backend"
start = "pnpm --filter @furniture/api start"

[services.web]
path = "frontend"
start = "pnpm --filter @furniture/web start"

[services.worker]
path = "."
start = "pnpm --filter @furniture/worker start"
```

## שלב 6: הרצת Database Migrations

לפני הפריסה, צריך להריץ migrations על ה-Database:

```powershell
# הגדר DATABASE_URL זמנית
$env:DATABASE_URL="<postgresql-url-from-railway>"

# הרץ migrations
cd packages/prisma
pnpm prisma migrate deploy

# או דרך Railway CLI
railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

## שלב 7: פריסה

### דרך Dashboard:
1. עבור לכל service → "Deploy"
2. בחר את ה-branch (למשל: `main`)
3. לחץ "Deploy"

### דרך CLI:
```powershell
# פריסת API
railway up --service api --path backend

# פריסת Web
railway up --service web --path frontend

# פריסת Worker
railway up --service worker
```

### דרך package.json scripts:
```powershell
pnpm deploy:api
pnpm deploy:web
```

## שלב 8: בדיקת ה-Deployment

1. בדוק את ה-Logs:
```powershell
railway logs --service api
railway logs --service web
railway logs --service worker
```

2. בדוק את ה-Status:
   - Railway Dashboard → Services → בחר service → Logs

3. בדוק את ה-URLs:
   - Railway Dashboard → Services → בחר service → Settings → Networking
   - העתק את ה-Public URL

## טיפים לפתרון בעיות

### בעיה: CORS Errors
**פתרון**: ודא ש-`FRONTEND_URL` ב-API service מוגדר נכון כ-URL של ה-Web service.

### בעיה: Database Connection Failed
**פתרון**: 
1. ודא ש-`DATABASE_URL` מוגדר נכון
2. ודא שה-Database service רץ
3. בדוק את ה-Logs: `railway logs --service api`

### בעיה: Environment Variables לא נטענים
**פתרון**:
1. ודא שהמשתנים מוגדרים ב-Railway Dashboard
2. ודא שהם מוגדרים ל-service הנכון
3. נסה re-deploy: `railway up`

### בעיה: Build Fails
**פתרון**:
1. בדוק את ה-Logs: `railway logs`
2. ודא ש-`pnpm-lock.yaml` מעודכן
3. ודא ש-`package.json` תקין

### בעיה: Worker לא רץ
**פתרון**:
1. ודא ש-`REDIS_URL` מוגדר
2. בדוק את ה-Logs: `railway logs --service worker`
3. ודא שה-Worker service מוגדר ל-rerun on failure

## רשימת משתני סביבה - סיכום

### API Service (חובה):
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key ל-JWT (חזק!)
- `DEMO_MODE=false` - **חשוב!** להשבית דמו
- `PORT=4000` - Port (אופציונלי)
- `FRONTEND_URL` - URL של ה-Web service

### Web Service (חובה):
- `NEXT_PUBLIC_API_URL` - URL של ה-API service
- `NEXT_PUBLIC_TENANT_ID` - מזהה ה-tenant
- `NEXT_PUBLIC_BRAND_NAME` - שם המותג
- `NEXT_PUBLIC_PRIMARY_COLOR` - צבע ראשי
- `NEXT_PUBLIC_DEMO_MODE=false` - **חשוב!** להשבית דמו
- `NODE_ENV=production`
- `PORT=3000` - Port (אופציונלי)

### Worker Service (חובה):
- `REDIS_URL` - Redis connection string
- `DATABASE_URL` - PostgreSQL connection string (אופציונלי)

## בדיקות לאחר פריסה

1. **בדוק API Health**:
   ```powershell
   curl https://<api-domain>.railway.app/api
   ```

2. **בדוק Web**:
   - פתח את ה-URL של ה-Web service בדפדפן
   - בדוק שהדף נטען
   - בדוק console ל-errors

3. **בדוק Worker**:
   ```powershell
   railway logs --service worker
   ```

## עדכון Deployment

לעדכן את ה-Deployment:

1. **עדכן קוד ב-Git**:
   ```powershell
   git add .
   git commit -m "Update deployment"
   git push
   ```

2. **Railway יפרוס אוטומטית** (אם יש GitHub integration)
   - או: `railway up` ידנית

## תמיכה

לבעיות נוספות:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

