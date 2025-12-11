# 🔧 תיקון Migrate Script

## 🔴 הבעיה:

ניסית להריץ:
```powershell
pnpm --filter @furniture/prisma migrate deploy
```

אבל הסקריפט `migrate` ב-`package.json` משתמש ב-`prisma migrate dev` במקום `prisma migrate deploy`.

**גם:** אתה מנסה להריץ מהמקומי, אבל אין DB מקומי (`localhost:5432`).

---

## ✅ פתרון:

### אופציה 1: השתמש ב-`migrate:deploy` (מקומי - רק לבדיקה)

```powershell
pnpm --filter @furniture/prisma migrate:deploy
```

**אבל זה עדיין לא יעבוד מהמקומי** כי אין DB מקומי!

---

### אופציה 2: Railway Dashboard - Shell (הכי נכון!)

**Railway Dashboard → API Service → Settings → Shell:**

```bash
pnpm --filter @furniture/prisma migrate:deploy
```

**או:**
```bash
pnpm --filter @furniture/prisma migrate:prod
```

**זה יריץ את ה-migration בתוך Railway, שם יש גישה ל-DB.**

---

### אופציה 3: Pre-deploy Step (אוטומטי - מומלץ!)

**Railway Dashboard → API Service → Settings → Deploy:**

1. **Pre-deploy Command:**
   ```
   pnpm --filter @furniture/prisma migrate:deploy
   ```
2. **שמור**
3. **Redeploy** - ה-migrations ירוצו אוטומטית!

---

## ⚠️ חשוב:

1. **אל תריץ migrations מהמקומי** - אין DB מקומי
2. **השתמש ב-`migrate:deploy` או `migrate:prod`** - לא `migrate` (זה `migrate dev`)
3. **הרץ דרך Railway Dashboard** - שם יש גישה ל-DB

---

## 🎯 מה לעשות עכשיו:

1. **Railway Dashboard → API Service → Settings → Shell**
2. **הרץ:**
   ```bash
   pnpm --filter @furniture/prisma migrate:deploy
   ```
3. **או הוסף Pre-deploy step** (מומלץ!)

---

**תיקנתי את הסקריפט - עכשיו יש `migrate:deploy` ו-`migrate:prod` שניהם משתמשים ב-`migrate deploy`.**

