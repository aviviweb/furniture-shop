# פתרון צעד אחר צעד - פריסה ל-Railway

## 🎯 המטרה: לפרוס את האפליקציה ל-Railway בהצלחה

## ✅ צעד 1: היכנס ל-Railway Dashboard

1. פתח דפדפן
2. היכנס ל: https://railway.app
3. התחבר לחשבון שלך
4. בחר את הפרויקט: `furniture-shop`

## ✅ צעד 2: בחר את ה-API Service

1. לחץ על **`@furniture/api`** (או **`api`**)
2. לחץ על **"Settings"** (בתפריט העליון)

## ✅ צעד 3: תקן את ה-Build Command

1. גלול למטה ל-**"Build & Deploy"**
2. מצא את **"Build Command"**
3. מחק את כל מה שיש שם
4. העתק והדבק את זה:

```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

5. מצא את **"Start Command"**
6. מחק את כל מה שיש שם
7. העתק והדבק את זה:

```
pnpm --filter @furniture/api start
```

8. מצא את **"Port"**
9. הזן: `4000`

10. לחץ **"Save"** (או **"Update"**)

## ✅ צעד 4: בדוק Environment Variables

1. לחץ על **"Variables"** (בתפריט העליון)
2. ודא שיש:
   - `DEMO_MODE` = `false`
   - `PORT` = `4000`
   - `JWT_SECRET` = (מפתח כלשהו, למשל: `my-secret-key-12345`)
   - `DATABASE_URL` = (אמור להיות אוטומטי מ-PostgreSQL)
   - `REDIS_URL` = (אמור להיות אוטומטי מ-Redis)

3. אם חסר משהו, לחץ **"New Variable"** והוסף

## ✅ צעד 5: פרוס את ה-API

1. לחץ על **"Deployments"** (בתפריט העליון)
2. לחץ על **"Deploy"** או **"Redeploy"** (כפתור כחול)
3. בחר branch: `main`
4. לחץ **"Deploy"**

5. **חכה** - זה יקח כמה דקות
6. בדוק את ה-Logs - לחץ על ה-Deployment החדש → **"Logs"**

## ✅ צעד 6: חזור על זה ל-Web Service

1. חזור ל-Project (לחץ על שם הפרויקט למעלה)
2. לחץ על **`@furniture/web`** (או **`web`**)
3. חזור על צעדים 2-5, אבל:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**Start Command:**
```
pnpm --filter @furniture/web start
```

**Port:** `3000`

**Variables:**
- `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
- `NEXT_PUBLIC_BRAND_NAME` = `Furniture Shop`
- `NEXT_PUBLIC_PRIMARY_COLOR` = `#0ea5e9`
- `NEXT_PUBLIC_DEMO_MODE` = `false`
- `NODE_ENV` = `production`
- `PORT` = `3000`

## ✅ צעד 7: קבל URLs

1. כל service → **Settings** → **Networking**
2. לחץ **"Generate Domain"** (אם אין domain)
3. העתק את ה-URL

## ✅ צעד 8: עדכן Variables

1. **API Service** → **Variables**:
   - עדכן `FRONTEND_URL` = (ה-URL של Web service)

2. **Web Service** → **Variables**:
   - עדכן `NEXT_PUBLIC_API_URL` = (ה-URL של API service + `/api`)

3. **Redeploy** את שני ה-services

## 🎉 סיימת!

האפליקציה אמורה להיות פרוסה ועובדת!

## ❓ אם יש בעיות:

1. **Build נכשל:**
   - בדוק את ה-Logs
   - ודא שה-Build Command נכון (העתק-הדבק בדיוק)
   - ודא שה-Port נכון

2. **Service לא עולה:**
   - בדוק את ה-Logs
   - ודא שה-Start Command נכון
   - ודא שה-Port נכון

3. **Database Connection Failed:**
   - ודא ש-PostgreSQL service קיים בפרויקט
   - ודא ש-`DATABASE_URL` קיים ב-Variables

## 💡 טיפים:

- **תמיד בדוק את ה-Logs** - שם תראה את ה-error המדויק
- **התחל עם API** - אם הוא עובד, Web יהיה קל יותר
- **חכה בסבלנות** - Build יכול לקחת כמה דקות


