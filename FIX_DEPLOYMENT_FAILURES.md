# פתרון בעיות Deployment שנכשלו

## 🔍 איך לבדוק למה Deployment נכשל:

1. ב-Railway Dashboard → בחר service שנכשל
2. לחץ על **"Deployments"** → בחר deployment שנכשל
3. לחץ על **"Logs"** → קרא את ה-error messages

## 🔧 בעיות נפוצות ופתרונות:

### בעיה 1: Build Command לא מוגדר או שגוי

**תסמינים:**
- Error: "Build failed"
- Error: "Command not found"

**פתרון:**

#### API Service → Settings → Build & Deploy:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

**Start Command:**
```
pnpm --filter @furniture/api start
```

**Port:** `4000`

#### Web Service → Settings → Build & Deploy:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**Start Command:**
```
pnpm --filter @furniture/web start
```

**Port:** `3000`

### בעיה 2: Environment Variables חסרים

**תסמינים:**
- Error: "Environment variable not found"
- Error: "DATABASE_URL is required"

**פתרון:**

#### API Service → Variables:

```
DEMO_MODE=false
JWT_SECRET=<צור מפתח חזק - ראה למטה>
PORT=4000
FRONTEND_URL=<תעדכן אחרי שתקבל web-url>
```

**חשוב:** `DATABASE_URL` ו-`REDIS_URL` יתווספו אוטומטית מ-Railway אם ה-Databases מחוברים.

#### Web Service → Variables:

```
NEXT_PUBLIC_API_URL=<תעדכן אחרי שתקבל api-url>/api
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

### בעיה 3: Prisma Client לא נוצר

**תסמינים:**
- Error: "Cannot find module '@prisma/client'"
- Error: "Prisma Client not generated"

**פתרון:**

ודא שה-Build Command כולל:
```
pnpm --filter @furniture/prisma generate
```

לפני ה-build של ה-service.

### בעיה 4: Port לא מוגדר

**תסמינים:**
- Error: "Port already in use"
- Service לא עולה

**פתרון:**

1. API Service → Settings → Port: `4000`
2. Web Service → Settings → Port: `3000`
3. הוסף גם ב-Variables:
   - API: `PORT=4000`
   - Web: `PORT=3000`

### בעיה 5: Root Directory שגוי

**תסמינים:**
- Error: "Cannot find package.json"
- Error: "No such file or directory"

**פתרון:**

1. כל service → Settings → Root Directory
2. השאר **ריק** (root) - לא צריך להזין כלום
3. או ודא שזה מוגדר ל-`.` (root)

### בעיה 6: pnpm לא מותקן

**תסמינים:**
- Error: "pnpm: command not found"

**פתרון:**

Railway צריך להזהה pnpm אוטומטית. אם לא:
1. Settings → Build & Deploy → Nixpacks
2. או הוסף ל-Build Command:
   ```
   corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install ...
   ```

## 📋 Checklist לתיקון:

- [ ] Build Command מוגדר נכון
- [ ] Start Command מוגדר נכון
- [ ] Port מוגדר (4000 ל-API, 3000 ל-Web)
- [ ] Root Directory ריק או `.`
- [ ] Environment Variables מוגדרים
- [ ] DATABASE_URL קיים (אוטומטי מ-PostgreSQL)
- [ ] REDIS_URL קיים (אוטומטי מ-Redis)
- [ ] JWT_SECRET מוגדר (API service)
- [ ] NEXT_PUBLIC_API_URL מוגדר (Web service)

## 🚀 אחרי תיקון:

1. **שמור את כל השינויים**
2. **Redeploy:**
   - לחץ על service → "Deploy" או "Redeploy"
   - בחר branch: `main`
   - לחץ "Deploy"
3. **בדוק את ה-Logs:**
   - Deployments → בחר deployment → Logs
   - ודא שאין errors

## 💡 טיפים:

1. **תמיד בדוק את ה-Logs** - שם תראה את ה-error המדויק
2. **התחל עם API Service** - אם הוא עובד, Web יהיה קל יותר
3. **ודא שה-Databases מחוברים** - PostgreSQL ו-Redis צריכים להיות ב-Project
4. **השתמש ב-railway.toml** - הקובץ כבר מוגדר נכון, אבל ודא שה-Settings ב-Dashboard תואמים

## 🔗 קישורים שימושיים:

- [Railway Dashboard](https://railway.app)
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

