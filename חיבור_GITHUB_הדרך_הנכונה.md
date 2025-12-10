# 🔗 חיבור GitHub ל-Railway - הדרך הנכונה!

## ✅ הבנה חשובה:

**ב-Railway, GitHub לא מחובר דרך "Integrations"!**

GitHub מחובר דרך **הוספת Service חדש** או דרך **Service Settings**.

---

## 🎯 הפתרון הנכון:

### דרך 1: דרך כפתור "New" (הכי פשוט!)

1. **סגור את Project Settings** (לחץ X או חזור ל-Dashboard)
2. **ב-Dashboard הראשי** → לחץ **"New"** (כפתור כחול למעלה)
3. **בחר "GitHub Repo"** (לא "Empty Service")
4. **אם זה מבקש הרשאות:**
   - לחץ **"Authorize Railway"**
   - בחר את ה-repo `furniture-shop`
   - לחץ **"Install"** או **"Connect"**
5. **בחר את ה-repo** → בחר branch (`main`) → שמור

**זה יחבר את GitHub לפרויקט!**

---

### דרך 2: דרך Service Settings (אם יש Services קיימים)

אם יש לך Services שכבר קיימים:

1. **Dashboard** → בחר Service (למשל `@furniture/web`)
2. **Settings** → חפש **"Source"** או **"Repository"**
3. **אם יש "Connect GitHub"** → לחץ עליו
4. **בחר את ה-repo** → שמור

---

## 💡 למה זה חשוב?

### ✅ אם GitHub מחובר:
- Railway יכול לקרוא את הקוד מה-repo
- Railway יכול לקרוא את `railway.toml` אוטומטית
- Build Commands ב-`railway.toml` יעבדו אוטומטית
- Auto-deploy כשאתה עושה push ל-GitHub

### ❌ אם GitHub לא מחובר:
- צריך להגדיר Build Commands ידנית ב-Dashboard
- `railway.toml` לא נקרא אוטומטית
- צריך לעשות manual deploy

---

## 🎯 מה לעשות עכשיו:

1. **סגור את Project Settings**
2. **Dashboard** → לחץ **"New"** → **"GitHub Repo"**
3. **בחר את ה-repo** → שמור

**זה הכל! 🎉**

---

## 📝 הערה:

**"Integrations" ב-Railway זה רק ל-integrations חיצוניים** (כמו Vercel), לא ל-GitHub.

**GitHub זה חלק מה-Source של הפרויקט/Service, לא Integration!**

