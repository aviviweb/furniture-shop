# 🔧 תיקון שגיאת API 404

## הבעיה:
ה-endpoint `/api/companies/me` מחזיר 404 למרות שהוא מוגדר בקוד.

## מה לבדוק:

### שלב 1: בדוק את ה-API Service

1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש:**
   - ✅ `✅ API running on port 4000` - זה אומר שה-API רץ
   - ✅ `✅ CORS enabled for origins: ...` - זה אומר שה-CORS מוגדר
   - ❌ `Error: ...` - כל שגיאה אחרת

### שלב 2: בדוק את ה-Health Endpoint

נסה לפתוח:
- `https://furniture-api-xxxx.onrender.com/api/health`
- אמור לראות JSON response עם `status: 'ok'`

אם זה לא עובד, ה-API service לא רץ!

### שלב 3: בדוק את ה-Root Endpoint

נסה לפתוח:
- `https://furniture-api-xxxx.onrender.com/api`
- אמור לראות `Hello World` או משהו דומה

### שלב 4: בדוק את ה-Environment Variables

1. **Render Dashboard** → **`furniture-api`** → **"Environment"**
2. **וודא שיש:**
   - `DATABASE_URL` - אם לא במצב דמו
   - `DEMO_MODE` - אם רוצה מצב דמו
   - `JWT_SECRET` - אם משתמש ב-auth
   - `PORT` - אופציונלי (default: 4000)

### שלב 5: בדוק את ה-Deployment

1. **Render Dashboard** → **`furniture-api`** → **"Events"**
2. **חפש:**
   - ✅ `Deploy succeeded` - זה אומר שה-deployment הצליח
   - ❌ `Deploy failed` - זה אומר שיש בעיה

---

## 🆘 אם ה-API לא רץ:

### אפשרות 1: Manual Deploy
1. **Render Dashboard** → **`furniture-api`** → **"Manual Deploy"**
2. **לחץ על "Deploy latest commit"**

### אפשרות 2: בדוק את ה-Build Logs
1. **Render Dashboard** → **`furniture-api`** → **"Events"**
2. **לחץ על ה-deployment האחרון**
3. **חפש שגיאות ב-build**

### אפשרות 3: בדוק את ה-Runtime Logs
1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש שגיאות runtime**

---

## 📝 אם ה-API רץ אבל עדיין 404:

### בדוק את ה-URL:
- ✅ נכון: `https://furniture-api-xxxx.onrender.com/api/companies/me`
- ❌ שגוי: `https://furniture-api-xxxx.onrender.com/companies/me` (חסר `/api`)

### בדוק את ה-Headers:
ה-endpoint דורש `x-tenant-id` header. נסה עם:
```bash
curl -H "x-tenant-id: furniture-demo" https://furniture-api-xxxx.onrender.com/api/companies/me
```

---

## 🔍 איך לבדוק אם זה עובד:

1. **פתח את הדפדפן**
2. **נווט ל:** `https://furniture-api-xxxx.onrender.com/api/health`
3. **אמור לראות:**
   - ✅ JSON response עם `status: 'ok'`
   - ❌ "Not Found" - אם רואה את זה, ה-API לא רץ

---

## 🆘 אם עדיין לא עובד:

**שלח לי:**
1. **צילום מסך מה-Logs** של `furniture-api`
2. **מה אתה רואה כש-פותח** `https://furniture-api-xxxx.onrender.com/api/health`
3. **ואני אעזור לתקן!**

---

**הבעיה היא כנראה שה-API service לא רץ או לא deployed נכון!** 🔍

