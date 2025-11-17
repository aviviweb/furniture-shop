# מדריך פריסה דרך Railway Dashboard (ללא CLI)

## שלב 1: יצירת חשבון Railway

1. היכנס ל-[railway.app](https://railway.app)
2. לחץ על "Start a New Project" או "Login"
3. התחבר עם GitHub/GitLab/Email

## שלב 2: יצירת פרויקט חדש

1. ב-Dashboard, לחץ על **"New Project"**
2. בחר **"Deploy from GitHub repo"** (אם יש לך repo ב-GitHub)
   - או **"Empty Project"** אם אין repo

## שלב 3: הוספת Services

### 3.1 API Service

1. בפרויקט → לחץ **"New"** → **"GitHub Repo"** (או "Empty Service")
2. שם ה-Service: `api`
3. בחר את ה-repo שלך (אם יש)
4. ב-**Settings** → **Root Directory**: השאר ריק (root)
5. ב-**Settings** → **Build Command**: 
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
   ```
6. ב-**Settings** → **Start Command**:
   ```
   pnpm --filter @furniture/api start
   ```
7. ב-**Settings** → **Port**: `4000`

### 3.2 Web Service

1. בפרויקט → לחץ **"New"** → **"GitHub Repo"** (או "Empty Service")
2. שם ה-Service: `web`
3. בחר את אותו repo
4. ב-**Settings** → **Root Directory**: השאר ריק (root)
5. ב-**Settings** → **Build Command**:
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
6. ב-**Settings** → **Start Command**:
   ```
   pnpm --filter @furniture/web start
   ```
7. ב-**Settings** → **Port**: `3000`

### 3.3 Worker Service (אופציונלי)

1. בפרויקט → לחץ **"New"** → **"GitHub Repo"** (או "Empty Service")
2. שם ה-Service: `worker`
3. בחר את אותו repo
4. ב-**Settings** → **Root Directory**: השאר ריק (root)
5. ב-**Settings** → **Build Command**:
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
   ```
6. ב-**Settings** → **Start Command**:
   ```
   pnpm --filter @furniture/worker start
   ```

## שלב 4: הוספת Database ו-Redis

### 4.1 PostgreSQL Database

1. בפרויקט → לחץ **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway ייצור database אוטומטית
3. ה-**DATABASE_URL** יתווסף אוטומטית לכל ה-services

### 4.2 Redis

1. בפרויקט → לחץ **"New"** → **"Database"** → **"Redis"**
2. Railway ייצור Redis אוטומטית
3. ה-**REDIS_URL** יתווסף אוטומטית לכל ה-services

## שלב 5: הגדרת Environment Variables

### 5.1 API Service Variables

עבור ל-**API Service** → **Variables** → הוסף:

```
DEMO_MODE=false
JWT_SECRET=<צור מפתח חזק - למשל: openssl rand -hex 32>
PORT=4000
FRONTEND_URL=https://<web-service-url>.railway.app
```

**חשוב:** 
- `DATABASE_URL` ו-`REDIS_URL` יתווספו אוטומטית
- `FRONTEND_URL` - תצטרך להזין אחרי שתקבל את ה-URL של Web service

### 5.2 Web Service Variables

עבור ל-**Web Service** → **Variables** → הוסף:

```
NEXT_PUBLIC_API_URL=https://<api-service-url>.railway.app/api
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

**חשוב:**
- `NEXT_PUBLIC_API_URL` - תצטרך להזין אחרי שתקבל את ה-URL של API service

### 5.3 Worker Service Variables (אופציונלי)

עבור ל-**Worker Service** → **Variables**:
- `REDIS_URL` ו-`DATABASE_URL` יתווספו אוטומטית

## שלב 6: הרצת Database Migrations

### דרך Dashboard:

1. עבור ל-**API Service**
2. לחץ על **"Deployments"** → **"New Deployment"**
3. או לחץ על **"Settings"** → **"Deploy"** → **"Redeploy"**

לפני הפריסה הראשונה, תצטרך להריץ migrations:

**אופציה 1: דרך Railway Dashboard**
1. עבור ל-**API Service** → **"Deployments"**
2. לחץ על ה-Deployment האחרון
3. לחץ על **"Shell"** או **"Run Command"**
4. הרץ:
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```

**אופציה 2: דרך CLI (אם תצליח להתחבר מאוחר יותר)**
```powershell
railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

## שלב 7: פריסה

1. עבור לכל service (API, Web, Worker)
2. לחץ על **"Deploy"** או **"Redeploy"**
3. בחר את ה-branch (למשל: `main`)
4. לחץ **"Deploy"**

Railway יתחיל לבנות ולפרוס את ה-service.

## שלב 8: קבלת URLs

לאחר הפריסה:

1. עבור לכל service → **"Settings"** → **"Networking"**
2. לחץ על **"Generate Domain"** (אם אין domain)
3. העתק את ה-URL

**חשוב:** עדכן את ה-Environment Variables:
- ב-**API Service**: עדכן `FRONTEND_URL` עם ה-URL של Web service
- ב-**Web Service**: עדכן `NEXT_PUBLIC_API_URL` עם ה-URL של API service + `/api`

## שלב 9: בדיקת הפריסה

1. פתח את ה-URL של **Web Service** בדפדפן
2. בדוק שהדף נטען
3. בדוק את ה-Console ל-errors
4. בדוק את ה-Logs ב-Railway Dashboard

## פתרון בעיות

### Build נכשל:
1. בדוק את ה-Logs ב-Railway Dashboard
2. ודא ש-`pnpm-lock.yaml` קיים ומעודכן
3. ודא שכל ה-Environment Variables מוגדרים

### Database Connection Failed:
1. ודא ש-PostgreSQL service רץ
2. ודא ש-`DATABASE_URL` מוגדר ב-API service
3. בדוק את ה-Logs

### CORS Errors:
1. ודא ש-`FRONTEND_URL` ב-API service מוגדר נכון
2. ודא שה-URL מתחיל ב-`https://`

## טיפים

- **Public URLs**: Railway נותן URLs ציבוריים אוטומטית
- **Custom Domains**: אפשר להוסיף domain מותאם ב-Settings → Networking
- **Logs**: תמיד בדוק את ה-Logs אם משהו לא עובד
- **Environment Variables**: עדכן אותם אחרי שתקבל את ה-URLs

## קישורים שימושיים

- [Railway Dashboard](https://railway.app)
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

