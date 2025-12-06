# 🔧 תיקון: Unable to parse config file

## ❌ הבעיות שאתה רואה:

```
Unable to parse config file, regenerating
Service: None
Service "list" not found
```

**זה אומר:** Railway CLI לא מחובר לפרויקט או שיש בעיה בקונפיגורציה.

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

## ✅ פתרון 2: בדוק אם אתה מחובר

### הרץ:

```powershell
railway whoami
```

**אם אתה רואה את השם שלך** → אתה מחובר ✅

**אם אתה רואה שגיאה** → צריך להתחבר:
```powershell
railway login
```

---

## ✅ פתרון 3: רשימת Services (הפקודה הנכונה)

### הפקודה הנכונה:

```powershell
railway service
```

**לא** `railway service list` - זה לא עובד!

**זה יראה לך את כל ה-Services בפרויקט.**

---

## ✅ פתרון 4: בחר Service

### אם יש לך Services:

```powershell
railway service
```

**אז בחר Service:**
```powershell
railway service api
```

**או:**
```powershell
railway service "@furniture/api"
```

**זה יבחר את ה-Service ואז תוכל להריץ:**
```powershell
railway run pnpm --filter @furniture/prisma migrate deploy
```

---

## ✅ פתרון 5: דרך Dashboard (הקלה ביותר!)

**אם CLI לא עובד, פשוט השתמש ב-Dashboard:**

### Pre-deploy Step:

1. **Railway Dashboard** → **API Service**
2. **"Settings"** → **"Deploy"**
3. **"Pre-deploy step"** → **"+ Add pre-deploy step"**
4. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
5. **שמור**
6. **"Deployments"** → **"Redeploy"**

**זה יעבוד בלי CLI!**

---

## 📋 סדר פעולות מומלץ:

1. ✅ **`railway login`** - וודא שאתה מחובר
2. ✅ **`railway link`** - בחר את הפרויקט
3. ✅ **`railway service`** - ראה את רשימת Services
4. ✅ **`railway service api`** - בחר את ה-API Service
5. ✅ **`railway run pnpm --filter @furniture/prisma migrate deploy`** - הרץ Migrations

---

## 🎯 המלצה: השתמש ב-Dashboard!

**CLI יכול להיות מסובך. Dashboard יותר פשוט:**

1. **Dashboard** → **API Service** → **Settings** → **Deploy**
2. **Pre-deploy step** → **הוסף את הפקודה**
3. **Redeploy**

**זה יעבוד!**

---

## 🆘 עדיין לא עובד?

**שלח לי:**
1. מה מופיע כשרץ `railway whoami`?
2. מה מופיע כשרץ `railway link`?
3. מה מופיע כשרץ `railway service`?

**או פשוט השתמש ב-Dashboard - זה יותר פשוט!**

---

**התחל עם: `railway link` או פשוט השתמש ב-Dashboard!** 🚀

