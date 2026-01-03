# 🔧 תיקון שתי הבעיות

## 🎯 הבעיות:

1. **"Cannot POST /auth/login"** - ה-API URL לא מוגדר נכון ב-`furniture-web`
2. **`demoMode: false`** - צריך להגדיר `DEMO_MODE=true` ב-`furniture-api`

---

## ✅ פתרון 1: הגדר את ה-API URL ב-`furniture-web`

### שלב 1: הוסף את ה-Environment Variable

1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **לחץ על "Add Environment Variable"**
3. **הוסף:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://furniture-api-m8r9.onrender.com/api`
   (הוסף `/api` בסוף!)
4. **לחץ "Save Changes"**
5. **חכה 2-3 דקות** עד שה-service restart

### שלב 2: בדוק שזה עובד

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **לחץ F12** → **"Console"**
3. **נסה להתחבר**
4. **תראה ב-Console:**
   ```
   🔗 API POST: { url: 'https://furniture-api-m8r9.onrender.com/api/auth/login', ... }
   ```
   (אמור להראות את ה-URL הנכון!)

---

## ✅ פתרון 2: הפעל Demo Mode ב-`furniture-api`

### שלב 1: הוסף את ה-Environment Variable

1. **Render Dashboard** → **`furniture-api`** → **"Environment"**
2. **לחץ על "Add Environment Variable"** (או עדכן אם קיים)
3. **הוסף:**
   - **Key:** `DEMO_MODE`
   - **Value:** `true`
4. **לחץ "Save Changes"**
5. **חכה 2-3 דקות** עד שה-service restart

### שלב 2: בדוק שזה עובד

1. **פתח:** `https://furniture-api-m8r9.onrender.com/api/health`
2. **אמור לראות:**
   ```json
   {
     "status": "ok",
     "demoMode": true,  ← צריך להיות true!
     ...
   }
   ```

---

## 📋 Checklist:

### עבור `furniture-web`:
- [ ] הוספתי `NEXT_PUBLIC_API_URL=https://furniture-api-m8r9.onrender.com/api`
- [ ] ה-service restart (חכה 2-3 דקות)
- [ ] בדקתי ב-Console - רואה את ה-URL הנכון

### עבור `furniture-api`:
- [ ] הוספתי `DEMO_MODE=true`
- [ ] ה-service restart (חכה 2-3 דקות)
- [ ] בדקתי את `/api/health` - רואה `"demoMode": true`

---

## 🧪 בדיקה סופית:

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **התחבר עם:**
   - Email: `super@platform.local`
   - Password: `changeme`
3. **אמור לעבוד!** ✅

---

## 🆘 אם עדיין לא עובד:

**בדוק:**

1. **מה אתה רואה ב-Console?**
   - פתח F12 → Console
   - נסה להתחבר
   - העתק את ה-URL שאתה רואה ב-`🔗 API POST:`

2. **מה ה-Status ב-Network tab?**
   - פתח F12 → Network
   - נסה להתחבר
   - לחץ על ה-request ל-`/auth/login`
   - מה ה-Status? (200 / 404 / Failed)

3. **מה אתה רואה ב-`/api/health`?**
   - פתח: `https://furniture-api-m8r9.onrender.com/api/health`
   - מה ה-`demoMode`? (צריך להיות `true`)

---

**תקן את שתי הבעיות ואז נסה להתחבר שוב!** 🎯

