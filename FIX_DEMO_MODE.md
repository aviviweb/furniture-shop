# 🔧 תיקון Demo Mode - הבעיה והפתרון

## 🎯 הבעיה:

מה שאתה רואה ב-Logs:
```
✅ API running on port 4000, Demo Mode: false
```

**זה אומר:** ה-API לא ב-demo mode, אז הוא **דוחה** סיסמאות plain text (כמו `changeme`).

**למה זה קורה:**
- ב-demo mode (`DEMO_MODE=true`): ה-API מאפשר סיסמאות plain text
- ב-production mode (`DEMO_MODE=false`): ה-API **דורש** סיסמאות מוצפנות (bcrypt)

---

## ✅ הפתרון:

### אפשרות 1: הפעל Demo Mode (מומלץ לבדיקה)

1. **Render Dashboard** → **`furniture-api`** → **"Environment"**
2. **הוסף או עדכן:**
   ```
   DEMO_MODE=true
   ```
3. **שמור** (Render יבצע restart אוטומטי)
4. **חכה 1-2 דקות** עד שה-service restart
5. **נסה להתחבר שוב**

### אפשרות 2: הצפן את הסיסמאות (לפרודקשן)

אם אתה רוצה להשתמש ב-production mode, צריך להצפין את הסיסמאות ב-database.

---

## 🔍 איך לבדוק:

### שלב 1: בדוק את ה-Environment Variables

1. **Render Dashboard** → **`furniture-api`** → **"Environment"**
2. **חפש:** `DEMO_MODE`
3. **אם אין:**
   - לחץ על **"Add Environment Variable"**
   - Key: `DEMO_MODE`
   - Value: `true`
   - לחץ **"Save Changes"**

### שלב 2: בדוק את ה-Logs אחרי ה-Restart

1. **Render Dashboard** → **`furniture-api`** → **"Logs"**
2. **חפש:**
   ```
   ✅ API running on port 4000, Demo Mode: true
   ```
   (עכשיו צריך להיות `true` במקום `false`)

### שלב 3: נסה להתחבר שוב

1. **פתח:** `https://furniture-web-7d3o.onrender.com/login`
2. **התחבר עם:**
   - Email: `super@platform.local`
   - Password: `changeme`
3. **אמור לעבוד!** ✅

---

## 📋 Checklist:

- [ ] `DEMO_MODE=true` מוגדר ב-`furniture-api` → Environment
- [ ] ה-service restart (חכה 1-2 דקות)
- [ ] ה-Logs מראים `Demo Mode: true`
- [ ] ניסיתי להתחבר והצליח

---

## 🆘 אם עדיין לא עובד:

**אחרי שהוספת `DEMO_MODE=true`:**

1. **בדוק את ה-Logs:**
   - Render Dashboard → `furniture-api` → Logs
   - חפש: `Demo Mode: true` (אמור להיות `true`)

2. **נסה להתחבר שוב:**
   - פתח Console (F12)
   - נסה להתחבר
   - תראה ב-Console את ה-error message המדויק

3. **שלח לי:**
   - מה אתה רואה ב-Logs? (`Demo Mode: true` או `false`?)
   - מה אתה רואה ב-Console? (העתק את ה-error message)

---

**זה אמור לפתור את הבעיה!** 🎯

