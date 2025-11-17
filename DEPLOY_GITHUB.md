# פריסה דרך GitHub Integration (הדרך הקלה ביותר!)

## ✅ מה יש לך כבר:
- ✅ חשבון Railway
- ✅ פרויקט Railway
- ✅ חיבור ל-GitHub

## 🚀 צעדים לפריסה:

### שלב 1: וודא שה-Repo מחובר ל-Railway

1. היכנס ל-[Railway Dashboard](https://railway.app)
2. בחר את הפרויקט שלך
3. בדוק אם יש services שכבר מחוברים ל-GitHub repo

### שלב 2: הוסף Services (אם אין)

#### API Service:
1. לחץ **"New"** → **"GitHub Repo"**
2. בחר את ה-repo שלך
3. שם: `api`
4. ב-**Settings**:
   - **Root Directory:** השאר ריק (root)
   - **Build Command:**
     ```
     pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
     ```
   - **Start Command:**
     ```
     pnpm --filter @furniture/api start
     ```
   - **Port:** `4000`

#### Web Service:
1. לחץ **"New"** → **"GitHub Repo"**
2. בחר את אותו repo
3. שם: `web`
4. ב-**Settings**:
   - **Root Directory:** השאר ריק (root)
   - **Build Command:**
     ```
     pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
     ```
   - **Start Command:**
     ```
     pnpm --filter @furniture/web start
     ```
   - **Port:** `3000`

### שלב 3: הוסף Database (אם אין)

1. **PostgreSQL:**
   - לחץ **"New"** → **"Database"** → **"PostgreSQL"**
   - Railway ייצור database אוטומטית
   - `DATABASE_URL` יתווסף אוטומטית לכל ה-services

2. **Redis:**
   - לחץ **"New"** → **"Database"** → **"Redis"**
   - Railway ייצור Redis אוטומטית
   - `REDIS_URL` יתווסף אוטומטית לכל ה-services

### שלב 4: הגדר Environment Variables

#### API Service → Variables:

```
DEMO_MODE=false
JWT_SECRET=<צור מפתח חזק - למשל: openssl rand -hex 32>
PORT=4000
FRONTEND_URL=<תעדכן אחרי שתקבל web-url>
```

**חשוב:**
- `DATABASE_URL` ו-`REDIS_URL` יתווספו אוטומטית מ-Railway
- `FRONTEND_URL` - תצטרך להזין אחרי שתקבל את ה-URL של Web service

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

**חשוב:**
- `NEXT_PUBLIC_API_URL` - תצטרך להזין אחרי שתקבל את ה-URL של API service

### שלב 5: צור JWT_SECRET

**Windows PowerShell:**
```powershell
# צור מפתח חזק
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

או פשוט השתמש ב-generator online:
- [RandomKeygen](https://randomkeygen.com/)
- בחר "CodeIgniter Encryption Keys" או "Fort Knox Password"

### שלב 6: פרוס!

1. **דחוף קוד ל-GitHub:**
   ```powershell
   git add .
   git commit -m "Ready for Railway deployment"
   git push
   ```

2. **Railway יפרוס אוטומטית!** 🎉
   - Railway יזהה את ה-push החדש
   - יתחיל build אוטומטי
   - יפרוס את ה-services

### שלב 7: קבל URLs

לאחר הפריסה:

1. עבור לכל service → **Settings** → **Networking**
2. לחץ **"Generate Domain"** (אם אין domain)
3. העתק את ה-URLs

### שלב 8: עדכן Environment Variables

1. **API Service:**
   - עדכן `FRONTEND_URL` עם ה-URL של Web service
   - לדוגמה: `https://furniture-shop-web-production.up.railway.app`

2. **Web Service:**
   - עדכן `NEXT_PUBLIC_API_URL` עם ה-URL של API service + `/api`
   - לדוגמה: `https://furniture-shop-api-production.up.railway.app/api`

3. **Redeploy:**
   - Railway יפרוס מחדש אוטומטית אחרי עדכון Variables

### שלב 9: הרץ Database Migrations

לפני הפריסה הראשונה, צריך להריץ migrations:

1. עבור ל-**API Service** → **Deployments**
2. לחץ על ה-Deployment האחרון
3. לחץ על **"Shell"** או **"Run Command"**
4. הרץ:
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```

או דרך **Settings** → **Deploy** → **Run Command**

### שלב 10: בדוק את הפריסה

1. פתח את ה-URL של **Web Service** בדפדפן
2. בדוק שהדף נטען
3. בדוק את ה-Console ל-errors
4. בדוק את ה-Logs ב-Railway Dashboard

## 🔄 עדכון Deployment

כל פעם שתדחוף קוד ל-GitHub:
```powershell
git add .
git commit -m "Update code"
git push
```

Railway יפרוס אוטומטית! 🚀

## 📊 בדיקת Logs

1. Railway Dashboard → בחר service → **Deployments**
2. לחץ על deployment → **Logs**
3. או **Settings** → **Logs**

## ⚠️ פתרון בעיות

### Build נכשל:
- בדוק את ה-Logs
- ודא ש-`pnpm-lock.yaml` קיים ומעודכן
- ודא שכל ה-Environment Variables מוגדרים

### Database Connection Failed:
- ודא ש-PostgreSQL service רץ
- ודא ש-`DATABASE_URL` מוגדר
- בדוק את ה-Logs

### CORS Errors:
- ודא ש-`FRONTEND_URL` ב-API service מוגדר נכון
- ודא שה-URL מתחיל ב-`https://`

## ✅ Checklist

- [ ] Services נוצרו (API, Web)
- [ ] Database נוסף (PostgreSQL, Redis)
- [ ] Environment Variables מוגדרים
- [ ] JWT_SECRET נוצר
- [ ] קוד נדחף ל-GitHub
- [ ] Railway פרס אוטומטית
- [ ] URLs התקבלו
- [ ] Environment Variables עודכנו עם URLs
- [ ] Migrations הורצו
- [ ] האפליקציה עובדת!

