# 🔍 פתרון: בדיקת חיבור GitHub ל-Railway

## ✅ הפתרון הכי פשוט (2 דקות)

### שלב 1: פתח Railway Dashboard
1. היכנס ל-[railway.app](https://railway.app)
2. התחבר לחשבון שלך
3. בחר את הפרויקט `furniture-saas`

### שלב 2: בדוק את ה-Source
1. **לחץ על "Settings"** (בתפריט השמאלי)
2. **לחץ על "Source"** (בתפריט השמאלי, תחת Settings)
3. **בדוק מה כתוב:**

#### ✅ אם כתוב:
```
GitHub: furniture-shop
Branch: main (או master)
```
**→ GitHub מחובר! כל טוב! ✅**

#### ❌ אם כתוב:
```
No source connected
```
**→ GitHub לא מחובר! צריך לחבר!**

---

## 🔧 אם GitHub לא מחובר - תיקון מיידי:

### שלב 1: חבר את GitHub
1. **ב-"Source"** → לחץ **"Connect GitHub"** או **"New"**
2. **אם זה מבקש הרשאות:**
   - לחץ **"Authorize Railway"**
   - בחר את ה-repo `furniture-shop`
   - לחץ **"Connect"**

### שלב 2: בחר את ה-Repo
1. **בחר את ה-repo שלך** (`furniture-shop`)
2. **בחר branch** (בדרך כלל `main` או `master`)
3. **לחץ "Save"** או **"Connect"**

### שלב 3: וודא שהכל עובד
1. **חזור ל-"Deployments"**
2. **לחץ "Redeploy"** על כל service
3. **בדוק שה-Deployments מתחילים**

---

## 🎯 מה זה אומר?

### ✅ GitHub מחובר:
- Railway יכול לקרוא את הקוד מה-repo
- Railway יכול לקרוא את `railway.toml` אוטומטית
- Railway יכול לעשות auto-deploy כשאתה עושה push ל-GitHub
- **Build Commands ב-`railway.toml` יעבדו אוטומטית!**

### ❌ GitHub לא מחובר:
- Railway לא יכול לקרוא את הקוד מה-repo
- צריך להגדיר Build Commands ידנית ב-Dashboard
- `railway.toml` לא נקרא אוטומטית
- צריך לעשות manual deploy

---

## 💡 פתרון לבעיית Build Command:

**אם Build Command לא נשמר ב-Dashboard:**

### פתרון 1: חבר GitHub (מומלץ!)
אם GitHub מחובר, Railway יקרא את `railway.toml` אוטומטית, ואתה לא צריך להגדיר Build Commands ידנית!

### פתרון 2: אם לא רוצה לחבר GitHub
1. **Dashboard → `@furniture/web` → Settings → Build**
2. **הדבק את הפקודה:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
3. **אם זה לא נשמר, נסה דרך "Deploy":**
   - **Settings → Deploy → Build Command**
   - הדבק את הפקודה שם
   - שמור

---

## ✅ סיכום - מה לעשות עכשיו:

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **Settings → Source** → בדוק אם GitHub מחובר
3. **אם לא מחובר** → לחץ "Connect GitHub" → בחר repo → שמור
4. **Redeploy** את ה-services

**זה הכל! 🎉**

