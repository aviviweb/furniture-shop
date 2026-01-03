# 🔧 תיקון בעיית כניסה

## מה תוקן:

### 1. **שיפור Error Handling**
- ה-API עכשיו מחזיר הודעות שגיאה ברורות יותר
- ה-Client מציג את ה-error message מהשרת במקום שגיאה גנרית

### 2. **תיקון CORS**
- ה-API עכשיו מאפשר כל Render domain (`.onrender.com`)
- לא צריך להגדיר `FRONTEND_URL` ב-Render (אבל עדיין מומלץ)

### 3. **תיקון Login Request**
- ה-login לא שולח `x-tenant-id` header (לא נדרש)
- ה-error handling משופר עם מידע מפורט יותר

---

## 🧪 בדיקה מהירה:

### שלב 1: בדוק את ה-Console בדפדפן

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** (Developer Tools)
3. **לחץ על "Console"**
4. **נסה להתחבר** עם:
   - Email: `super@platform.local`
   - Password: `changeme`
5. **תראה ב-Console:**
   - ✅ אם יש שגיאה - תראה את ה-error message המדויק
   - ✅ אם יש network error - תראה את ה-URL שנשלח

### שלב 2: בדוק את ה-Network Tab

1. **לחץ על "Network"** ב-Developer Tools
2. **נסה להתחבר שוב**
3. **חפש את ה-request ל-`/auth/login`**
4. **לחץ עליו** ותראה:
   - **Request URL:** אמור להיות `https://furniture-api-XXXX.onrender.com/api/auth/login`
   - **Status:** 200 (הצלחה) או 401/500 (שגיאה)
   - **Response:** תראה את ה-error message

---

## 🔍 מה לבדוק:

### אם אתה רואה "Failed to fetch" או "NetworkError":

**הבעיה:** ה-API לא נגיש או ה-URL לא נכון.

**פתרון:**
1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **בדוק שיש:**
   ```
   NEXT_PUBLIC_API_URL=https://furniture-api-XXXX.onrender.com/api
   ```
   (החלף `XXXX` עם ה-ID של ה-API service שלך)

### אם אתה רואה "invalid credentials":

**הבעיה:** האימייל או הסיסמה לא נכונים.

**פתרון:**
- נסה עם:
  - `super@platform.local` / `changeme`
  - `owner1@demo.local` / `changeme`

### אם אתה רואה "שגיאת API: 500":

**הבעיה:** יש שגיאה בשרת.

**פתרון:**
1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש שגיאות** (העתק את השגיאה)

---

## 📋 Checklist:

- [ ] ה-Console בדפדפן פתוח
- [ ] ניסיתי להתחבר וראיתי את ה-error message
- [ ] בדקתי את ה-Network tab
- [ ] בדקתי את ה-Environment variables ב-Render
- [ ] בדקתי את ה-Logs של `furniture-api`

---

## 🆘 אם עדיין לא עובד:

**שלח לי:**
1. **מה אתה רואה ב-Console?** (העתק את ה-error message)
2. **מה ה-Status ב-Network tab?** (200 / 401 / 500 / Failed)
3. **מה ה-Response ב-Network tab?** (העתק את התוכן)
4. **מה אתה רואה ב-Logs של `furniture-api`?** (העתק את השגיאה)

---

**עכשיו נסה להתחבר שוב ותראה הודעות שגיאה ברורות יותר!** 🔍

