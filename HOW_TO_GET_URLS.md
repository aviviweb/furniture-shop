# איך לקבל URLs ל-Railway Services

## 🎯 מה צריך?

יש **2 URLs** שצריך לקבל:

1. **API URL** - עבור `NEXT_PUBLIC_API_URL` ב-Web Service
2. **Web URL** - עבור `FRONTEND_URL` ב-API Service

---

## 📍 איך לקבל את ה-URLs

### שלב 1: קבלת API URL

**Railway Dashboard → `@furniture/api` Service:**

1. לחץ על **"Settings"** (משמאל)
2. גלול למטה → **"Networking"** או **"Domains"**
3. לחץ **"Generate Domain"** (אם אין domain)
4. **העתק את ה-URL** - למשל: `https://furnitureapi-production-xxxx.up.railway.app`

**זה ה-API URL!** ✅

---

### שלב 2: קבלת Web URL

**Railway Dashboard → `@furniture/web` Service:**

1. לחץ על **"Settings"** (משמאל)
2. גלול למטה → **"Networking"** או **"Domains"**
3. לחץ **"Generate Domain"** (אם אין domain)
4. **העתק את ה-URL** - למשל: `https://furnitureweb-production-xxxx.up.railway.app`

**זה ה-Web URL!** ✅

---

## 🔧 איפה למלא את ה-URLs

### 1. Web Service → Variables

**Dashboard → `@furniture/web` → Variables:**

- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://<api-url>.railway.app/api`

**דוגמה:**
אם ה-API URL הוא: `https://furnitureapi-production-xxxx.up.railway.app`

אז ה-Value יהיה:
```
https://furnitureapi-production-xxxx.up.railway.app/api
```

**⚠️ חשוב:** הוסף `/api` בסוף!

---

### 2. API Service → Variables

**Dashboard → `@furniture/api` → Variables:**

- **Name:** `FRONTEND_URL`
- **Value:** `https://<web-url>.railway.app`

**דוגמה:**
אם ה-Web URL הוא: `https://furnitureweb-production-xxxx.up.railway.app`

אז ה-Value יהיה:
```
https://furnitureweb-production-xxxx.up.railway.app
```

**⚠️ חשוב:** **אל תוסיף** `/api` כאן!

---

## 📋 סדר פעולות מומלץ

### אופציה A: אם ה-Services כבר Online

1. **קבל את ה-URLs** (שלבים 1-2 למעלה)
2. **מלא את ה-Variables** (שלבים 1-2 למטה)
3. **Redeploy** את שני ה-Services

### אופציה B: אם ה-Services עדיין לא Online

1. **הגדר את כל ה-Variables האחרים** (בלי URLs)
2. **Redeploy** את ה-Services
3. **קבל את ה-URLs** (שלבים 1-2 למעלה)
4. **עדכן את ה-Variables** עם ה-URLs
5. **Redeploy** שוב

---

## 💡 טיפים

1. **אם אין "Generate Domain"** - ה-Service כנראה כבר יש לו domain, פשוט העתק אותו
2. **ה-URLs יכולים להשתנות** - אם אתה מחק service ויצרת מחדש, תצטרך לעדכן
3. **שמור את ה-URLs** - תצטרך אותם גם אחר כך

---

## ✅ דוגמה מלאה

**נניח שקיבלת:**
- API URL: `https://furnitureapi-production-ebea.up.railway.app`
- Web URL: `https://furnitureweb-production-xxxx.up.railway.app`

**אז תמלא:**

**Web Service → Variables:**
- `NEXT_PUBLIC_API_URL` = `https://furnitureapi-production-ebea.up.railway.app/api`

**API Service → Variables:**
- `FRONTEND_URL` = `https://furnitureweb-production-xxxx.up.railway.app`

---

## 🆘 אם לא רואה "Generate Domain"

1. **וודא שה-Service Online** - אם Service לא Online, לא תראה את האפשרות
2. **נסה ל-Redeploy** - לפעמים צריך deployment ראשון
3. **בדוק ב-Settings → Networking** - לפעמים זה נמצא שם

---

**אחרי שתמלא את ה-URLs, תצטרך ל-Redeploy את ה-Services!**

