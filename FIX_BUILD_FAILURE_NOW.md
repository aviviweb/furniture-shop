# תיקון Build Failure - הוראות מיידיות

## 🔴 הבעיה
**"Build > Build image" נכשל** - כל ה-deployments נכשלים.

---

## 🔍 שלב 1: בדיקת Build Logs

**Railway Dashboard → `@furniture/web` → Deployments:**

1. **לחץ על ה-deployment שנכשל** (האחד עם "FAILED")
2. **לחץ "View logs"** או "Logs"
3. **גלול למטה** - חפש את השגיאה המדויקת
4. **העתק את השגיאה** - זה יעזור לזהות את הבעיה

**שגיאות נפוצות:**
- `Cannot find module '@prisma/client'` → Prisma לא generated
- `Cannot find module '@furniture/*'` → Workspace dependency לא נפתר
- `Type error: ...` → שגיאת TypeScript
- `Environment variable NEXT_PUBLIC_* is missing` → Variable חסר

---

## ✅ שלב 2: תיקון לפי השגיאה

### אם השגיאה: `Cannot find module '@prisma/client'`

**פתרון:**
1. **Dashboard → `@furniture/web` → Settings → Build:**
2. **וודא שהפקודה היא:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
3. **שמור → Redeploy**

---

### אם השגיאה: `Environment variable NEXT_PUBLIC_* is missing`

**פתרון:**
1. **Dashboard → `@furniture/web` → Variables:**
2. **הוסף את כל ה-Variables:**
   - `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
   - `NEXT_PUBLIC_BRAND_NAME` = `Furniture Shop`
   - `NEXT_PUBLIC_PRIMARY_COLOR` = `#0ea5e9`
   - `NEXT_PUBLIC_DEMO_MODE` = `false`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `NEXT_PUBLIC_API_URL` = `https://<api-url>.railway.app/api` (אם יש)
3. **שמור → Redeploy**

---

### אם השגיאה: `Type error` או `ERR_PNPM_*`

**פתרון:**
1. **בדוק build מקומי:**
   ```powershell
   cd apps/web
   pnpm build
   ```
2. **אם יש שגיאות מקומיות** - תיקן אותן
3. **Commit ו-push:**
   ```powershell
   git add .
   git commit -m "Fix build errors"
   git push
   ```
4. **Redeploy ב-Railway**

---

## 🎯 פתרון מהיר - נסה הכל

### 1. וודא Build Command נכון

**Dashboard → `@furniture/web` → Settings → Build:**

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**שמור**

---

### 2. וודא כל ה-Variables מוגדרים

**Dashboard → `@furniture/web` → Variables:**

**חובה:**
- `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
- `NEXT_PUBLIC_BRAND_NAME` = `Furniture Shop`
- `NEXT_PUBLIC_PRIMARY_COLOR` = `#0ea5e9`
- `NEXT_PUBLIC_DEMO_MODE` = `false`
- `NODE_ENV` = `production`
- `PORT` = `3000`

**אופציונלי (אם יש API URL):**
- `NEXT_PUBLIC_API_URL` = `https://<api-url>.railway.app/api`

---

### 3. Redeploy

**Dashboard → `@furniture/web` → Deployments → "Redeploy"**

**או:**
```powershell
pnpm deploy:web
```

---

## 🔍 אם עדיין נכשל

1. **העתק את השגיאה המדויקת מה-Logs**
2. **בדוק `FIX_WEB_BUILD_FAILURE.md`** לפתרונות נוספים
3. **בדוק `CHECK_BUILD_LOGS.md`** איך לבדוק Logs

---

## 💡 טיפים

1. **תמיד בדוק את ה-Logs המלאים** - השגיאה המדויקת נמצאת שם
2. **NEXT_PUBLIC_* variables חייבים להיות לפני Build**
3. **Prisma generate חייב לרוץ לפני Build**
4. **אם build עובד מקומי אבל לא ב-Railway** - זה כנראה Variables או Prisma

---

**התחל עם בדיקת ה-Logs - שם תראה את השגיאה המדויקת!**

