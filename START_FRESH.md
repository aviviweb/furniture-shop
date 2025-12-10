# התחלה מחדש - Railway Setup

## 🚀 התחלה מהירה

### שלב 1: התחברות ל-Railway

```powershell
railway login
```

**לחץ Y כשיתבקש לפתוח דפדפן**

---

### שלב 2: קישור Project

```powershell
railway link
```

**בחר את הפרויקט שלך מהרשימה**

---

### שלב 3: הרצת סקריפט אוטומטי

```powershell
pnpm railway:fix
```

**זה יגדיר את כל ה-Variables ויריץ Migrations**

---

### שלב 4: הגדרות ידניות ב-Dashboard

**Railway Dashboard → `@furniture/web` → Variables:**
- הוסף: `NEXT_PUBLIC_API_URL=https://<api-url>.railway.app/api`

**Railway Dashboard → `@furniture/api` → Settings → Deploy → Pre-deploy step:**
- הוסף: `pnpm --filter @furniture/prisma migrate deploy`

**Railway Dashboard → `@furniture/api` → Variables:**
- הוסף: `JWT_SECRET=<create-secret>`
- הוסף: `FRONTEND_URL=https://<web-url>.railway.app`

---

### שלב 5: פריסה

```powershell
pnpm deploy:api
pnpm deploy:web
```

---

## ✅ סיימת!

אם יש בעיות → ראה `FIX_RAILWAY_CONNECTION.md`

