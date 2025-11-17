# צעדים מהירים לפריסה דרך Dashboard

## 🚀 התחלה מהירה

### 1. התחבר ל-Railway
👉 [railway.app](https://railway.app) → Login

### 2. צור פרויקט חדש
👉 "New Project" → "Deploy from GitHub repo" (או "Empty Project")

### 3. הוסף Services

#### API Service:
- "New" → "GitHub Repo" → שם: `api`
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/api start
  ```
- **Port:** `4000`

#### Web Service:
- "New" → "GitHub Repo" → שם: `web`
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/web start
  ```
- **Port:** `3000`

### 4. הוסף Database
- "New" → "Database" → "PostgreSQL"
- "New" → "Database" → "Redis"

### 5. הגדר Variables

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

### 6. פרוס
- עבור לכל service → "Deploy"
- בחר branch → "Deploy"

### 7. קבל URLs
- כל service → Settings → Networking → "Generate Domain"
- העתק את ה-URLs

### 8. עדכן Variables
- עדכן `FRONTEND_URL` ב-API service
- עדכן `NEXT_PUBLIC_API_URL` ב-Web service
- Redeploy את ה-services

✅ **סיימת!** האפליקציה אמורה לעבוד.

