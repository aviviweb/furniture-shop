# 🔍 בדיקת Services ב-Render

## ✅ Blueprint מסונכרן
ה-Blueprint מסונכרן, אבל צריך לבדוק שה-services עצמם deployed ורצים.

## מה לבדוק:

### שלב 1: בדוק את ה-API Service

1. **Render Dashboard** → **"Resources"** (בתפריט השמאלי)
2. **חפש את `furniture-api`** (או שם דומה)
3. **לחץ עליו**
4. **בדוק את ה-Status:**
   - ✅ **"Live"** - ה-service רץ
   - ⚠️ **"Build failed"** - יש בעיה ב-build
   - ⚠️ **"Deploy failed"** - יש בעיה ב-deployment
   - ⚠️ **"Stopped"** - ה-service לא רץ

### שלב 2: בדוק את ה-Web Service

1. **Render Dashboard** → **"Resources"**
2. **חפש את `furniture-web`** (או שם דומה)
3. **לחץ עליו**
4. **בדוק את ה-Status:**
   - ✅ **"Live"** - ה-service רץ
   - ⚠️ **"Build failed"** - יש בעיה ב-build
   - ⚠️ **"Deploy failed"** - יש בעיה ב-deployment

### שלב 3: בדוק את ה-Logs

**עבור `furniture-api`:**
1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש:**
   - ✅ `✅ API running on port 4000` - ה-API רץ
   - ✅ `✅ CORS enabled for origins: ...` - CORS מוגדר
   - ❌ `Error: ...` - יש שגיאה

**עבור `furniture-web`:**
1. **Render Dashboard** → **`furniture-web`** → **"Logs"**
2. **חפש:**
   - ✅ `✓ Ready in X.Xs` - ה-Web רץ
   - ✅ `✓ Compiled /login` - ה-login route נבנה
   - ❌ `Error: ...` - יש שגיאה

### שלב 4: בדוק את ה-URLs

**נסה לפתוח:**
1. **API Health:** `https://furniture-api-xxxx.onrender.com/api/health`
   - אמור לראות JSON עם `status: 'ok'`
2. **API Companies:** `https://furniture-api-xxxx.onrender.com/api/companies/me`
   - אמור לראות JSON (או 401 אם לא מחובר)
3. **Web Login:** `https://furniture-web-xxxx.onrender.com/login`
   - אמור לראות דף כניסה

---

## 🆘 אם ה-Services לא רץ:

### אפשרות 1: Manual Deploy
1. **Render Dashboard** → **`furniture-api`** → **"Manual Deploy"**
2. **לחץ על "Deploy latest commit"**
3. **חזור על זה גם עבור `furniture-web`**

### אפשרות 2: בדוק את ה-Environment Variables
1. **Render Dashboard** → **`furniture-api`** → **"Environment"**
2. **וודא שיש:**
   - `DATABASE_URL` (אם לא במצב דמו)
   - `DEMO_MODE=true` (אם רוצה מצב דמו)
   - `JWT_SECRET` (אם משתמש ב-auth)
   - `PORT=4000` (אופציונלי)

### אפשרות 3: בדוק את ה-Build Logs
1. **Render Dashboard** → **`furniture-api`** → **"Events"**
2. **לחץ על ה-deployment האחרון**
3. **חפש שגיאות ב-build**

---

## 📝 מה לשלוח לי:

אם עדיין יש בעיות, שלח לי:
1. **מה ה-Status של `furniture-api`?** (Live / Build failed / Deploy failed)
2. **מה ה-Status של `furniture-web`?** (Live / Build failed / Deploy failed)
3. **מה אתה רואה ב-Logs של `furniture-api`?**
4. **מה אתה רואה כש-פותח** `https://furniture-api-xxxx.onrender.com/api/health`?

---

**בואו נבדוק את ה-Services ונוודא שהם רצים!** 🔍

