# פריסה מהירה ל-Railway - דרך Dashboard

הפקודות ב-CLI נעצרות בתפריט אינטראקטיבי, אז בואו נפרוס דרך Dashboard - זה יותר פשוט!

## 🚀 צעדים מהירים:

### 1. היכנס ל-Railway Dashboard
👉 [railway.app](https://railway.app) → בחר את הפרויקט `furniture-shop`

### 2. בדוק את ה-Services הקיימים
יש לך כבר:
- ✅ `@furniture/api` - API Service
- ✅ `@furniture/web` - Web Service  
- ✅ `@furniture/worker` - Worker Service
- ✅ `Postgres` - Database
- ✅ `Redis` - Cache

### 3. פרוס את ה-Services

#### API Service:
1. לחץ על **`@furniture/api`**
2. לחץ על **"Deploy"** או **"Redeploy"**
3. בחר branch: `main`
4. לחץ **"Deploy"**

#### Web Service:
1. לחץ על **`@furniture/web`**
2. לחץ על **"Deploy"** או **"Redeploy"**
3. בחר branch: `main`
4. לחץ **"Deploy"**

### 4. בדוק את ה-Build Commands

ודא שה-Build Commands מוגדרים נכון:

#### API Service → Settings → Build & Deploy:
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/api start
  ```
- **Port:** `4000`

#### Web Service → Settings → Build & Deploy:
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/web start
  ```
- **Port:** `3000`

### 5. בדוק את ה-Environment Variables

#### API Service → Variables:
```
DEMO_MODE=false
JWT_SECRET=<צור מפתח חזק>
PORT=4000
FRONTEND_URL=<תעדכן אחרי שתקבל web-url>
```

#### Web Service → Variables:
```
NEXT_PUBLIC_API_URL=<תעדכן אחרי שתקבל api-url>/api
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

### 6. קבל URLs

לאחר הפריסה:
1. כל service → **Settings** → **Networking**
2. לחץ **"Generate Domain"** (אם אין)
3. העתק את ה-URLs

### 7. עדכן Variables

1. **API Service:**
   - עדכן `FRONTEND_URL` עם ה-URL של Web service

2. **Web Service:**
   - עדכן `NEXT_PUBLIC_API_URL` עם ה-URL של API service + `/api`

3. **Redeploy** את ה-services

### 8. הרץ Migrations

1. **API Service** → **Deployments** → בחר deployment
2. לחץ **"Shell"** או **"Run Command"**
3. הרץ:
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```

## ✅ סיימת!

האפליקציה אמורה להיות פרוסה ועובדת!

## 🔍 בדיקת Logs

אם יש בעיות:
1. כל service → **Deployments** → בחר deployment → **Logs**
2. בדוק את ה-errors

## 💡 טיפים

- Railway יפרוס אוטומטית כל פעם שתדחוף קוד ל-GitHub
- בדוק את ה-Logs אם יש שגיאות build
- ודא שכל ה-Environment Variables מוגדרים

