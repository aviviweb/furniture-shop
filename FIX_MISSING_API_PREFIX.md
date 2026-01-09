# 🔧 תיקון - ה-API URL לא כולל /api

## 🎯 הבעיה:

מה שאתה רואה ב-Console:
```
🔗 API POST: { url: 'https://furniture-api-m8r9.onrender.com/api/auth/login', ... }
POST https://furniture-api-m8r9.onrender.com/auth/login 404
```

**זה אומר:** ה-URL נבנה נכון, אבל ה-request נשלח ללא `/api` - זה אומר שה-`NEXT_PUBLIC_API_URL` לא כולל את `/api` בסוף!

---

## ✅ הפתרון:

### שלב 1: בדוק את ה-Environment Variable

1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **חפש:** `NEXT_PUBLIC_API_URL`
3. **ודא שהוא:**
   ```
   NEXT_PUBLIC_API_URL=https://furniture-api-m8r9.onrender.com/api
   ```
   **חשוב:** חייב להסתיים ב-`/api`!

### שלב 2: אם זה לא נכון - תיקון

1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **לחץ על `NEXT_PUBLIC_API_URL`** (או "Edit")
3. **עדכן ל:**
   ```
   https://furniture-api-m8r9.onrender.com/api
   ```
   (ודא שזה מסתיים ב-`/api`!)
4. **שמור**
5. **חכה 2-3 דקות** עד שה-service restart

### שלב 3: בדוק שוב

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** → **"Console"**
3. **רענן את הדף** (F5)
4. **תראה:**
   ```
   🔧 API_BASE: https://furniture-api-m8r9.onrender.com/api
   ```
   (ודא שזה מסתיים ב-`/api`!)

---

## 🔍 איך לבדוק:

### בדוק את ה-Environment Variable:

1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **חפש:** `NEXT_PUBLIC_API_URL`
3. **מה הערך?**
   - ✅ נכון: `https://furniture-api-m8r9.onrender.com/api` (מסתיים ב-`/api`)
   - ❌ שגוי: `https://furniture-api-m8r9.onrender.com` (לא מסתיים ב-`/api`)

### בדוק ב-Console:

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** → **"Console"**
3. **רענן את הדף** (F5)
4. **תראה:**
   ```
   🔧 API_BASE: https://furniture-api-m8r9.onrender.com/api
   ```
   (ודא שזה מסתיים ב-`/api`!)

---

## 📋 Checklist:

- [ ] בדקתי את `NEXT_PUBLIC_API_URL` ב-Render
- [ ] הערך מסתיים ב-`/api` (נכון: `...onrender.com/api`)
- [ ] ה-service restart (חכה 2-3 דקות)
- [ ] בדקתי ב-Console - רואה `API_BASE: .../api`
- [ ] ניסיתי להתחבר - עובד!

---

## 🆘 אם עדיין לא עובד:

**שלח לי:**
1. **מה הערך של `NEXT_PUBLIC_API_URL` ב-Render?**
   - העתק את הערך המדויק
2. **מה אתה רואה ב-Console?**
   - העתק את ההודעה עם `🔧 API_BASE:`
3. **מה ה-Request URL ב-Network tab?**
   - פתח F12 → Network
   - נסה להתחבר
   - לחץ על ה-request ל-`/auth/login`
   - מה ה-URL המלא?

---

**ודא שה-`NEXT_PUBLIC_API_URL` מסתיים ב-`/api`!** 🎯

