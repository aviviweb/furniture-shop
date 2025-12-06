# 🔐 תיקון: Unauthorized - צריך להתחבר

## ❌ השגיאה שאתה רואה:

```
Unauthorized. Please login with `railway login`
```

**זה אומר:** אתה לא מחובר ל-Railway CLI.

---

## ✅ פתרון 1: התחבר ל-Railway CLI

### שלב אחר שלב:

1. **ב-PowerShell, הרץ:**
   ```powershell
   railway login
   ```
2. **ייפתח דפדפן** → **התחבר ל-Railway**
3. **אחרי ההתחברות** → **חזור ל-PowerShell**
4. **עכשיו תוכל להריץ:**
   ```powershell
   railway link
   ```
5. **בחר את הפרויקט הנכון**

---

## ✅ פתרון 2: דרך Dashboard (הקלה ביותר!)

**CLI יכול להיות מסובך. Dashboard יותר פשוט:**

### Pre-deploy Step:

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **בחר את הפרויקט**
3. **לחץ על `@furniture/api` Service**
4. **"Settings"** → **"Deploy"**
5. **גלול למטה** → **"Pre-deploy step"**
6. **"+ Add pre-deploy step"**
7. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
8. **לחץ "Save"**
9. **חזור ל-"Deployments"** → **"Redeploy"**

**זה יעבוד בלי CLI!**

---

## ✅ פתרון 3: אחרי ההתחברות

### אחרי `railway login`:

1. **`railway link`** - בחר את הפרויקט
2. **`railway service`** - ראה את רשימת Services
3. **`railway service api`** - בחר את ה-API Service
4. **`railway run pnpm --filter @furniture/prisma migrate deploy`** - הרץ Migrations

---

## 🎯 המלצה: השתמש ב-Dashboard!

**CLI דורש:**
- ✅ התחברות (`railway login`)
- ✅ חיבור לפרויקט (`railway link`)
- ✅ בחירת Service (`railway service api`)
- ✅ הרצת פקודה (`railway run ...`)

**Dashboard דורש:**
- ✅ פתיחת Dashboard
- ✅ הוספת Pre-deploy step
- ✅ Redeploy

**Dashboard יותר פשוט!**

---

## 📋 Checklist:

- [ ] ניסיתי `railway login` והתחברתי
- [ ] ניסיתי `railway link` ובחרתי את הפרויקט
- [ ] אם עדיין לא עובד - השתמשתי ב-Dashboard (פתרון 2)

---

## 🆘 אם `railway login` לא עובד:

**נסה:**
```powershell
railway login --browserless
```

**או פשוט השתמש ב-Dashboard - זה יותר פשוט!**

---

**התחל עם: `railway login` או פשוט השתמש ב-Dashboard!** 🚀

