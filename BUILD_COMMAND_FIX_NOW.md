# 🔧 תיקון מיידי: Build Command לא נשמר

## ✅ פתרון 1: השתמש ב-railway.toml (הכי פשוט!)

**הקובץ `railway.toml` כבר קיים ונכון!**

Railway אמור לקרוא את זה אוטומטית. **אם זה לא עובד, נסה:**

1. **Dashboard → `@furniture/web` → Settings → Source**
2. **וודא ש-"Auto Deploy" מופעל**
3. **לחץ "Redeploy"**

---

## ✅ פתרון 2: פרק את הפקודה (אם Dashboard לא שומר)

**במקום פקודה אחת ארוכה, פרק ל-3 חלקים:**

### חלק 1: Settings → Build → Build Command
```
pnpm install --frozen-lockfile
```

### חלק 2: Settings → Deploy → Pre-deploy step
```
pnpm --filter @furniture/prisma generate
```

### חלק 3: Settings → Deploy → Build Command (אם יש)
```
pnpm --filter @furniture/web build
```

### חלק 4: Settings → Deploy → Start Command
```
pnpm --filter @furniture/web start
```

---

## ✅ פתרון 3: נסה דרך "Deploy" במקום "Build"

**Dashboard → `@furniture/web` → Settings → Deploy:**

1. **מצא "Build Command" (לא ב-Build, אלא ב-Deploy)**
2. **הדבק:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
3. **שמור**

---

## ✅ פתרון 4: בדוק אם יש שגיאה

**כשאתה מנסה לשמור, האם יש:**
- ❌ הודעה אדומה?
- ❌ כפתור "Save" אפור/מושבת?
- ❌ שגיאת validation?

**אם כן, העתק את השגיאה המדויקת.**

---

## ✅ פתרון 5: נסה גרסה קצרה (לבדיקה)

**Build Command:**
```
pnpm install --frozen-lockfile
```

**שמור** → **ואז הוסף Pre-deploy:**
```
pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

---

## 💡 המלצה: השתמש ב-railway.toml

**הקובץ `railway.toml` כבר מוגדר נכון!**

**אם Railway לא קורא אותו:**
1. **Dashboard → Project Settings → Source**
2. **וודא ש-GitHub connected**
3. **Redeploy**

---

## 🔍 מה לבדוק עכשיו

1. **פתח `railway.toml`** - האם הוא קיים?
2. **Dashboard → `@furniture/web` → Settings → Source** - האם GitHub connected?
3. **נסה Redeploy** - האם זה עובד?

**אם זה עדיין לא עובד, שלח לי:**
- מה השגיאה המדויקת כשאתה מנסה לשמור?
- איפה אתה מנסה לשמור? (Build או Deploy?)

