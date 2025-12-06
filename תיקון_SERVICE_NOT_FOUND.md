# 🔧 תיקון: Service not found

## ❌ השגיאה שאתה רואה:

```
Service not found
```

**זה אומר:** Railway CLI לא מוצא את ה-Service "api".

---

## ✅ פתרון 1: וודא שאתה מחובר לפרויקט הנכון

### שלב אחר שלב:

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **בחר את הפרויקט שלך**
3. **ראה את שם ה-Service** - איך הוא נקרא?
   - `@furniture/api`?
   - `api`?
   - משהו אחר?

4. **ב-PowerShell, הרץ:**
   ```powershell
   railway link
   ```
5. **בחר את הפרויקט הנכון** מהרשימה

---

## ✅ פתרון 2: השתמש בשם הנכון של ה-Service

### אם ה-Service נקרא `@furniture/api`:

```powershell
railway run --service "@furniture/api" pnpm --filter @furniture/prisma migrate deploy
```

### אם ה-Service נקרא `api`:

```powershell
railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

### אם ה-Service נקרא משהו אחר:

**החלף `api` בשם האמיתי:**
```powershell
railway run --service "שם-השירות-האמיתי" pnpm --filter @furniture/prisma migrate deploy
```

---

## ✅ פתרון 3: רשימת Services

### איך לראות את כל ה-Services:

```powershell
railway status
```

**או:**
```powershell
railway service list
```

**זה יראה לך את כל ה-Services בפרויקט.**

---

## ✅ פתרון 4: דרך Dashboard (אם CLI לא עובד)

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

---

## 🔍 איך לדעת את שם ה-Service?

### דרך Dashboard:

1. **Railway Dashboard** → **בחר את הפרויקט**
2. **ראה את רשימת Services:**
   - `@furniture/api`
   - `@furniture/web`
   - `@furniture/worker`
   - `Postgres`
   - וכו'

**השם שאתה רואה שם = השם שצריך להשתמש בו!**

---

## 📋 Checklist:

- [ ] הרצתי `railway link` ובחרתי את הפרויקט הנכון
- [ ] בדקתי את שם ה-Service ב-Dashboard
- [ ] השתמשתי בשם הנכון בפקודה
- [ ] אם עדיין לא עובד - ניסיתי דרך Dashboard (Pre-deploy step)

---

## 🆘 עדיין לא עובד?

**שלח לי:**
1. מה שם ה-Service ב-Dashboard? (העתק בדיוק)
2. מה מופיע כשרץ `railway status`?
3. האם אתה מחובר לפרויקט הנכון? (`railway link`)

---

**התחל עם: `railway link` ובחר את הפרויקט הנכון!** 🔗

