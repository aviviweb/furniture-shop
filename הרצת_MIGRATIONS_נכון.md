# ✅ הרצת Migrations - הפתרון הנכון

## 🔴 הבעיה:

ניסית להריץ migrations מהמקומי, אבל `postgres.railway.internal` זה כתובת פנימית של Railway ולא נגישה מהמקומי.

---

## ✅ פתרון - 3 דרכים:

### דרך 1: Railway Dashboard - Shell (הכי קל!)

1. **Railway Dashboard → API Service**
2. **Deployments → לחץ על deployment אחרון → "View Logs"**
3. **או: Settings → לחץ על "Shell" / "Command"**
4. **הרץ:**
   ```bash
   pnpm --filter @furniture/prisma migrate deploy
   ```

**זה יריץ את ה-migration בתוך Railway, שם יש גישה ל-DB.**

---

### דרך 2: Pre-deploy Step (אוטומטי - מומלץ!)

**Railway Dashboard → API Service → Settings → Deploy:**

1. **Pre-deploy Command:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
2. **שמור**
3. **Redeploy** - ה-migrations ירוצו אוטומטית לפני כל deploy

**זה הכי טוב כי זה אוטומטי!**

---

### דרך 3: Railway CLI (אם יש בעיה עם Dashboard)

```powershell
# ודא שאתה בתוך Railway environment
railway run --service "@furniture/api" bash -c "cd /app && pnpm --filter @furniture/prisma migrate deploy"
```

**אבל זה יותר מסובך, עדיף דרך Dashboard.**

---

## 🎯 מה לעשות עכשיו:

### שלב 1: ודא שה-DB Service פעיל

**Railway Dashboard → PostgreSQL Service:**
- וודא שהוא **"Running"**
- אם לא - לחץ **"Start"**

---

### שלב 2: הרץ Migrations דרך Dashboard

**Railway Dashboard → API Service → Settings → לחץ "Shell" / "Command":**

```bash
pnpm --filter @furniture/prisma migrate deploy
```

**או דרך Deployments:**
1. **Deployments → בחר deployment → "..." → "Run Command"**
2. **הרץ:** `pnpm --filter @furniture/prisma migrate deploy`

---

### שלב 3: הוסף Pre-deploy Step (אופציונלי, אבל מומלץ!)

**Railway Dashboard → API Service → Settings → Deploy:**

1. **Pre-deploy Command:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
2. **שמור**
3. **Redeploy** - עכשיו ה-migrations ירוצו אוטומטית!

---

## ⚠️ הערות חשובות:

1. **אל תריץ `migrate dev`** - זה רק ל-development מקומי
2. **השתמש ב-`migrate deploy`** - זה ל-production
3. **אל תריץ migrations מהמקומי** - רק דרך Railway Dashboard או CLI בתוך Railway

---

## 💡 למה זה קורה:

- **Railway משתמש ב-internal networking** - `postgres.railway.internal` זה כתובת פנימית
- **המחשב המקומי לא יכול לגשת לזה** - רק services בתוך Railway יכולים
- **לכן צריך להריץ דרך Railway Dashboard** - שם יש גישה ל-DB

---

## ✅ Checklist:

- [ ] DB Service פעיל ב-Railway Dashboard
- [ ] הרצת migrations דרך Dashboard Shell/Command
- [ ] הוספת Pre-deploy step (אופציונלי)
- [ ] Redeploy את ה-API Service
- [ ] בדוק Logs - וודא שה-migrations רצו בהצלחה

---

**בואו ננסה דרך Dashboard - זה הכי פשוט!**

