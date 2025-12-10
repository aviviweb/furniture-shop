# 🔗 חיבור GitHub ל-Railway (כשאין אופציה Source)

## ✅ פתרון 1: חיבור דרך "New" → "GitHub Repo"

### שלב 1: הוסף Service חדש מ-GitHub
1. **Railway Dashboard** → הפרויקט שלך
2. **לחץ על "New"** (כפתור כחול למעלה)
3. **בחר "GitHub Repo"** (לא "Empty Service")
4. **אם זה מבקש הרשאות:**
   - לחץ **"Authorize Railway"**
   - בחר את ה-repo `furniture-shop`
   - לחץ **"Connect"**

### שלב 2: בחר את ה-Repo
1. **בחר את ה-repo שלך** (`furniture-shop`)
2. **בחר branch** (`main` או `master`)
3. **שם Service:** השאר את השם הקיים או שנה ל-`web`/`api`/`worker`
4. **לחץ "Deploy"** או **"Connect"**

---

## ✅ פתרון 2: חיבור דרך Project Settings

### שלב 1: פתח Project Settings
1. **Railway Dashboard** → הפרויקט שלך
2. **לחץ על שם הפרויקט** (למעלה) או **"..."** → **"Settings"**
3. **חפש "Source"** או **"GitHub"** או **"Repository"**

### שלב 2: חבר את GitHub
1. **אם יש כפתור "Connect GitHub"** → לחץ עליו
2. **בחר את ה-repo**
3. **שמור**

---

## ✅ פתרון 3: חיבור דרך Service Settings

### אם יש לך Services שכבר קיימים:

1. **Dashboard** → בחר Service (למשל `@furniture/web`)
2. **Settings** → **"Source"** או **"Repository"**
3. **אם יש "Connect GitHub"** → לחץ עליו
4. **בחר את ה-repo** → שמור

---

## ✅ פתרון 4: חיבור דרך CLI (אם Dashboard לא עובד)

### שלב 1: התחבר ל-Railway
```powershell
railway login
```

### שלב 2: חבר לפרויקט
```powershell
railway link
```

### שלב 3: חבר ל-GitHub (אם יש אפשרות)
```powershell
railway connect
```

---

## 🔍 איך לדעת אם GitHub מחובר?

### סימנים ש-GitHub מחובר:
- ✅ יש כפתור "Redeploy" ב-Deployments
- ✅ יש אפשרות לבחור branch ב-Deployments
- ✅ יש אפשרות "Deploy from GitHub" ב-Deployments
- ✅ ב-Service Settings יש "Source" או "Repository"

### סימנים ש-GitHub לא מחובר:
- ❌ אין אפשרות לבחור branch
- ❌ אין כפתור "Redeploy"
- ❌ אין "Source" ב-Settings
- ❌ Build Commands לא נשמרים (כי `railway.toml` לא נקרא)

---

## 💡 פתרון זמני: עבוד בלי GitHub

**אם אתה לא יכול לחבר GitHub עכשיו:**

### הגדר Build Commands ידנית:

#### Web Service:
1. **Dashboard** → `@furniture/web` → **Settings** → **Build**
2. **Custom Build Command:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
3. **שמור**

#### API Service:
1. **Dashboard** → `@furniture/api` → **Settings** → **Build**
2. **Custom Build Command:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
   ```
3. **שמור**

---

## 🎯 מה לעשות עכשיו:

1. **Dashboard** → לחץ **"New"** → **"GitHub Repo"**
2. **אם זה לא מופיע** → נסה דרך **Project Settings** (למעלה)
3. **אם זה עדיין לא עובד** → הגדר Build Commands ידנית (פתרון זמני)

**תגיד לי מה אתה רואה כשלחצת על "New" - אילו אופציות יש לך?**

