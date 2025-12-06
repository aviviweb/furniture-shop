# 🚨 תיקון דחוף - Start Command לא נכון!

## ❌ הבעיה שאתה רואה:

**ב-"Custom Start Command" יש:**
```
pnpm --filter @furniture/prisma migrate deploy
```

**זה לא נכון!** זה פקודת Migrations, לא Start Command!

---

## ✅ מה צריך להיות:

**ב-"Custom Start Command" צריך להיות:**
```
pnpm --filter @furniture/api start
```

---

## 📝 איך לתקן (30 שניות):

1. **בשדה "Custom Start Command"** - מחק הכל (Ctrl+A, Delete)
2. **העתק את השורה הזו:**
   ```
   pnpm --filter @furniture/api start
   ```
3. **הדבק** (Ctrl+V)
4. **לחץ "Save"** (למטה)

---

## ⚠️ חשוב!

**Migrations לא רצים ב-Start Command!**

**Migrations רצים פעם אחת דרך "Run Command":**
1. **API Service** → **"Deployments"** → **"Run Command"**
2. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
3. **Enter** → חכה לסיום

**אבל Start Command צריך להיות:**
```
pnpm --filter @furniture/api start
```

---

## ✅ אחרי התיקון:

1. **לחץ "Save"**
2. **לחץ "Deployments"** (משמאל)
3. **לחץ "Redeploy"**
4. **בחר `main`** → **"Deploy"**
5. **חכה 3-5 דקות**

---

## 📋 סיכום:

**Start Command = מה שרץ כל פעם שהשירות מתחיל**
→ צריך להיות: `pnpm --filter @furniture/api start`

**Migrations = מה שרץ פעם אחת כדי להכין את ה-Database**
→ רצים דרך "Run Command", לא ב-Start Command!

---

**תקן את זה עכשיו!** 🚀

