# 🚨 תיקון סופי - Railway Build Errors

## 🔴 הבעיות:

1. **Web Build Failed** - Railway מריץ `pnpm run build` מהשורש במקום Build Command
2. **API Crashed** - צריך לבדוק את ה-Logs
3. **Worker Failed** - צריך REDIS_URL ו-DATABASE_URL

---

## ✅ תיקון מיידי - שלב אחר שלב:

### שלב 1: תיקון Web Service Build Command

**הבעיה:** Railway מריץ `pnpm run build` מהשורש במקום את ה-Build Command הנכון.

**הפתרון:**

1. **Dashboard** → **`@furniture/web`** → **Settings** → **Build**
2. **Custom Build Command** → **הדבק בדיוק:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
3. **שמור** (אם יש כפתור Save)
4. **אם זה לא נשמר:**
   - נסה דרך **Settings → Deploy → Build Command**
   - או דרך **Settings → Deploy → Pre-deploy step** (פרק את הפקודה)

---

### שלב 2: תיקון API Service Build Command

1. **Dashboard** → **`@furniture/api`** → **Settings** → **Build**
2. **Custom Build Command** → **הדבק בדיוק:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
   ```
3. **שמור**

---

### שלב 3: תיקון Start Commands

#### API Service:
1. **`@furniture/api`** → **Settings** → **Deploy**
2. **Custom Start Command:**
   ```
   pnpm --filter @furniture/api start
   ```
3. **שמור**

#### Web Service:
1. **`@furniture/web`** → **Settings** → **Deploy**
2. **Custom Start Command:**
   ```
   pnpm --filter @furniture/web start
   ```
3. **שמור**

---

### שלב 4: בדוק למה API Crashed

1. **`@furniture/api`** → **Logs** (או **Deployments** → בחר deployment → **View Logs**)
2. **גלול למטה** → **העתק את השגיאה המדויקת**
3. **השגיאות הנפוצות:**
   - `Can't reach database server` → צריך `DATABASE_URL`
   - `Port already in use` → צריך `PORT=4000`
   - `JWT_SECRET is required` → צריך `JWT_SECRET`

---

### שלב 5: בדוק Environment Variables

#### API Service → Variables:
```
DEMO_MODE=false
JWT_SECRET=<צור מפתח חזק - למשל: openssl rand -hex 32>
PORT=4000
DATABASE_URL=<אמור להיות אוטומטי מ-PostgreSQL>
REDIS_URL=<אמור להיות אוטומטי מ-Redis>
FRONTEND_URL=<תעדכן אחרי שתקבל web-url>
```

#### Web Service → Variables:
```
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=<תעדכן אחרי שתקבל api-url>/api
```

---

### שלב 6: הרץ Migrations

1. **`@furniture/api`** → **Deployments**
2. **לחץ על "..."** (3 נקודות) → **"Run Command"** או **"Shell"**
3. **הרץ:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
4. **חכה שזה מסתיים**

---

### שלב 7: תיקון Worker Service

1. **`@furniture/worker`** → **Variables** → **הוסף:**
   - **`REDIS_URL`** = `redis://...` (מ-Redis Service → Settings → Connection)
   - **`DATABASE_URL`** = `postgresql://...` (אותו URL כמו ב-API)
2. **Settings** → **Build** → **Custom Build Command:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
   ```
3. **Settings** → **Deploy** → **Start Command:**
   ```
   pnpm --filter @furniture/worker start
   ```
4. **Redeploy** → **בדוק Logs** → צריך לראות: `Worker up with queues: ocr, ai-reports, notifications`

---

### שלב 8: Redeploy הכל

1. **לכל service** → **Deployments** → **"Redeploy"**
2. **חכה שכל ה-builds מסתיימים**
3. **בדוק את ה-Logs** → וודא שאין שגיאות

---

## 🎯 סדר עדיפויות:

1. **תיקון Build Commands** (Web + API) - הכי חשוב!
2. **בדיקת API Logs** - למה Crashed?
3. **תיקון Environment Variables** - אם חסרים
4. **הרצת Migrations** - אם Database לא מוכן
5. **Redeploy** - אחרי כל התיקונים

---

## 💡 טיפים:

- **אם Build Command לא נשמר:**
  - נסה דרך **Settings → Deploy** במקום **Settings → Build**
  - או פרק את הפקודה ל-**Pre-deploy step** + **Build Command**

- **אם Railway עדיין מריץ `pnpm run build`:**
  - זה אומר שה-Build Command לא מוגדר ב-Dashboard
  - צריך להגדיר אותו ידנית (לא רק ב-`railway.toml`)

---

## ✅ Checklist:

- [ ] Web Build Command מוגדר
- [ ] API Build Command מוגדר
- [ ] Worker Build Command מוגדר
- [ ] Web Start Command מוגדר
- [ ] API Start Command מוגדר
- [ ] Worker Start Command מוגדר
- [ ] Environment Variables מוגדרים (כולל REDIS_URL ל-Worker)
- [ ] Migrations רצו
- [ ] Redeploy בוצע

---

**בואו נתחיל עם תיקון Build Commands - זה הכי קריטי!**

