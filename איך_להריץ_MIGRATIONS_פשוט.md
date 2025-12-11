# 🎯 איך להריץ Migrations - מדריך פשוט

## ❌ מה לא לעשות:

**אל תריץ מהטרמינל המקומי שלך!**

```powershell
# זה לא יעבוד! ❌
pnpm --filter @furniture/prisma migrate deploy
```

**למה?** כי אין לך DB מקומי, וה-DB של Railway לא נגיש מהמחשב שלך.

---

## ✅ מה לעשות - שלב אחר שלב:

### שלב 1: פתח Railway Dashboard

1. **פתח דפדפן**
2. **לך ל:** https://railway.app
3. **התחבר** לחשבון שלך
4. **בחר את הפרויקט** שלך

---

### שלב 2: מצא את ה-API Service

1. **בדף הפרויקט** - תראה רשימה של Services
2. **חפש:** `@furniture/api` או `api`
3. **לחץ עליו**

---

### שלב 3: פתח Shell/Command

**יש לך 2 אפשרויות:**

#### אופציה A: דרך Settings

1. **למעלה** - לחץ על **"Settings"**
2. **גלול למטה** - חפש **"Shell"** או **"Command"**
3. **לחץ על זה**

#### אופציה B: דרך Deployments

1. **למעלה** - לחץ על **"Deployments"**
2. **בחר deployment אחרון** (הכי למעלה)
3. **לחץ על "..." (3 נקודות)** → **"Run Command"** או **"Shell"**

---

### שלב 4: הרץ את הפקודה

**בתוך ה-Shell/Command שפתחת, הקלד:**

```bash
pnpm --filter @furniture/prisma migrate:deploy
```

**לחץ Enter**

---

### שלב 5: בדוק את התוצאה

**אם זה עבד, תראה משהו כמו:**
```
✅ Applied migration: 20240101000000_init
✅ Database is up to date
```

**אם יש שגיאה, העתק אותה ואתקן.**

---

## 🎯 דרך יותר קלה - Pre-deploy (אוטומטי!)

**אם אתה רוצה שה-migrations ירוצו אוטומטית לפני כל deploy:**

### שלב 1: פתח Settings

1. **Railway Dashboard → API Service**
2. **Settings → Deploy**

### שלב 2: הוסף Pre-deploy Command

1. **חפש:** "Pre-deploy Command" או "Pre-deploy Step"
2. **בתוך התיבה, הקלד:**
   ```
   pnpm --filter @furniture/prisma migrate:deploy
   ```
3. **לחץ "Save"**

### שלב 3: Redeploy

1. **Deployments → "Redeploy"**
2. **עכשיו ה-migrations ירוצו אוטומטית לפני כל deploy!**

---

## 💡 למה זה עובד?

- **Railway Dashboard** רץ **בתוך Railway**
- **שם יש גישה ל-DB** (`postgres.railway.internal`)
- **המחשב המקומי שלך** לא יכול לגשת לזה

---

## ❓ שאלות נפוצות:

### Q: איפה אני מוצא את ה-Shell?

**A:** 
- **Settings → Shell** (למטה)
- **או: Deployments → בחר deployment → "..." → "Run Command"**

### Q: מה אם אין לי Shell?

**A:** 
- נסה דרך **Deployments → "Run Command"**
- או הוסף **Pre-deploy Step** (זה יותר קל!)

### Q: מה ההבדל בין `migrate` ל-`migrate:deploy`?

**A:**
- `migrate` = `migrate dev` (רק ל-development מקומי)
- `migrate:deploy` = `migrate deploy` (ל-production ב-Railway)

---

## ✅ Checklist:

- [ ] פתחתי Railway Dashboard
- [ ] מצאתי את ה-API Service
- [ ] פתחתי Shell/Command
- [ ] הרצתי: `pnpm --filter @furniture/prisma migrate:deploy`
- [ ] בדקתי שהכל עבד
- [ ] (אופציונלי) הוספתי Pre-deploy Step

---

**זה הכל! אם יש בעיה, תגיד לי מה קרה.**

