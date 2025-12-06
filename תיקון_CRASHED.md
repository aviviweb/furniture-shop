# 🚨 Service CRASHED - איך לתקן

## מה קרה?
ה-API Service שלך במצב **CRASHED** - זה אומר שהוא לא מצליח להתחיל.

---

## שלב 1: בדיקת Logs (חשוב!)

**זה הכי חשוב - צריך לראות מה השגיאה:**

1. **ב-Railway Dashboard** → **API Service** (`@furniture/api`)
2. **לחץ על "Logs"** (בתפריט משמאל)
3. **גלול למטה** - שם תראה את השגיאה

**מה לחפש:**
- שגיאות באדום
- הודעות כמו "Error:", "Failed:", "Cannot find"
- הודעות על משתנים חסרים

---

## שלב 2: תיקון לפי השגיאה

### אם השגיאה היא על משתנה חסר:

**לך ל-Variables** והוסף את המשתנים החסרים:

**חובה:**
```
DEMO_MODE=false
JWT_SECRET=<צור מפתח - ראה למטה>
PORT=4000
FRONTEND_URL=https://furnitureweb-production.up.railway.app
```

**יצירת JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### אם השגיאה היא על Database:

**וודא שיש לך PostgreSQL Service** בפרויקט:
- אם אין → **"New"** → **"Database"** → **"PostgreSQL"**
- `DATABASE_URL` יתווסף אוטומטית

### אם השגיאה היא על Build:

**וודא שה-Build Command נכון:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

### אם השגיאה היא על Prisma:

**הרץ Migrations:**
1. **API Service** → **Deployments** → **"Run Command"**
2. הרץ:
```
pnpm --filter @furniture/prisma migrate deploy
```

---

## שלב 3: Restart

**אחרי התיקון:**

1. **לחץ על כפתור "Restart"** (אדום, למעלה מימין)
2. **או:** **Deployments** → **"Redeploy"** → בחר `main` → **"Deploy"**
3. **חכה 2-3 דקות**
4. **בדוק שוב את ה-Logs** - אמור לעבוד עכשיו!

---

## 🔍 שגיאות נפוצות:

### "Cannot find module '@prisma/client'"
**פתרון:** ה-Build Command לא כולל `prisma generate`
→ תקן את ה-Build Command (ראה `תיקון_עכשיו.md`)

### "JWT_SECRET is required"
**פתרון:** הוסף `JWT_SECRET` ב-Variables

### "Cannot connect to database"
**פתרון:** 
- וודא שיש PostgreSQL Service
- או הגדר `DEMO_MODE=true` (אבל זה לא production)

### "Port already in use"
**פתרון:** הגדר `PORT=4000` ב-Variables

---

## 📋 Checklist מהיר:

- [ ] בדקתי את ה-Logs
- [ ] תיקנתי את השגיאה (לפי מה שראיתי ב-Logs)
- [ ] וידאתי שה-Build Command נכון
- [ ] הוספתי את כל ה-Variables הנדרשים
- [ ] לחצתי Restart/Redeploy
- [ ] בדקתי שוב את ה-Logs - עכשיו זה עובד?

---

## 🆘 עדיין לא עובד?

**שלח לי:**
1. מה כתוב ב-Logs (העתק את השגיאה)
2. מה ה-Build Command שלך
3. מה ה-Variables שלך (ללא סיסמאות)

---

**התחל עם בדיקת ה-Logs!** 🔍

