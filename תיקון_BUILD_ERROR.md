# 🔧 תיקון Build Error - "Rename pipeline field to tasks"

## 🔍 הבעיה:

Railway מריץ `pnpm run build` מהשורש במקום Build Command מ-`railway.toml`, מה שגורם לשגיאה:
```
Rename `pipeline` field to `tasks`
ELIFECYCLE Command failed with exit code 1
```

## ✅ פתרון:

### שלב 1: תיקון Build Command ב-Railway Dashboard

**חשוב:** Build Command חייב להיות מוגדר ב-Dashboard, לא רק ב-`railway.toml`!

#### API Service:

1. **Railway Dashboard** → **API Service** → **"Settings"** (משמאל)
2. **"Build"** → **"Custom Build Command"**
3. **הדבק את זה:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
   ```
4. **שמור**

#### Web Service:

1. **Railway Dashboard** → **Web Service** → **"Settings"** (משמאל)
2. **"Build"** → **"Custom Build Command"**
3. **הדבק את זה:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
4. **שמור**

#### Worker Service:

1. **Railway Dashboard** → **Worker Service** → **"Settings"** (משמאל)
2. **"Build"** → **"Custom Build Command"**
3. **הדבק את זה:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
   ```
4. **שמור**

---

### שלב 2: וודא ש-Start Command נכון

#### API Service:

1. **API Service** → **"Settings"** → **"Deploy"**
2. **"Custom Start Command"** → **וודא שזה:**
   ```
   pnpm --filter @furniture/api start
   ```
3. **אם זה לא נכון** → תקן ושמור

#### Web Service:

1. **Web Service** → **"Settings"** → **"Deploy"**
2. **"Custom Start Command"** → **וודא שזה:**
   ```
   pnpm --filter @furniture/web start
   ```
3. **אם זה לא נכון** → תקן ושמור

#### Worker Service:

1. **Worker Service** → **"Settings"** → **"Deploy"**
2. **"Custom Start Command"** → **וודא שזה:**
   ```
   pnpm --filter @furniture/worker start
   ```
3. **אם זה לא נכון** → תקן ושמור

---

### שלב 3: Redeploy

1. **כל Service** → **"Deployments"** → **"Redeploy"**
2. **בחר `main`** → **"Deploy"**
3. **חכה 3-5 דקות**

---

### שלב 4: בדוק Logs

1. **כל Service** → **"Logs"**
2. **חפש הודעות:**
   - ✅ `Build completed successfully`
   - ✅ `Deployment successful`
   - ❌ אם עדיין יש שגיאה → בדוק מה השגיאה

---

## 📋 Checklist:

- [ ] תיקנתי Build Command של API Service
- [ ] תיקנתי Build Command של Web Service
- [ ] תיקנתי Build Command של Worker Service
- [ ] וידאתי ש-Start Command נכון בכל ה-Services
- [ ] ביצעתי Redeploy לכל ה-Services
- [ ] בדקתי Logs - Build עבר בהצלחה

---

## 🆘 אם עדיין לא עובד:

### בדוק את ה-Logs:

1. **Service** → **"Logs"**
2. **העתק את השגיאה האחרונה**
3. **שלח לי** → אעזור לך לתקן

### שגיאות נפוצות:

**"Rename `pipeline` field to `tasks`"**
→ Build Command לא נכון או לא מוגדר ב-Dashboard

**"Command not found"**
→ פקודה לא נכונה ב-Build Command

**"Module not found"**
→ צריך להריץ `pnpm install` לפני Build

---

## 💡 טיפים:

1. **תמיד הגדר Build Command ב-Dashboard** - אל תסתמך רק על `railway.toml`
2. **וודא שהפקודות נכונות** - העתק-הדבק מהמדריך הזה
3. **חכה 3-5 דקות** אחרי Redeploy לפני שתבדוק Logs
4. **בדוק את ה-Logs** - זה יעזור לך לזהות בעיות

---

**התחל עם תיקון Build Command ב-Dashboard!** 🚀

