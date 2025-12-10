# איך לבדוק Build Logs ב-Railway

## 🎯 מטרה
לזהות למה ה-build נכשל ב-Railway.

---

## 📍 שלב 1: פתיחת Logs

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **בחר את הפרויקט שלך**
3. **לחץ על `@furniture/web` Service**
4. **לחץ על "Deployments"** (משמאל)
5. **לחץ על ה-deployment שנכשל** (האחד עם "FAILED" באדום)
6. **לחץ "View logs"** או "Logs"

---

## 🔍 שלב 2: חיפוש השגיאה

**גלול למטה** עד שתמצא את השגיאה.

**חפש:**
- ❌ `ERR_PNPM_*` - בעיית dependencies
- ❌ `Cannot find module` - module חסר
- ❌ `Type error` - שגיאת TypeScript
- ❌ `Prisma Client` - Prisma לא generated
- ❌ `Environment variable` - variable חסר
- ❌ `Exit status 1` - build נכשל

---

## 📋 שלב 3: העתקת השגיאה

**העתק את השגיאה המלאה**, למשל:

```
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL @furniture/web@0.1.0 build: `next build`
Exit status 1
process "sh -c pnpm --filter @furniture/web build" did not complete successfully: exit code: 1
```

או:

```
Error: Cannot find module '@prisma/client'
```

---

## 🔧 שלב 4: פתרון לפי השגיאה

### אם השגיאה היא `Cannot find module '@prisma/client'`:

**פתרון:** Prisma לא generated

1. **Settings → Build Command:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
2. **Redeploy**

---

### אם השגיאה היא `Environment variable NEXT_PUBLIC_* is missing`:

**פתרון:** Variable חסר

1. **Variables → "+ New Variable"**
2. **Name:** `NEXT_PUBLIC_API_URL` (או מה שחסר)
3. **Value:** הערך הנכון
4. **שמור → Redeploy**

---

### אם השגיאה היא `Type error: ...`:

**פתרון:** שגיאת TypeScript

1. **העתק את השגיאה**
2. **תקן את הקוד מקומית**
3. **Commit ו-push:**
   ```powershell
   git add .
   git commit -m "Fix TypeScript error"
   git push
   ```

---

### אם השגיאה היא `ERR_PNPM_*`:

**פתרון:** בעיית dependencies

1. **וודא ש-`pnpm-lock.yaml` מעודכן:**
   ```powershell
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "Update lockfile"
   git push
   ```

---

## 💡 טיפים

1. **תמיד גלול למטה** - השגיאה המדויקת נמצאת בסוף ה-Logs
2. **העתק את כל השגיאה** - לא רק את השורה הראשונה
3. **חפש את המילה "Error"** - זה יעזור למצוא את השגיאה מהר יותר
4. **אם יש הרבה Logs** - השתמש ב-Ctrl+F (חיפוש) כדי למצוא "Error" או "Failed"

---

## 🆘 אם לא מצאת את השגיאה

1. **גלול עוד יותר למטה** - לפעמים השגיאה נמצאת בסוף מאוד
2. **חפש "Build"** - השגיאה יכולה להיות ליד המילה "Build"
3. **בדוק את ה-"Build > Build image" step** - שם תראה את השגיאה המדויקת
4. **נסה להריץ build מקומי** - אם זה עובד מקומי, זה כנראה environment variables

---

## 📝 דוגמה

**אם אתה רואה:**
```
> @furniture/web@0.1.0 build
> next build

Error: Cannot find module '@prisma/client'
```

**זה אומר:** Prisma Client לא נוצר. צריך להוסיף `pnpm --filter @furniture/prisma generate` ל-Build Command.

---

**ראה גם:** `FIX_WEB_BUILD_FAILURE.md` לפתרונות מפורטים יותר.

