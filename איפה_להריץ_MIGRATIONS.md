# 🗄️ איפה להריץ Migrations?

## ⚠️ חשוב!

**Migrations לא רצים ב-PostgreSQL Service!**

**Migrations רצים ב-API Service!**

---

## ✅ איפה להריץ Migrations:

### דרך 1: Railway Dashboard (הקלה ביותר)

1. **API Service** (`@furniture/api`) → **"Deployments"** (בתפריט משמאל)
2. **למעלה מימין** → **לחץ "Run Command"** (או "Shell")
3. **ייפתח חלון** → **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
4. **Enter** → חכה לסיום

**💡 לא מוצא?** → ראה `איפה_להריץ_MIGRATIONS_בRAILWAY.md` (מדריך מפורט עם תמונות)

---

### דרך 2: דרך CLI

```powershell
pnpm railway:migrate
```

---

## ❌ מה לא לעשות:

**אל תשים את הפקודה הזו ב-PostgreSQL Service Start Command!**

PostgreSQL הוא Database Service - הוא לא צריך Start Command.

---

## ✅ מה צריך להיות ב-PostgreSQL Service:

**שום דבר!** PostgreSQL עובד אוטומטית.

**רק וודא:**
- ✅ PostgreSQL Service במצב "Active" (ירוק)
- ✅ יש `DATABASE_URL` ב-Variables

---

## ✅ מה צריך להיות ב-API Service:

### Build Command:
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

### Start Command:
```
pnpm --filter @furniture/api start
```

**לא** `migrate deploy` - זה רק פעם אחת!

---

## 📋 סדר פעולות נכון:

1. ✅ **PostgreSQL Service** - רק וודא שהוא Active
2. ✅ **API Service** → **Run Command** → הרץ `migrate deploy` (פעם אחת)
3. ✅ **API Service** → **Start Command** = `pnpm --filter @furniture/api start`
4. ✅ **Restart** → הכל אמור לעבוד!

---

**זכור: Migrations = API Service, לא PostgreSQL!** 🎯

