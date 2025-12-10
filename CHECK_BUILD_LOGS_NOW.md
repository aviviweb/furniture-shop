# בדיקת Build Logs - הוראות מיידיות

## 🔴 הבעיה
כל ה-deployments החדשים נכשלים ב-"Build > Build image".

---

## 🔍 שלב 1: פתיחת Build Logs

**Railway Dashboard → `@furniture/web` → Deployments:**

1. **לחץ על ה-deployment שנכשל** (האחד עם "FAILED" - למשל "5 minutes ago")
2. **לחץ "View logs"** או "Logs"
3. **גלול למטה** - השגיאה נמצאת בסוף
4. **העתק את השגיאה המדויקת**

---

## 📋 מה לחפש ב-Logs

### שגיאות נפוצות:

1. **`Cannot find module '@prisma/client'`**
   - **פתרון:** Prisma לא generated
   - **תיקון:** וודא ש-Build Command כולל `pnpm --filter @furniture/prisma generate`

2. **`Cannot find module '@furniture/*'`**
   - **פתרון:** Workspace dependency לא נפתר
   - **תיקון:** וודא ש-Build Command מתחיל ב-`pnpm install --frozen-lockfile`

3. **`Type error: ...`**
   - **פתרון:** שגיאת TypeScript
   - **תיקון:** תיקן את הקוד מקומית, commit ו-push

4. **`Environment variable NEXT_PUBLIC_* is missing`**
   - **פתרון:** Variable חסר
   - **תיקון:** הוסף ב-Variables

5. **`ERR_PNPM_*`**
   - **פתרון:** בעיית dependencies
   - **תיקון:** וודא ש-`pnpm-lock.yaml` מעודכן

---

## ✅ שלב 2: תיקון מהיר

### 1. וודא Build Command נכון

**Dashboard → `@furniture/web` → Settings → Build:**

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**אם זה לא עובד, נסה:**
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

---

### 2. וודא כל ה-Variables מוגדרים

**Dashboard → `@furniture/web` → Variables:**

**וודא שיש:**
- ✅ `NEXT_PUBLIC_API_URL`
- ✅ `NEXT_PUBLIC_TENANT_ID`
- ✅ `NEXT_PUBLIC_BRAND_NAME`
- ✅ `NEXT_PUBLIC_DEMO_MODE`
- ✅ `NEXT_PUBLIC_PRIMARY_COLOR`
- ✅ `NODE_ENV`
- ✅ `PORT`

---

### 3. בדוק Build מקומי

```powershell
cd apps/web
pnpm build
```

**אם יש שגיאות מקומיות:**
- תיקן אותן
- Commit ו-push:
  ```powershell
  git add .
  git commit -m "Fix build errors"
  git push
  ```

---

## 🎯 סדר פעולות מומלץ

1. **בדוק Build Logs** - העתק את השגיאה המדויקת
2. **תקן לפי השגיאה** - ראה למעלה
3. **Redeploy** - Dashboard → Deployments → Redeploy

---

## 💡 למה יש deployment מוצלח מ-3 שבועות?

זה אומר שה-Build עבד בעבר. הבעיה כנראה:
- שינוי בקוד שגורם ל-Build להיכשל
- או שינוי ב-Variables/Build Command

**הפתרון:** בדוק את ה-Logs של ה-deployment שנכשל ותראה מה השתנה.

---

**התחל עם בדיקת ה-Logs - שם תראה את השגיאה המדויקת!**

