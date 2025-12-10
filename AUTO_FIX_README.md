# 🚀 תיקון אוטומטי ל-Railway

## מה הסקריפט עושה?

הסקריפט `fix-railway-auto.ps1` מתקן אוטומטית את כל הבעיות הנפוצות:

✅ **בודק ומתקין Railway CLI**  
✅ **בודק התחברות ל-Railway**  
✅ **מקשר Project**  
✅ **מגדיר Environment Variables** (API + Web)  
✅ **מריץ Database Migrations**  
✅ **מפריס Services** (אופציונלי)  

---

## 🎯 איך להריץ

### דרך 1: דרך pnpm (מומלץ)

```powershell
pnpm railway:fix
```

### דרך 2: ישירות

```powershell
.\fix-railway-auto.ps1
```

---

## ⚠️ מה צריך לעשות ידנית

הסקריפט לא יכול לעשות הכל אוטומטית. יש כמה דברים שצריך לעשות ידנית ב-Railway Dashboard:

### 1️⃣ Web Service → Variables

**הוסף:**
```
NEXT_PUBLIC_API_URL=https://<api-service-url>.railway.app/api
```

**איך למצוא את ה-URL:**
1. Railway Dashboard → `@furniture/api` Service
2. Settings → Networking → "Generate Domain"
3. העתק את ה-URL

---

### 2️⃣ API Service → Settings → Deploy → Pre-deploy step

**הוסף:**
```
pnpm --filter @furniture/prisma migrate deploy
```

**איך:**
1. Railway Dashboard → `@furniture/api` Service
2. Settings → Deploy
3. Pre-deploy step → "+ Add pre-deploy step"
4. הדבק את הפקודה
5. שמור

---

### 3️⃣ API Service → Variables

**הוסף:**
```
JWT_SECRET=<צור מפתח חזק>
```

**איך ליצור מפתח:**
```powershell
openssl rand -hex 32
```

**או:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 4️⃣ API Service → Variables

**הוסף:**
```
FRONTEND_URL=https://<web-service-url>.railway.app
```

**איך למצוא את ה-URL:**
1. Railway Dashboard → `@furniture/web` Service
2. Settings → Networking → "Generate Domain"
3. העתק את ה-URL

---

### 5️⃣ וודא Build Commands נכונים

**API Service → Settings → Build:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

**Web Service → Settings → Build:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

---

## 📋 Checklist אחרי הרצת הסקריפט

- [ ] ✅ הסקריפט רץ בהצלחה
- [ ] ⚠️ הוספתי `NEXT_PUBLIC_API_URL` ב-Web Service
- [ ] ⚠️ הוספתי Pre-deploy step ב-API Service
- [ ] ⚠️ הוספתי `JWT_SECRET` ב-API Service
- [ ] ⚠️ הוספתי `FRONTEND_URL` ב-API Service
- [ ] ⚠️ בדקתי Build Commands
- [ ] ✅ Redeploy את כל ה-Services

---

## 🔍 איך לבדוק שהכל עובד

### 1. בדוק Logs

```powershell
pnpm railway:logs:api
pnpm railway:logs:web
```

### 2. בדוק Health Check

פתח בדפדפן:
```
https://<api-url>/api/health
```

אמור לראות:
```json
{
  "status": "ok",
  "demoMode": false,
  "services": {
    "api": "ok",
    "database": "ok"
  }
}
```

### 3. בדוק Web App

פתח בדפדפן:
```
https://<web-url>
```

אמור לראות את האפליקציה.

---

## 🆘 אם יש בעיות

1. **הסקריפט נכשל:**
   - בדוק ש-Railway CLI מותקן: `railway --version`
   - בדוק שאתה מחובר: `railway whoami`
   - בדוק ש-Project מקושר: `railway status`

2. **Variables לא הוגדרו:**
   - בדוק ב-Railway Dashboard → Service → Variables
   - נסה להגדיר ידנית

3. **Build עדיין נכשל:**
   - ראה `FIX_WEB_BUILD_FAILURE.md`
   - בדוק Build Logs ב-Railway Dashboard

---

## 📚 מדריכים נוספים

- `QUICK_FIX_RAILWAY.md` - תיקון מהיר ב-5 שלבים
- `RAILWAY_DEPLOYMENT_ISSUES.md` - פתרון בעיות מפורט
- `FIX_WEB_BUILD_FAILURE.md` - תיקון Web Build
- `CHECK_BUILD_LOGS.md` - איך לבדוק Logs

---

## 💡 טיפים

1. **הרץ את הסקריפט אחרי כל שינוי גדול** - זה יוודא שהכל עדיין מוגדר נכון
2. **שמור את ה-URLs** - תצטרך אותם להגדרת Variables
3. **בדוק Logs אחרי כל Redeploy** - זה יעזור לזהות בעיות מהר

---

**✅ אחרי שתסיים את כל השלבים הידניים, האפליקציה אמורה לעבוד!**

