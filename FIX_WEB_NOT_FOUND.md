# 🔧 תיקון: Web Service מחזיר "Not Found"

## הבעיה:
ה-Web service מחזיר "Not Found" ב-`/login` למרות שה-API עובד.

## מה לבדוק:

### שלב 1: בדוק את ה-Web Service Status

1. **Render Dashboard** → **"Resources"** → **`furniture-web`**
2. **בדוק את ה-Status:**
   - ✅ **"Live"** - ה-service רץ
   - ⚠️ **"Build failed"** - יש בעיה ב-build
   - ⚠️ **"Deploy failed"** - יש בעיה ב-deployment
   - ⚠️ **"Stopped"** - ה-service לא רץ

### שלב 2: בדוק את ה-Logs של Web

1. **Render Dashboard** → **`furniture-web`** → **"Logs"**
2. **חפש:**
   - ✅ `✓ Ready in X.Xs` - ה-Web רץ
   - ✅ `✓ Compiled /login` - ה-login route נבנה
   - ✅ `Route (app) /login` - ה-route קיים
   - ❌ `Error: ...` - יש שגיאה
   - ❌ `TypeError: Cannot read properties of undefined (reading 'clientModules')` - יש בעיה עם routing

### שלב 3: בדוק את ה-Build Logs

1. **Render Dashboard** → **`furniture-web`** → **"Events"**
2. **לחץ על ה-deployment האחרון**
3. **חפש:**
   - ✅ `✓ Compiled successfully` - ה-build הצליח
   - ✅ `Route (app) /login` - ה-route נבנה
   - ❌ `Error: ...` - יש שגיאה

### שלב 4: Manual Deploy

אם ה-service לא "Live":
1. **Render Dashboard** → **`furniture-web`** → **"Manual Deploy"**
2. **לחץ על "Deploy latest commit"**
3. **חכה 2-3 דקות**

### שלב 5: בדוק את ה-Environment Variables

1. **Render Dashboard** → **`furniture-web`** → **"Environment"**
2. **וודא שיש:**
   - ✅ `NEXT_PUBLIC_API_URL` = `https://furniture-api-m8r9.onrender.com/api`
   - ✅ `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
   - ✅ `NODE_ENV` = `production`
   - ✅ `PORT` = `3000`

---

## 🔍 אם ה-Build נכשל:

### שגיאה נפוצה: `TypeError: Cannot read properties of undefined (reading 'clientModules')`

**זה אומר שיש בעיה עם Next.js routing.**

**פתרון:**
1. **ודא שה-root layout הוא synchronous** (לא async)
2. **ודא שאין קריאות API ב-root layout**
3. **ודא שה-login layout קיים ונכון**

---

## 🔍 אם ה-Service רץ אבל עדיין "Not Found":

### בדוק את ה-URL:
- ✅ **נכון:** `https://furniture-web-7d3o.onrender.com/login`
- ❌ **שגוי:** `https://furniture-web-7d3o.onrender.com/api/login` (זה לא API!)

### בדוק את ה-Port:
- **Render Dashboard** → **`furniture-web`** → **"Settings"**
- **ודא שה-Port מוגדר:** `3000`

---

## 📝 מה לשלוח לי:

אם עדיין לא עובד, שלח לי:
1. **מה ה-Status של `furniture-web`?** (Live / Build failed / Deploy failed)
2. **מה אתה רואה ב-Logs?** (העתק את השגיאה המדויקת)
3. **מה אתה רואה ב-Build Logs?** (העתק את השגיאה המדויקת)

---

## 🎯 צעדים מהירים:

1. **Render Dashboard** → **`furniture-web`** → **"Manual Deploy"**
2. **לחץ "Deploy latest commit"**
3. **חכה 2-3 דקות**
4. **בדוק את ה-Logs**
5. **נסה שוב:** `https://furniture-web-7d3o.onrender.com/login`

---

**הבעיה היא כנראה שה-Web service לא deployed או לא רץ!** 🔍

