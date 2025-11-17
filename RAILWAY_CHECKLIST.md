# Railway Deployment Checklist

רשימת בדיקה מקיפה לפריסת האפליקציה ב-Railway.

## לפני התחלה

- [ ] חשבון Railway פעיל
- [ ] Railway CLI מותקן (`pnpm add -g @railway/cli`)
- [ ] מחובר ל-Railway (`railway login`)
- [ ] פרויקט Git מוכן (GitHub/GitLab)

## שלב 1: יצירת Railway Project

- [ ] פרויקט Railway נוצר (דרך Dashboard או `railway init`)
- [ ] פרויקט מקושר (`railway link`)
- [ ] `railway.toml` קיים ומוגדר נכון

## שלב 2: יצירת Services

- [ ] Service `api` נוצר
- [ ] Service `web` נוצר
- [ ] Service `worker` נוצר (אופציונלי)

**פקודות:**
```powershell
railway service create api
railway service create web
railway service create worker
```

## שלב 3: יצירת Database ו-Redis

- [ ] PostgreSQL Database נוסף
- [ ] Redis נוסף

**פקודות:**
```powershell
railway add postgresql
railway add redis
```

## שלב 4: הגדרת Environment Variables

### API Service Variables

- [ ] `DEMO_MODE=false`
- [ ] `JWT_SECRET` (מפתח חזק!)
- [ ] `PORT=4000`
- [ ] `DATABASE_URL` (אוטומטי מ-PostgreSQL)
- [ ] `REDIS_URL` (אוטומטי מ-Redis)
- [ ] `FRONTEND_URL` (URL של Web service)

### Web Service Variables

- [ ] `NEXT_PUBLIC_API_URL` (URL של API service + `/api`)
- [ ] `NEXT_PUBLIC_TENANT_ID` (למשל: `furniture-demo`)
- [ ] `NEXT_PUBLIC_BRAND_NAME` (שם המותג)
- [ ] `NEXT_PUBLIC_PRIMARY_COLOR` (צבע ראשי, למשל: `#0ea5e9`)
- [ ] `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`

### Worker Service Variables

- [ ] `REDIS_URL` (אוטומטי מ-Redis)
- [ ] `DATABASE_URL` (אוטומטי מ-PostgreSQL, אופציונלי)

**פקודות:**
```powershell
# הרץ את הסקריפט האוטומטי
pnpm railway:setup

# או הגדר ידנית:
railway variables set --service api DEMO_MODE=false
railway variables set --service api JWT_SECRET=your-secret-key
# ... וכו'
```

## שלב 5: בדיקת Configuration

- [ ] הרץ `pnpm railway:check` לבדיקת מצב
- [ ] כל ה-Services קיימים
- [ ] כל ה-Variables מוגדרים
- [ ] Database ו-Redis מחוברים

## שלב 6: Database Migrations

- [ ] Migrations רצו על ה-Database

**פקודה:**
```powershell
pnpm railway:migrate
# או
railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

## שלב 7: פריסה

- [ ] API Service מפורס
- [ ] Web Service מפורס
- [ ] Worker Service מפורס (אופציונלי)

**פקודות:**
```powershell
# פריסה של כל ה-services
pnpm deploy:all

# או פריסה נפרדת:
pnpm deploy:api
pnpm deploy:web
pnpm deploy:worker
```

## שלב 8: בדיקת Deployment

### בדיקת Logs

- [ ] API logs נקיים (אין שגיאות)
- [ ] Web logs נקיים (אין שגיאות)
- [ ] Worker logs נקיים (אין שגיאות)

**פקודות:**
```powershell
pnpm railway:logs:api
pnpm railway:logs:web
pnpm railway:logs:worker
```

### בדיקת Health

- [ ] API מגיב (`curl https://<api-url>/api`)
- [ ] Web נטען (פתח בדפדפן)
- [ ] אין שגיאות ב-Console של הדפדפן
- [ ] CORS עובד (API מגיב לבקשות מ-Web)

### בדיקת URLs

- [ ] API URL עובד
- [ ] Web URL עובד
- [ ] `FRONTEND_URL` ב-API מצביע ל-Web URL
- [ ] `NEXT_PUBLIC_API_URL` ב-Web מצביע ל-API URL

## שלב 9: Custom Domains (אופציונלי)

- [ ] Domain נוסף ל-Web service
- [ ] Domain נוסף ל-API service
- [ ] Wildcard domain נוסף (למשל: `*.yourdomain.com`)

**פקודות:**
```powershell
railway domain add app.yourdomain.com --service web
railway domain add api.yourdomain.com --service api
railway domain add *.yourdomain.com --service web
```

## שלב 10: בדיקות סופיות

- [ ] חנות מקוונת עובדת
- [ ] התחברות עובדת
- [ ] Dashboard עובד
- [ ] API endpoints עובדים
- [ ] Database operations עובדים
- [ ] Redis operations עובדים (אם Worker רץ)

## פתרון בעיות

אם משהו לא עובד:

1. **בדוק Logs:**
   ```powershell
   pnpm railway:logs:api
   pnpm railway:logs:web
   ```

2. **בדוק Variables:**
   ```powershell
   railway variables --service api
   railway variables --service web
   ```

3. **בדוק Status:**
   ```powershell
   railway status
   railway service
   ```

4. **Re-deploy:**
   ```powershell
   railway up --service api
   railway up --service web
   ```

5. **ראה TROUBLESHOOTING.md לפרטים נוספים**

## סיכום

אחרי שכל השלבים הושלמו:

- ✅ האפליקציה מפורסת ב-Railway
- ✅ כל ה-Services רצים
- ✅ Database מחובר
- ✅ Environment Variables מוגדרים
- ✅ האפליקציה עובדת ב-Production

**הערות:**
- ודא ש-`DEMO_MODE=false` ב-Production!
- ודא ש-`JWT_SECRET` חזק וייחודי
- ודא ש-URLs נכונים ב-Environment Variables
- בדוק Logs באופן קבוע

