# הגדרת Pre-deploy Command ב-Railway

## בעיה
ה-Pre-deploy command נכשל ב-Railway, מה שגורם ל-deployments להיכשל.

## פתרון

### דרך Railway Dashboard (מומלץ):

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **בחר את הפרויקט שלך**
3. **לחץ על `@furniture/api` Service**
4. **לחץ על "Settings"** (משמאל)
5. **גלול למטה ל-"Deploy"**
6. **מצא "Pre-deploy step"** (או "Pre-deploy command")
7. **לחץ "+ Add pre-deploy step"** (או "Edit")
8. **הדבק את הפקודה הבאה:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
9. **לחץ "Save"**
10. **חזור ל-"Deployments"** → **"Redeploy"**

### דרך railway.toml (אופציונלי):

Railway לא תומך ב-pre-deploy ב-railway.toml ישירות, אבל אתה יכול להוסיף את זה ל-Build Command:

```toml
[services.api]
path = "."
build = "pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/prisma migrate deploy && pnpm --filter @furniture/api build"
start = "pnpm --filter @furniture/api start"
```

**⚠️ שים לב:** זה יגרום ל-migrations לרוץ בכל build, מה שעלול להיות איטי. עדיף להשתמש ב-Pre-deploy step דרך Dashboard.

## בדיקה

אחרי שהגדרת את Pre-deploy step:

1. **Redeploy את ה-API service**
2. **בדוק את ה-Logs** → **חפש:**
   - ✅ `Prisma schema loaded from`
   - ✅ `Applied migration`
   - ✅ `Database connected successfully`

## אם עדיין נכשל:

1. **בדוק ש-DATABASE_URL מוגדר נכון** ב-Variables
2. **בדוק ש-PostgreSQL service עובד** (Online)
3. **נסה להריץ migrations ידנית:**
   ```powershell
   pnpm railway:migrate
   ```

## הערות

- Pre-deploy step רץ **לפני** ה-build
- אם Pre-deploy נכשל, ה-deployment לא יתחיל
- Migrations רצות רק פעם אחת (idempotent)
- אם יש שגיאה, בדוק את ה-Logs ב-Railway Dashboard

