# 🔧 תיקון: API Service לא רץ

## הבעיה:
ה-API service מחזיר 404 גם על `/api/health`, מה שאומר שה-service לא רץ בכלל.

## מה לבדוק:

### שלב 1: בדוק אם ה-API Service קיים

1. **Render Dashboard** → **"Resources"** (בתפריט השמאלי)
2. **חפש `furniture-api`**
3. **אם לא קיים:**
   - ה-Blueprint לא יצר את ה-service
   - צריך ליצור אותו ידנית

### שלב 2: אם ה-Service לא קיים - צור אותו ידנית

1. **Render Dashboard** → **"New"** → **"Web Service"**
2. **חבר ל-GitHub Repository:**
   - בחר את ה-repo `aviviweb/furniture-shop`
   - בחר branch: `main`
3. **הגדר את ה-Service:**
   - **Name:** `furniture-api`
   - **Region:** `Oregon` (או קרוב אליך)
   - **Plan:** `Free`
4. **Build & Deploy:**
   - **Build Command:**
     ```
     corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
     ```
   - **Start Command:**
     ```
     pnpm --filter @furniture/api start
     ```
5. **Environment Variables:**
   - `DEMO_MODE=false`
   - `JWT_SECRET=<צור מפתח חזק>`
   - `PORT=4000`
   - `NODE_ENV=production`
   - `DATABASE_URL=<מה-database שלך>`
   - `REDIS_URL=<מה-redis שלך>` (אופציונלי)

### שלב 3: אם ה-Service קיים אבל לא רץ

1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש שגיאות:**
   - ❌ `Error: ...` - יש בעיה
   - ❌ `Build failed` - יש בעיה ב-build
   - ❌ `Deploy failed` - יש בעיה ב-deployment

### שלב 4: Manual Deploy

1. **Render Dashboard** → **`furniture-api`** → **"Manual Deploy"**
2. **לחץ על "Deploy latest commit"**
3. **חכה 2-3 דקות**

### שלב 5: בדוק את ה-Logs אחרי Deployment

1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש:**
   - ✅ `✅ API running on port 4000` - ה-API רץ!
   - ✅ `✅ CORS enabled for origins: ...` - CORS מוגדר
   - ❌ `Error: ...` - יש בעיה

---

## 🆘 אם עדיין לא עובד:

### בדוק את ה-Build Logs

1. **Render Dashboard** → **`furniture-api`** → **"Events"**
2. **לחץ על ה-deployment האחרון**
3. **חפש שגיאות:**
   - ❌ `Error: Cannot find module` - יש בעיה עם dependencies
   - ❌ `Error: Command failed` - יש בעיה עם build command
   - ❌ `Error: Port already in use` - יש בעיה עם port

### בדוק את ה-Environment Variables

1. **Render Dashboard** → **`furniture-api`** → **"Environment"**
2. **וודא שיש:**
   - `DEMO_MODE=false` (או `true` אם רוצה דמו)
   - `JWT_SECRET` - חובה!
   - `PORT=4000`
   - `DATABASE_URL` - אם לא במצב דמו

---

## 📝 מה לשלוח לי:

אם עדיין לא עובד, שלח לי:
1. **האם `furniture-api` קיים ב-Resources?** (כן/לא)
2. **מה ה-Status שלו?** (Live / Build failed / Deploy failed / לא קיים)
3. **מה אתה רואה ב-Logs?** (העתק את השגיאה המדויקת)
4. **מה אתה רואה ב-Build Logs?** (העתק את השגיאה המדויקת)

---

## 🔍 איך לבדוק אם זה עובד:

אחרי שה-service רץ:
1. **פתח:** `https://furniture-api-xxxx.onrender.com/api/health`
2. **אמור לראות:** JSON עם `status: 'ok'`
3. **אם רואה 404:** ה-service עדיין לא רץ

---

**הבעיה היא כנראה שה-API service לא נוצר או לא deployed!** 🔍

