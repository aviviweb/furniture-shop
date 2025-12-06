# 🔧 תיקון Worker Service

## 🔍 הבעיה:

ה-Worker Service קורס כי הוא צריך `REDIS_URL` ולא מוגדר.

## ✅ פתרון:

### שלב 1: בדוק אם Redis Service קיים

1. **Railway Dashboard** → **רשימת Services**
2. **חפש "Redis"** → **אמור להיות Online** ✅

אם אין Redis Service:
- **"+ New"** → **"Database"** → **"Add Redis"**
- **חכה 1-2 דקות** עד ש-Redis יעלה

---

### שלב 2: העתק REDIS_URL מ-Redis Service

1. **Redis Service** → **"Variables"** (משמאל)
2. **חפש `REDIS_URL`** → **לחץ עליו** → **העתק** (Ctrl+C)

**הערה:** אם אין `REDIS_URL`, חפש `REDISCLOUD_URL` או `REDIS_HOST` + `REDIS_PORT`

---

### שלב 3: הגדר REDIS_URL ב-Worker Service

1. **Worker Service** → **"Variables"** (משמאל)
2. **"+ New Variable"** או **"Add Variable"**
3. **Name:** `REDIS_URL`
4. **Value:** הדבק את מה שהעתקת מ-Redis Service
5. **שמור**

---

### שלב 4: וודא שה-Build Command נכון

1. **Worker Service** → **"Settings"** → **"Build"**
2. **Custom Build Command** → **וודא שזה:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
   ```
3. **אם זה לא נכון** → תקן ושמור

---

### שלב 5: וודא שה-Start Command נכון

1. **Worker Service** → **"Settings"** → **"Deploy"**
2. **Custom Start Command** → **וודא שזה:**
   ```
   pnpm --filter @furniture/worker start
   ```
3. **אם זה לא נכון** → תקן ושמור

---

### שלב 6: Redeploy Worker Service

1. **Worker Service** → **"Deployments"** → **"Redeploy"**
2. **בחר `main`** → **"Deploy"**
3. **חכה 2-3 דקות**

---

### שלב 7: בדוק Logs

1. **Worker Service** → **"Logs"**
2. **חפש הודעות:**
   ```
   Worker up with queues: ocr, ai-reports, notifications
   REDIS_URL: ✓ Set
   All processors loaded successfully
   ```

**אם אתה רואה את זה** → Worker עובד! ✅

**אם אתה רואה:**
   ```
   ERROR: REDIS_URL environment variable is required
   ```
   → `REDIS_URL` עדיין לא מוגדר נכון

---

## 📋 Checklist:

- [ ] Redis Service קיים ו-Online
- [ ] העתקתי REDIS_URL מ-Redis Service
- [ ] הגדרתי REDIS_URL ב-Worker Service
- [ ] Build Command נכון
- [ ] Start Command נכון
- [ ] ביצעתי Redeploy
- [ ] בדקתי Logs - Worker עובד

---

## 🆘 אם עדיין לא עובד:

### בדוק את ה-Logs:

1. **Worker Service** → **"Logs"**
2. **העתק את השגיאה האחרונה**
3. **שלח לי** → אעזור לך לתקן

### שגיאות נפוצות:

**"ERROR: REDIS_URL environment variable is required"**
→ `REDIS_URL` לא מוגדר או לא נכון

**"Error loading processors"**
→ יש בעיה עם הקבצים ב-`processors/`

**"Connection refused"**
→ Redis Service לא עובד או `REDIS_URL` לא נכון

---

**התחל עם העתקת REDIS_URL מ-Redis Service והדבקתו ב-Worker Service!** 🚀

