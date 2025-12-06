# 🗄️ איך להריץ Migrations בלי "Run Command"

## 🔍 מה שאתה רואה:

**ב-Deployments יש לך:**
- כפתור "Restart"
- תפריט עם 3 נקודות: "View logs", "Restart", "Redeploy", "Remove"
- **אבל אין "Run Command"**

**זה בסדר!** יש דרכים אחרות.

---

## ✅ דרך 1: Railway CLI (הקלה ביותר)

### אם יש לך Railway CLI:

```powershell
pnpm railway:migrate
```

**או:**
```powershell
pnpx --yes railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

**זה יריץ את ה-Migrations ישירות על Railway!**

---

## ✅ דרך 2: דרך Pre-deploy Step (אם אין CLI)

### שלב אחר שלב:

1. **API Service** → **"Settings"** (משמאל)
2. **"Deploy"** → **גלול למטה**
3. **"Pre-deploy step"** → **"+ Add pre-deploy step"**
4. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
5. **שמור**
6. **חזור ל-"Deployments"** → **"Redeploy"**

**⚠️ זה יריץ Migrations בכל Deployment!**

**אבל זה יעבוד!**

---

## ✅ דרך 3: דרך Shell של Deployment קיים

### נסה:

1. **Deployments** → **לחץ על ה-Deployment ה-CRASHED**
2. **ייפתח חלון עם פרטים**
3. **חפש כפתור "Shell"** או **"Terminal"** שם
4. **אם יש** → לחץ עליו והדבק:
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```

---

## ✅ דרך 4: דרך "View logs" → Shell

### נסה:

1. **Deployments** → **תפריט 3 נקודות** → **"View logs"**
2. **בחלון ה-Logs** → **חפש כפתור "Shell"** או **"Terminal"**
3. **אם יש** → לחץ והדבק את הפקודה

---

## 🎯 המלצה: השתמש ב-CLI

**הדרך הקלה ביותר:**

```powershell
pnpm railway:migrate
```

**אם זה לא עובד, נסה:**
```powershell
pnpx --yes railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

---

## 📋 Checklist:

- [ ] ניסיתי `pnpm railway:migrate`
- [ ] אם לא עבד - ניסיתי דרך Pre-deploy step
- [ ] אם עדיין לא - ניסיתי דרך Deployment קיים
- [ ] אם עדיין לא - ניסיתי דרך View logs

---

## 🆘 אם שום דבר לא עובד:

**אפשר לדלג על Migrations זמנית:**

1. **API Service** → **"Variables"**
2. **הוסף/תקן:**
   ```
   DEMO_MODE = true
   ```
3. **שמור** → **Restart**

**⚠️ זה רק לבדיקה! לא ל-production!**

**אבל זה יאפשר ל-API לעבוד בלי Database.**

---

**התחל עם: `pnpm railway:migrate`** 🚀

