# 🔐 גישה ל-Super Admin (יוצר המערכת)

## 📍 כתובת Super Admin

### שלב 1: מצא את ה-URL של ה-Web Service

**Render Dashboard:**
1. היכנס ל-**[Render Dashboard](https://dashboard.render.com)**
2. לחץ על **`furniture-web`** service
3. ב-**Settings** → **"Public URL"** או **"Custom Domain"**
4. העתק את ה-URL (נראה כמו: `https://furniture-web-xxxx.onrender.com`)

**או:**
- בדוק ב-**Logs** → חפש הודעות כמו `Server running on port 3000`
- ה-URL יהיה בדרך כלל: `https://furniture-web-xxxx.onrender.com`

---

### שלב 2: גש ל-Super Admin

**URL מלא:**
```
https://YOUR-WEB-URL.onrender.com/superadmin
```

**דוגמה:**
```
https://furniture-web-xxxx.onrender.com/superadmin
```

---

## 🔑 פרטי התחברות

### Super Admin User
- **Email:** `super@platform.local`
- **Password:** `changeme`
- **Role:** `SUPER_ADMIN`

---

## 📋 צעדים מלאים

### 1. התחברות
1. גש ל-`https://YOUR-WEB-URL.onrender.com/login`
2. הזן:
   - **Email:** `super@platform.local`
   - **Password:** `changeme`
3. לחץ **"התחבר"**

### 2. גישה ל-Super Admin
**אחרי התחברות:**
- תועבר אוטומטית לדשבורד (`/`)
- לחץ על **"מנהל מערכת"** בתפריט השמאלי
- או גש ישירות ל-`/superadmin`

**URL ישיר:**
```
https://YOUR-WEB-URL.onrender.com/superadmin
```

---

## 🎯 פונקציות Super Admin

### ניהול מצב דמו
- החלפת מצב דמו לכל tenant
- איפוס נתוני דמו

### גישה מלאה
- כל הפונקציות של OWNER
- גישה לכל החברות (Multi-tenant)
- ניהול משתמשים בכל החברות

---

## ⚠️ הערות חשובות

### אם לא רואה את `/superadmin` בתפריט:
- ודא שהתחברת עם `super@platform.local`
- ודא שה-role שלך הוא `SUPER_ADMIN`
- בדוק ב-**Network tab** (F12) שהתחברות הצליחה

### אם ה-URL לא עובד:
1. **ודא שה-Web Service עובד:**
   - Render Dashboard → `furniture-web` → **Logs**
   - חפש: `Ready on http://localhost:3000`

2. **ודא שה-migration רצה:**
   - Render Dashboard → `furniture-api` → **Shell**
   - הרץ: `pnpm --filter @furniture/prisma migrate deploy`

3. **ודא שה-seed רצה:**
   - Render Dashboard → `furniture-api` → **Shell**
   - הרץ: `pnpm --filter @furniture/prisma seed`

---

## 🔍 איך לבדוק שהכל עובד

### בדיקה 1: Web Service
```
https://YOUR-WEB-URL.onrender.com
```
**אמור לראות:** דף בית או דף Login

### בדיקה 2: Login
```
https://YOUR-WEB-URL.onrender.com/login
```
**התחבר עם:** `super@platform.local` / `changeme`

### בדיקה 3: Super Admin
```
https://YOUR-WEB-URL.onrender.com/superadmin
```
**אמור לראות:** דף "מנהל מערכת" עם אפשרות לניהול מצב דמו

---

## 🆘 פתרון בעיות

### שגיאה: "Unauthorized" או "Forbidden"
- **פתרון:** ודא שהתחברת עם `super@platform.local`
- **פתרון:** בדוק שה-role שלך הוא `SUPER_ADMIN` ב-database

### שגיאה: "Page not found"
- **פתרון:** ודא שה-Web Service deployed בהצלחה
- **פתרון:** בדוק ב-Logs שה-build הצליח

### שגיאה: "Cannot connect to API"
- **פתרון:** ודא שה-API Service עובד
- **פתרון:** בדוק את `NEXT_PUBLIC_API_URL` ב-Environment Variables

---

## 📝 סיכום מהיר

**URL Super Admin:**
```
https://YOUR-WEB-URL.onrender.com/superadmin
```

**פרטי התחברות:**
- Email: `super@platform.local`
- Password: `changeme`

**צעדים:**
1. מצא את ה-URL ב-Render Dashboard → `furniture-web` → Settings
2. התחבר ב-`/login`
3. גש ל-`/superadmin`

---

**🎉 זה הכל!**

