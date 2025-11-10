# פתרון בעיות פריסה - Railway

## בעיה: רק API עבר פריסה, Web לא

### בדיקות ראשוניות:

1. **בדוק את ה-Logs ב-Railway Dashboard:**
   - היכנס ל-Railway Dashboard
   - בחר את ה-Web service
   - לחץ על "Logs" או "View logs"
   - חפש שגיאות build או runtime

2. **בדוק את ה-Deployment Status:**
   - בדוק אם ה-Deployment נכשל או תקוע
   - בדוק את ה-Build logs

### פתרונות נפוצים:

#### 1. שגיאת Build
**תסמינים:** Build נכשל, שגיאות TypeScript/ESLint

**פתרון:**
```powershell
# בדוק build מקומי
cd apps/web
pnpm build

# אם יש שגיאות, תיקן אותן
# ואז commit ו-push
git add .
git commit -m "Fix build errors"
git push
```

#### 2. משתני סביבה חסרים
**תסמינים:** Build עובר אבל האפליקציה לא עובדת

**פתרון:**
ודא שכל המשתנים הבאים מוגדרים ב-Web service:
- `NEXT_PUBLIC_API_URL` - URL של ה-API service
- `NEXT_PUBLIC_TENANT_ID` - מזהה ה-tenant
- `NEXT_PUBLIC_BRAND_NAME` - שם המותג
- `NEXT_PUBLIC_PRIMARY_COLOR` - צבע ראשי
- `NEXT_PUBLIC_DEMO_MODE=false` - **חשוב!**
- `NODE_ENV=production`
- `PORT=3000`

#### 3. בעיות עם Dockerfile
**תסמינים:** Build נכשל ב-Docker

**פתרון:**
ודא שה-`frontend/Dockerfile` תקין:
- מותקן pnpm
- מעתיק את כל הקבצים הנדרשים
- מריץ build נכון
- מגדיר PORT נכון

#### 4. בעיות עם Railway.toml
**תסמינים:** Service לא מתחיל

**פתרון:**
ודא ש-`railway.toml` מוגדר נכון:
```toml
[services.web]
path = "frontend"
start = "pnpm --filter @furniture/web start"
```

#### 5. בעיות עם Port
**תסמינים:** Service לא מגיב

**פתרון:**
- ודא ש-`PORT=3000` מוגדר
- Next.js צריך לקבל את ה-PORT מ-environment variable
- בדוק את ה-Logs אם יש שגיאות port binding

### בדיקות נוספות:

1. **בדוק את ה-GitHub Integration:**
   - ודא ש-Railway מחובר ל-GitHub repo
   - בדוק שה-Deployments מתעדכנים אוטומטית

2. **בדוק את ה-Service Configuration:**
   - ודא שה-Web service מוגדר נכון
   - בדוק את ה-Root Directory (צריך להיות `frontend`)
   - בדוק את ה-Build Command

3. **בדוק את ה-Environment Variables:**
   - ודא שכל המשתנים מוגדרים
   - ודא שהם מוגדרים ל-Web service (לא ל-API)
   - בדוק שאין שגיאות כתיב

### פקודות לבדיקה:

```powershell
# בדוק build מקומי
cd apps/web
pnpm build

# בדוק את ה-Logs (אם מחובר ל-Railway)
railway logs --service web

# בדוק את ה-Variables
railway variables --service web
```

### אם כל זה לא עוזר:

1. **נסה Re-deploy:**
   - ב-Railway Dashboard → Web service → Settings
   - לחץ "Redeploy" או "Deploy"

2. **בדוק את ה-GitHub Actions:**
   - אם יש GitHub Actions, בדוק את ה-Logs שם

3. **צור Issue חדש:**
   - העתק את ה-Logs המלאים
   - צור issue ב-GitHub עם הפרטים

