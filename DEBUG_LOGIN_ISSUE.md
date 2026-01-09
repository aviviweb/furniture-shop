# 🔍 ניפוי באגים - "Cannot POST /auth/login"

## 🎯 מה לבדוק:

### שלב 1: פתח את ה-Console

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** (Developer Tools)
3. **לחץ על "Console"**
4. **רענן את הדף** (F5)

### שלב 2: מה אתה רואה ב-Console?

**אמור לראות אחת מהאפשרויות הבאות:**

#### אפשרות 1: ✅ ה-API URL מוגדר נכון
```
🔧 API_BASE: https://furniture-api-m8r9.onrender.com/api
🔧 NEXT_PUBLIC_API_URL: https://furniture-api-m8r9.onrender.com/api
```
**אם אתה רואה את זה** - ה-API URL מוגדר נכון, אבל יש בעיה אחרת.

#### אפשרות 2: ❌ ה-API URL לא מוגדר
```
🔧 API_BASE: http://localhost:4000/api
❌ NEXT_PUBLIC_API_URL is not set! Please add it in Render → furniture-web → Environment
```
**אם אתה רואה את זה** - ה-Environment Variable לא מוגדר או לא restart.

#### אפשרות 3: 🔧 ה-API URL מוגדר אבל לא נכון
```
🔧 API_BASE: https://furniture-api-XXXX.onrender.com/api
```
(אבל `XXXX` לא נכון)

---

## ✅ פתרון לפי מה שאתה רואה:

### אם אתה רואה אפשרות 1 (API URL נכון):

**הבעיה:** ה-API URL נכון, אבל יש בעיה אחרת.

**מה לבדוק:**
1. **פתח:** `https://furniture-api-m8r9.onrender.com/api/health`
2. **אמור לראות:**
   ```json
   {
     "status": "ok",
     "demoMode": true
   }
   ```
3. **אם `demoMode` הוא `false`** - צריך להגדיר `DEMO_MODE=true` ב-`furniture-api`

### אם אתה רואה אפשרות 2 (API URL לא מוגדר):

**הבעיה:** ה-Environment Variable לא מוגדר או לא restart.

**פתרון:**
1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **ודא שיש:**
   ```
   NEXT_PUBLIC_API_URL=https://furniture-api-m8r9.onrender.com/api
   ```
3. **אם אין** - הוסף אותו
4. **אם יש** - מחק אותו והוסף אותו שוב (לפעמים זה עוזר)
5. **שמור** וחכה 2-3 דקות ל-restart
6. **רענן את הדף** (F5) ובדוק שוב

### אם אתה רואה אפשרות 3 (API URL שגוי):

**הבעיה:** ה-API URL לא נכון.

**פתרון:**
1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **עדכן את:**
   ```
   NEXT_PUBLIC_API_URL=https://furniture-api-m8r9.onrender.com/api
   ```
3. **שמור** וחכה 2-3 דקות ל-restart

---

## 🧪 בדיקה נוספת:

### שלב 1: נסה להתחבר

1. **נסה להתחבר** עם:
   - Email: `super@platform.local`
   - Password: `changeme`
2. **תראה ב-Console:**
   ```
   🔧 Login attempt - API URL: https://furniture-api-m8r9.onrender.com/api
   🔗 API POST: { url: 'https://furniture-api-m8r9.onrender.com/api/auth/login', ... }
   ```

### שלב 2: בדוק את ה-Network Tab

1. **לחץ על "Network"** ב-Developer Tools
2. **נסה להתחבר שוב**
3. **חפש את ה-request ל-`/auth/login`**
4. **לחץ עליו** ותראה:
   - **Request URL:** מה ה-URL המלא?
   - **Status:** מה ה-Status? (200 / 404 / Failed)
   - **Response:** מה ה-Response?

---

## 📋 Checklist:

- [ ] פתחתי את ה-Console (F12)
- [ ] רעננתי את הדף (F5)
- [ ] העתקתי את מה שאני רואה ב-Console (🔧 או ❌)
- [ ] בדקתי את ה-Environment Variables ב-Render
- [ ] בדקתי את ה-Network tab

---

## 🆘 שלח לי:

1. **מה אתה רואה ב-Console?** (העתק את כל ההודעות עם 🔧 או ❌)
2. **מה ה-Request URL ב-Network tab?** (העתק את ה-URL המלא)
3. **מה ה-Status ב-Network tab?** (200 / 404 / Failed)
4. **האם ה-Environment Variables מוגדרים ב-Render?** (כן/לא)

---

**בואו נבדוק מה קורה ב-Console!** 🔍

