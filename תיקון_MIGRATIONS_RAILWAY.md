# 🔧 תיקון Migrations - Railway

## 🔴 הבעיה:

ניסית להריץ migrations מהמחשב המקומי:
```powershell
pnpm --filter @furniture/prisma migrate dev "deploy"
```

**זה לא יעבוד!** כי:
- `postgres.railway.internal:5432` זה כתובת פנימית של Railway
- היא לא נגישה מהמחשב המקומי שלך
- צריך להריץ migrations **דרך Railway**, לא מהמקומי

---

## ✅ פתרון נכון:

### אופציה 1: דרך Railway CLI (מומלץ)

```powershell
railway run --service "@furniture/api" pnpm --filter @furniture/prisma migrate deploy
```

**זה יריץ את ה-migration בתוך Railway, שם יש גישה ל-DB.**

---

### אופציה 2: דרך Railway Dashboard

1. **Dashboard → API Service → Deployments**
2. **לחץ על "..." (3 נקודות) → "Run Command"** או **"Shell"**
3. **הרץ:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```

---

### אופציה 3: דרך Pre-deploy Step (אוטומטי)

**Railway Dashboard → API Service → Settings → Deploy:**

1. **Pre-deploy Command:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
2. **שמור**
3. **Redeploy** - ה-migrations ירוצו אוטומטית לפני כל deploy

---

## ⚠️ הערות חשובות:

1. **אל תשתמש ב-`migrate dev`** - זה רק ל-development מקומי
2. **השתמש ב-`migrate deploy`** - זה ל-production
3. **אל תריץ migrations מהמקומי** - רק דרך Railway

---

## 🎯 סדר פעולות מומלץ:

1. **ודא שה-DB Service פעיל** ב-Railway Dashboard
2. **הרץ migrations דרך Railway CLI:**
   ```powershell
   railway run --service "@furniture/api" pnpm --filter @furniture/prisma migrate deploy
   ```
3. **אם זה עובד** - הוסף Pre-deploy step כדי שירוץ אוטומטית
4. **Redeploy** את ה-API Service

---

## 💡 למה זה קורה:

- **Railway משתמש ב-internal networking** - `postgres.railway.internal` זה כתובת פנימית
- **המחשב המקומי לא יכול לגשת לזה** - רק services בתוך Railway יכולים
- **לכן צריך להריץ דרך Railway** - CLI או Dashboard

---

**בואו ננסה את זה עכשיו!**

