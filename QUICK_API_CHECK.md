# ⚡ בדיקה מהירה - API לא מגיב

## 🔍 מה לבדוק עכשיו

### 1. בדוק את ה-Status ב-Render

**Render Dashboard** → **furniture-api**

**מה אתה רואה?**
- ✅ **"Live"** (ירוק) = עובד
- ⏳ **"Deploying"** = עדיין ב-build
- ❌ **"Failed"** = נכשל
- ⏸️ **"Stopped"** = לא רץ

---

### 2. בדוק את ה-Logs

**Render Dashboard** → **furniture-api** → **"Logs"**

**חפש:**
- ✅ `✅ API running on port 4000` = עובד!
- ❌ `❌ DATABASE_URL is not set` = צריך להגדיר DATABASE_URL
- ❌ `❌ Migration failed` = בעיה ב-migrations
- ❌ `Error:` או `Exception:` = שגיאה

**העתק את השגיאה המדויקת** (אם יש)

---

### 3. נסה URL אחר

**בדפדפן, נסה:**
- `https://furniture-api-xxx.onrender.com/api` (ללא /health)
- **אמור לראות:** `API מוכן`

**אם גם זה לא עובד:**
- ה-API לא רץ בכלל
- בדוק את ה-Logs

---

## 🚨 אם ה-Status = "Failed" או "Stopped"

### פתרון מהיר:

1. **Render Dashboard** → **furniture-api** → **"Manual Deploy"**
2. **"Deploy latest commit"**
3. **חכה ל-Deploy** (2-5 דקות)
4. **בדוק שוב**

---

## 📋 מה לשלוח לי

**אם אתה רוצה שאעזור, שלח:**
1. **Status של furniture-api** (Live/Failed/Deploying)
2. **השגיאה האחרונה מה-Logs** (אם יש)
3. **מה אתה רואה כש-נסה לגשת ל-URL**

---

**התחל עם בדיקת ה-Status וה-Logs!** 🔍

