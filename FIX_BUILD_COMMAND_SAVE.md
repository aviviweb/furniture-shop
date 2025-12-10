# תיקון: Build Command לא נשמר

## 🔴 הבעיה
ה-Build Command לא נשמר ב-Railway Dashboard.

---

## ✅ פתרונות

### פתרון 1: בדוק את ה-Syntax

**הפקודה צריכה להיות בדיוק כך (העתק-הדבק):**

```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**⚠️ חשוב:**
- אין רווחים מיותרים
- אין שורות חדשות
- כל הפקודה בשורה אחת

---

### פתרון 2: נסה גרסה קצרה יותר

אם הפקודה הארוכה לא עובדת, נסה:

```
pnpm install --frozen-lockfile
```

**שמור** → ואז הוסף Pre-deploy step:

**Settings → Deploy → Pre-deploy step:**
```
pnpm --filter @furniture/prisma generate
```

**ואז Build Command:**
```
pnpm --filter @furniture/web build
```

---

### פתרון 3: השתמש ב-Raw Editor

**Dashboard → `@furniture/web` → Variables:**

1. לחץ **"{} Raw Editor"**
2. חפש את ה-Build Command שם
3. עדכן שם
4. שמור

---

### פתרון 4: בדוק את ה-railway.toml

**קובץ:** `railway.toml`

**וודא שהשורה נכונה:**
```toml
[services.web]
path = "."
build = "pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build"
start = "pnpm --filter @furniture/web start"
```

**אם זה נכון, Railway אמור לקרוא מכאן.**

---

### פתרון 5: נסה דרך Settings → Deploy

**Dashboard → `@furniture/web` → Settings → Deploy:**

1. **Build Command** (לא ב-Build, אלא ב-Deploy)
2. הדבק את הפקודה
3. שמור

---

## 🔍 מה לבדוק

1. **אין שגיאת syntax?** - בדוק שאין תווים מיוחדים
2. **הפקודה לא ארוכה מדי?** - נסה לפרק ל-Pre-deploy
3. **יש כפתור "Save"?** - לחץ עליו
4. **יש שגיאה אדומה?** - קרא את ההודעה

---

## 💡 פתרון מומלץ

**פרק את הפקודה:**

**Settings → Build:**
```
pnpm install --frozen-lockfile
```

**Settings → Deploy → Pre-deploy step:**
```
pnpm --filter @furniture/prisma generate
```

**Settings → Deploy → Start Command:**
```
pnpm --filter @furniture/web start
```

**Build Command (ב-Deploy, לא ב-Build):**
```
pnpm --filter @furniture/web build
```

---

**נסה את הפתרון 5 - זה הכי אמין!**

