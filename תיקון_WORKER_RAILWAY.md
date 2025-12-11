# 🔧 תיקון Worker Service ב-Railway

## 🔴 הבעיה:

ה-Worker Service נכשל ב-Railway כי:
1. **REDIS_URL לא מוגדר** (חובה!)
2. **DATABASE_URL לא מוגדר** (אופציונלי, אבל מומלץ)
3. **Build/Start Commands לא מוגדרים נכון**

---

## ✅ פתרון:

### שלב 1: הגדר Environment Variables

**Railway Dashboard:**

1. **עבור ל-`@furniture/worker` Service**
2. **Variables** → **New Variable**

**הוסף את המשתנים הבאים:**

#### חובה:
- **`REDIS_URL`** = `redis://<redis-service-url>:6379`
  - **איך למצוא:** Dashboard → Redis Service → Settings → Connection → Copy את ה-URL

#### אופציונלי (אבל מומלץ):
- **`DATABASE_URL`** = `postgresql://...` (אותו URL כמו ב-API Service)
  - **איך למצוא:** Dashboard → PostgreSQL Service → Settings → Connection → Copy את ה-URL

---

### שלב 2: הגדר Build Command

**Railway Dashboard:**

1. **`@furniture/worker`** → **Settings** → **Build**
2. **Custom Build Command:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
   ```
3. **שמור**

---

### שלב 3: הגדר Start Command

**Railway Dashboard:**

1. **`@furniture/worker`** → **Settings** → **Deploy**
2. **Start Command:**
   ```
   pnpm --filter @furniture/worker start
   ```
3. **שמור**

---

### שלב 4: בדוק את ה-Logs

**Railway Dashboard:**

1. **`@furniture/worker`** → **Logs**
2. **חפש:**
   - ✅ `Worker up with queues: ocr, ai-reports, notifications`
   - ✅ `REDIS_URL: ✓ Set`
   - ✅ `All processors loaded successfully`

**אם יש שגיאות:**
- ❌ `ERROR: REDIS_URL environment variable is required` → צריך להוסיף REDIS_URL
- ❌ `Error loading processors` → צריך לבדוק את ה-Logs

---

## 📋 Checklist:

- [ ] **REDIS_URL** מוגדר ב-Variables
- [ ] **DATABASE_URL** מוגדר ב-Variables (אופציונלי)
- [ ] **Build Command** מוגדר: `pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate`
- [ ] **Start Command** מוגדר: `pnpm --filter @furniture/worker start`
- [ ] **Redeploy** את ה-Service
- [ ] **בדוק את ה-Logs** → וודא שהכל עובד

---

## 💡 איך למצוא את ה-URLs:

### Redis URL:
1. **Dashboard** → **Redis Service** (או **Upstash Redis**)
2. **Settings** → **Connection**
3. **Copy את ה-URL** (נראה כמו: `redis://default:password@host:6379`)

### Database URL:
1. **Dashboard** → **PostgreSQL Service**
2. **Settings** → **Connection**
3. **Copy את ה-URL** (נראה כמו: `postgresql://user:password@host:5432/dbname`)

---

## 🚀 אחרי התיקון:

**ה-Worker צריך לעבוד!**

**בדוק:**
- ✅ Logs מראים `Worker up with queues`
- ✅ אין שגיאות ב-Logs
- ✅ Service Status = "Running"

---

**בואו נתקן את זה עכשיו!**

