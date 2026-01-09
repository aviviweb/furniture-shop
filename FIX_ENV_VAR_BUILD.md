# 🔧 תיקון - Environment Variable לא נטען ב-Build

## 🎯 הבעיה:

מה שאתה רואה ב-Console:
```
🔧 API_BASE: https://furniture-api-m8r9.onrender.com/api  ← נכון!
🔗 API POST: { url: 'https://furniture-api-m8r9.onrender.com/api/auth/login', ... }  ← נכון!
POST https://furniture-api-m8r9.onrender.com/auth/login 404  ← שגוי! (ללא /api)
```

**זה אומר:** ה-Environment Variable נכון, אבל Next.js לא טען אותו ב-build time!

**למה זה קורה:**
- Next.js טוען `NEXT_PUBLIC_*` Environment Variables **רק ב-build time**
- אם הוספת את ה-Environment Variable **אחרי** ה-build, הוא לא נטען
- צריך **rebuild** את ה-service

---

## ✅ הפתרון:

### שלב 1: ודא שה-Environment Variable מוגדר

1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **ודא שיש:**
   ```
   NEXT_PUBLIC_API_URL=https://furniture-api-m8r9.onrender.com/api
   ```
   (ודא שזה מסתיים ב-`/api`!)

### שלב 2: Manual Deploy (Rebuild)

1. **Render Dashboard** → **`furniture-web`** → **"Manual Deploy"**
2. **לחץ על "Deploy latest commit"**
3. **חכה 3-5 דקות** עד שה-build מסתיים
4. **בדוק את ה-Logs** - אמור לראות:
   ```
   ✓ Compiled successfully
   ✓ Ready in X.Xs
   ```

### שלב 3: בדוק שוב

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** → **"Console"**
3. **רענן את הדף** (Ctrl+Shift+R או Cmd+Shift+R - hard refresh)
4. **תראה:**
   ```
   🔧 API_BASE: https://furniture-api-m8r9.onrender.com/api
   ```
5. **נסה להתחבר** - אמור לעבוד!

---

## 🔍 איך לבדוק:

### בדוק את ה-Build Logs:

1. **Render Dashboard** → **`furniture-web`** → **"Logs"**
2. **גלול למעלה** עד שאתה רואה את ה-Build logs
3. **חפש:**
   ```
   ✓ Compiled successfully
   ✓ Ready in X.Xs
   ```
4. **אם אתה רואה שגיאות** - העתק אותן

### בדוק ב-Console:

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** → **"Console"**
3. **רענן את הדף** (Ctrl+Shift+R - hard refresh)
4. **תראה:**
   ```
   🔧 API_BASE: https://furniture-api-m8r9.onrender.com/api
   ```
   (ודא שזה מסתיים ב-`/api`!)

---

## 📋 Checklist:

- [ ] בדקתי את `NEXT_PUBLIC_API_URL` ב-Render - נכון (מסתיים ב-`/api`)
- [ ] עשיתי Manual Deploy של `furniture-web`
- [ ] ה-build הסתיים בהצלחה (חכה 3-5 דקות)
- [ ] רעננתי את הדף (Ctrl+Shift+R - hard refresh)
- [ ] בדקתי ב-Console - רואה `API_BASE: .../api`
- [ ] ניסיתי להתחבר - עובד!

---

## 🆘 אם עדיין לא עובד:

**שלח לי:**
1. **מה אתה רואה ב-Build Logs?**
   - העתק את כל השגיאות (אם יש)
2. **מה אתה רואה ב-Console?**
   - העתק את ההודעה עם `🔧 API_BASE:`
3. **מה ה-Request URL ב-Network tab?**
   - פתח F12 → Network
   - נסה להתחבר
   - לחץ על ה-request ל-`/auth/login`
   - מה ה-URL המלא?

---

**עשה Manual Deploy של `furniture-web` כדי לטעון את ה-Environment Variable!** 🎯

