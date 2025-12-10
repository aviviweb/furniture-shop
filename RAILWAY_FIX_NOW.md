# תיקון Railway - הוראות ברורות

## ✅ מצב נוכחי
- Railway Token: מוגדר ✅
- Project: מקושר ✅
- הבעיה: Railway CLI פותח תפריטים אינטראקטיביים

## 🎯 פתרון: ביצוע ידני ב-Dashboard

### שלב 1: פתח Railway Dashboard
👉 [railway.app](https://railway.app) → התחבר → בחר פרויקט `furniture-shop`

---

### שלב 2: תיקון API Service (5 דקות)

#### 2.1 Build & Start Commands
**Dashboard → `@furniture/api` → Settings → Build:**
- **Build Command:** הדבק:
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
  ```
- **Start Command:** הדבק:
  ```
  pnpm --filter @furniture/api start
  ```
- **Port:** `4000`
- **שמור**

#### 2.2 Pre-deploy Step
**Dashboard → `@furniture/api` → Settings → Deploy:**
- גלול למטה → **Pre-deploy step**
- **"+ Add pre-deploy step"**
- הדבק:
  ```
  pnpm --filter @furniture/prisma migrate deploy
  ```
- **שמור**

#### 2.3 Environment Variables
**Dashboard → `@furniture/api` → Variables:**
- לחץ **"+ New Variable"** לכל אחד:
  - `DEMO_MODE` = `false`
  - `JWT_SECRET` = `<צור מפתח>` (ראה למטה)
  - `PORT` = `4000`
- **וודא שיש:**
  - `DATABASE_URL` (אוטומטי מ-Postgres)
  - `REDIS_URL` (אוטומטי מ-Redis)

**יצירת JWT_SECRET:**
```powershell
openssl rand -hex 32
```
או:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### שלב 3: תיקון Web Service (5 דקות)

#### 3.1 Build & Start Commands
**Dashboard → `@furniture/web` → Settings → Build:**
- **Build Command:** הדבק:
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
  ```
- **Start Command:** הדבק:
  ```
  pnpm --filter @furniture/web start
  ```
- **Port:** `3000`
- **שמור**

#### 3.2 Environment Variables (חובה!)
**Dashboard → `@furniture/web` → Variables:**
- לחץ **"+ New Variable"** לכל אחד:
  - `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
  - `NEXT_PUBLIC_BRAND_NAME` = `Furniture Shop`
  - `NEXT_PUBLIC_PRIMARY_COLOR` = `#0ea5e9`
  - `NEXT_PUBLIC_DEMO_MODE` = `false`
  - `NODE_ENV` = `production`
  - `PORT` = `3000`
  - `NEXT_PUBLIC_API_URL` = `https://<api-url>.railway.app/api` (תעדכן אחרי שתקבל את ה-URL)

**⚠️ חשוב:** `NEXT_PUBLIC_*` variables חייבים להיות מוגדרים לפני Build!

---

### שלב 4: תיקון Worker Service (2 דקות)

#### 4.1 Build & Start Commands
**Dashboard → `@furniture/worker` → Settings → Build:**
- **Build Command:** הדבק:
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
  ```
- **Start Command:** הדבק:
  ```
  pnpm --filter @furniture/worker start
  ```
- **שמור**

#### 4.2 Environment Variables
**Dashboard → `@furniture/worker` → Variables:**
- **וודא שיש:**
  - `REDIS_URL` (אוטומטי מ-Redis)

---

### שלב 5: קבלת URLs

**Dashboard → Service → Settings → Networking:**
- **API Service:** לחץ "Generate Domain" → העתק את ה-URL
- **Web Service:** לחץ "Generate Domain" → העתק את ה-URL

---

### שלב 6: עדכון Variables עם URLs

**API Service → Variables:**
- עדכן: `FRONTEND_URL` = `https://<web-url>.railway.app`

**Web Service → Variables:**
- עדכן: `NEXT_PUBLIC_API_URL` = `https://<api-url>.railway.app/api`

---

### שלב 7: פריסה

**Dashboard → Service → Deployments → "Redeploy"**

**או דרך Terminal:**
```powershell
pnpm deploy:api
pnpm deploy:web
pnpm deploy:worker
```

---

### שלב 8: בדיקה

1. **בדוק Logs:**
   - Dashboard → Service → Logs
   - אין שגיאות ✅

2. **בדוק Health:**
   - פתח: `https://<api-url>/api/health`
   - אמור לראות: `{"status":"ok"}`

3. **בדוק Web:**
   - פתח: `https://<web-url>`
   - אמור לראות את האפליקציה

---

## ✅ סיימת!

אם יש בעיות → ראה `RAILWAY_DEPLOYMENT_ISSUES.md`

