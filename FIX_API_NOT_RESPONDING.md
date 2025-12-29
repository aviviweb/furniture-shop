# 🔧 תיקון: API לא מגיב (דף שחור)

## הבעיה
כשניגשים ל-`/api/health`, הדף שחור/ריק. זה אומר שה-API לא רץ או קורס.

---

## 🔍 בדיקה ראשונית

### שלב 1: בדוק את ה-Logs ב-Render

1. **Render Dashboard** → **furniture-api** → **"Logs"**
2. **חפש שגיאות:**
   - `❌ Migration failed`
   - `❌ DATABASE_URL is not set`
   - `❌ Failed to connect to database`
   - `Error:`
   - `Exception:`

### שלב 2: בדוק את ה-Status

1. **Render Dashboard** → **furniture-api**
2. **בדוק את ה-Status:**
   - **"Live"** (ירוק) = עובד ✅
   - **"Deploying"** = עדיין ב-build
   - **"Failed"** (אדום) = נכשל ❌
   - **"Stopped"** = לא רץ

---

## 🚨 בעיות נפוצות ופתרונות

### בעיה 1: DATABASE_URL לא מוגדר

**סימנים:**
- Logs מראים: `❌ DATABASE_URL is not set!`
- API לא מתחיל

**פתרון:**
1. **Render Dashboard** → **furniture-api** → **"Environment"**
2. **וודא שיש:** `DATABASE_URL`
3. **אם אין:**
   - **לחץ על "Link Database"** → **בחר:** `furniture-db`
   - **או הוסף ידנית:**
     - **Key:** `DATABASE_URL`
     - **Value:** `postgresql://...` (מה-Render Dashboard → furniture-db → "Connection String")

### בעיה 2: Migrations נכשלים

**סימנים:**
- Logs מראים: `❌ Migration failed`
- API לא מתחיל

**פתרון:**
1. **Render Dashboard** → **furniture-api** → **"Logs"**
2. **קרא את השגיאה המדויקת**
3. **אם זה:** `P1001: Can't reach database server`
   - **וודא ש-DATABASE_URL נכון**
   - **וודא שה-Database Service פעיל**
4. **אם זה:** `Migration XXXX not found`
   - **זה בסדר** - Migrations כבר רצו
   - **ה-API אמור להתחיל למרות זאת**

### בעיה 3: API קורס אחרי Startup

**סימנים:**
- Logs מראים: `✅ API running on port 4000`
- אבל אחר כך: `Error:` או `Exception:`

**פתרון:**
1. **קרא את השגיאה המדויקת ב-Logs**
2. **אם זה:** `PrismaClientConstructorValidationError`
   - **וודא ש-DATABASE_URL נכון**
3. **אם זה:** `Cannot find module`
   - **Clear build cache** → **Redeploy**

### בעיה 4: Build נכשל

**סימנים:**
- Status = **"Failed"**
- Logs מראים שגיאות build

**פתרון:**
1. **קרא את השגיאה ב-Logs**
2. **אם זה:** `pnpm: not found`
   - **ה-build command צריך:** `corepack enable && corepack prepare pnpm@9.0.0 --activate`
3. **אם זה:** `Module not found`
   - **Clear build cache** → **Redeploy**

---

## ✅ פתרון מהיר

### אופציה 1: Clear Cache & Redeploy

1. **Render Dashboard** → **furniture-api** → **"Settings"**
2. **Scroll down** → **"Clear build cache"**
3. **"Manual Deploy"** → **"Deploy latest commit"**

### אופציה 2: בדוק Environment Variables

**וודא שיש:**
- ✅ `DEMO_MODE` = `false`
- ✅ `DATABASE_URL` = (connection string מה-DB)
- ✅ `REDIS_URL` = (connection string מה-Redis)
- ✅ `JWT_SECRET` = (ערך כלשהו)
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `4000`

### אופציה 3: בדוק את ה-Database

1. **Render Dashboard** → **furniture-db**
2. **וודא שהוא "Live"** (ירוק)
3. **אם לא:**
   - **לחץ "Start"**

---

## 🔍 בדיקה מפורטת

### שלב 1: בדוק את ה-Logs המלאים

1. **Render Dashboard** → **furniture-api** → **"Logs"**
2. **Scroll למעלה** - לראות את כל ה-Logs מההתחלה
3. **חפש:**
   - `🔄 Running database migrations...`
   - `✅ Database migrations completed successfully`
   - `✅ API running on port 4000`
   - `✅ Database connected successfully`

### שלב 2: בדוק את ה-URL

**נסה:**
- `https://furniture-api-xxx.onrender.com/api` (ללא /health)
- **אמור לראות:** `API מוכן`

**אם גם זה לא עובד:**
- ה-API לא רץ בכלל
- בדוק את ה-Logs

### שלב 3: בדוק את ה-Health Endpoint דרך curl

**פתח Terminal:**
```bash
curl https://furniture-api-xxx.onrender.com/api/health
```

**אמור לראות:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "demoMode": false,
  "services": {
    "api": "ok",
    "database": "ok"
  }
}
```

**אם אתה רואה שגיאה:**
- העתק את השגיאה המדויקת

---

## 📋 Checklist

- [ ] Database Service פעיל (Live)
- [ ] `DATABASE_URL` מוגדר ב-API
- [ ] `REDIS_URL` מוגדר ב-API
- [ ] `DEMO_MODE=false` ב-API
- [ ] `JWT_SECRET` מוגדר
- [ ] API Service Status = "Live"
- [ ] Logs מראים: `✅ API running on port 4000`
- [ ] אין שגיאות ב-Logs
- [ ] `/api` מחזיר: `API מוכן`
- [ ] `/api/health` מחזיר JSON

---

## 🎯 מה לעשות עכשיו

1. **לך ל-Render Dashboard** → **furniture-api** → **"Logs"**
2. **העתק את השגיאה המדויקת** (אם יש)
3. **הודע לי מה אתה רואה** - ואני אעזור לתקן

**או:**

1. **בדוק את ה-Status** של furniture-api
2. **אם זה "Failed" או "Stopped"** → **לחץ "Manual Deploy"**
3. **חכה ל-Deploy** → **בדוק שוב**

---

**התחל עם בדיקת ה-Logs - זה יגיד לנו בדיוק מה הבעיה!** 🔍

