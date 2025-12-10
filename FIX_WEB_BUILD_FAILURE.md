# תיקון Web Build Failure ב-Railway

## 🔴 הבעיה
```
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL @furniture/web@0.1.0 build: `next build`
Exit status 1
```

ה-build נכשל ב-Railway למרות שעובד מקומי.

---

## ✅ פתרון שלב אחר שלב

### שלב 1: בדיקת Build Logs המלאים

**Railway Dashboard → `@furniture/web` → Deployments → בחר deployment שנכשל → "View logs"**

**חפש:**
- `Cannot find module` - module חסר
- `Type error` - שגיאת TypeScript
- `Prisma Client` - Prisma לא generated
- `Environment variable` - variable חסר

**העתק את השגיאה המדויקת** - זה יעזור לזהות את הבעיה.

---

### שלב 2: וידוא Build Command

**Railway Dashboard → `@furniture/web` → Settings → Build:**

**Build Command צריך להיות:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**אם זה לא עובד, נסה:**
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

---

### שלב 3: וידוא Environment Variables (חשוב מאוד!)

**Railway Dashboard → `@furniture/web` → Variables:**

**חייבים להיות מוגדרים (גם ב-build time!):**

```
NEXT_PUBLIC_API_URL=https://<api-service-url>.railway.app/api
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

**⚠️ חשוב:** `NEXT_PUBLIC_*` variables **חייבים** להיות מוגדרים לפני ה-build!

---

### שלב 4: וידוא Prisma Generate

**הבעיה:** Prisma Client לא נוצר ב-build time.

**פתרון:**

1. **וודא ש-Build Command כולל:**
   ```
   pnpm --filter @furniture/prisma generate
   ```

2. **אם עדיין לא עובד, נסה Pre-deploy step:**
   - **Settings → Deploy → Pre-deploy step**
   - **הוסף:**
     ```
     pnpm --filter @furniture/prisma generate
     ```

---

### שלב 5: בדיקת TypeScript Errors

**אם יש TypeScript errors ב-Railway:**

1. **הרץ מקומי עם strict mode:**
   ```powershell
   cd apps/web
   $env:NODE_ENV = "production"
   pnpm build
   ```

2. **אם יש errors, תיקן אותם**

3. **Commit ו-push:**
   ```powershell
   git add .
   git commit -m "Fix TypeScript errors"
   git push
   ```

---

### שלב 6: בדיקת Dependencies

**אם יש `Cannot find module` errors:**

1. **וודא ש-`package.json` נכון:**
   ```json
   {
     "dependencies": {
       "@furniture/shared": "workspace:*",
       "@furniture/ui": "workspace:*",
       "next": "14.2.4",
       "react": "18.3.1",
       "react-dom": "18.3.1"
     }
   }
   ```

2. **וודא ש-`pnpm-lock.yaml` מעודכן:**
   ```powershell
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "Update lockfile"
   git push
   ```

---

### שלב 7: פתרון חלופי - Build עם NODE_ENV

**אם כלום לא עובד, נסה:**

**Build Command:**
```
NODE_ENV=production pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**או:**
```
export NODE_ENV=production && pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

---

## 🔍 אבחון לפי שגיאות

### שגיאה: `Cannot find module '@prisma/client'`
**פתרון:** וודא ש-`pnpm --filter @furniture/prisma generate` רץ לפני ה-build.

### שגיאה: `Environment variable NEXT_PUBLIC_* is missing`
**פתרון:** הוסף את ה-variable ב-Railway Dashboard → Variables.

### שגיאה: `Type error: ...`
**פתרון:** תיקן את ה-TypeScript error בקוד.

### שגיאה: `ERR_PNPM_*`
**פתרון:** 
1. וודא ש-`pnpm-lock.yaml` מעודכן
2. נסה: `pnpm install --frozen-lockfile`

---

## 📋 Checklist

לפני Redeploy:

- [ ] **Build Command נכון** (כולל Prisma generate)
- [ ] **כל ה-NEXT_PUBLIC_* variables מוגדרים**
- [ ] **NODE_ENV=production מוגדר**
- [ ] **PORT=3000 מוגדר**
- [ ] **pnpm-lock.yaml מעודכן** (commit ו-push)
- [ ] **אין TypeScript errors מקומיים**

אחרי Redeploy:

- [ ] **בדוק Build Logs** - אין errors
- [ ] **Service Online** ✅
- [ ] **Web app נטען** - `https://<web-url>`

---

## 🚀 אחרי תיקון

1. **שמור את כל השינויים ב-Railway Dashboard**
2. **Redeploy:**
   - **Deployments → Redeploy**
   - **בחר branch → Deploy**
3. **חכה 3-5 דקות**
4. **בדוק Logs** - ודא שה-build הצליח

---

## 💡 טיפים

1. **תמיד בדוק את ה-Logs המלאים** - שם תראה את השגיאה המדויקת
2. **NEXT_PUBLIC_* variables חייבים להיות מוגדרים לפני build**
3. **Prisma generate חייב לרוץ לפני build**
4. **אם build עובד מקומי אבל לא ב-Railway** - זה כנראה environment variables או Prisma

---

## 🆘 אם עדיין לא עובד

1. **העתק את השגיאה המדויקת מה-Logs**
2. **בדוק את `RAILWAY_DEPLOYMENT_ISSUES.md`**
3. **נסה Build Command חלופי** (ראה שלב 7)

