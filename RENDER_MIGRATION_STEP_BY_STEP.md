# העברה ל-Render.com - צעד אחר צעד

## שלב 1: יצירת Render Account

### מה לעשות:
1. **פתח דפדפן** → לך ל: https://render.com
2. **לחץ:** "Get Started for Free" או "Sign Up"
3. **בחר:** "Sign up with GitHub"
4. **אשר את ההרשאות** ל-GitHub

### מה לבדוק:
- ✅ Account נוצר
- ✅ מחובר ל-GitHub
- ✅ Dashboard נפתח

---

## שלב 2: חיבור GitHub Repository

### מה לעשות:
1. **בדף הנוכחי** (Blueprint Instance) → לחץ על כפתור **"GitHub"** (הכפתור השחור עם לוגו GitHub)
2. **אם זה לא עובד:**
   - **Dashboard** → לחץ **"New +"** (למעלה משמאל)
   - **בחר:** **"Web Service"** (או כל Service אחר)
   - **Connect Repository:**
     - **Provider:** GitHub
     - **Repository:** בחר את ה-repository שלך (`aviviweb/furniture-shop` או השם המדויק)
     - **Branch:** `main`
     - **לחץ:** **"Connect"**

### מה לבדוק:
- ✅ GitHub מחובר
- ✅ רואה את ה-repository שלך
- ✅ יכול לבחור branch

**⚠️ חשוב:** אם אתה לא רואה את ה-repository, תצטרך לאשר הרשאות ל-Render ב-GitHub.

---

## שלב 3: יצירת PostgreSQL Database

### מה לעשות:
1. **Dashboard** → לחץ **"New +"** (למעלה משמאל)
2. **בחר:** **"PostgreSQL"**
3. **מלא:**
   - **Name:** `furniture-db`
   - **Database:** `furniture`
   - **User:** `furniture_user`
   - **Region:** בחר הקרוב אליך (למשל: `Frankfurt` או `Oregon`)
   - **PostgreSQL Version:** `16` (הכי חדש)
   - **Plan:** `Free` (או `Starter` אם צריך יותר)
4. **לחץ:** **"Create Database"**

### מה לבדוק:
- ✅ Database נוצר
- ✅ Status = "Available"
- ✅ יש Connection String

### מה להעתק:
1. **Dashboard** → **furniture-db** → **Connections**
2. **העתק את ה-`Internal Database URL`** (זה ה-`DATABASE_URL`)

**שמור את זה!** נצטרך את זה אחר כך.

---

## שלב 4: יצירת Redis Instance

### מה לעשות:
1. **Dashboard** → לחץ **"New +"**
2. **בחר:** **"Redis"**
3. **מלא:**
   - **Name:** `furniture-redis`
   - **Region:** אותו region כמו PostgreSQL
   - **Plan:** `Free` (או `Starter` אם צריך יותר)
4. **לחץ:** **"Create Redis"**

### מה לבדוק:
- ✅ Redis נוצר
- ✅ Status = "Available"
- ✅ יש Connection String

### מה להעתק:
1. **Dashboard** → **furniture-redis** → **Connections**
2. **העתק את ה-`Internal Redis URL`** (זה ה-`REDIS_URL`)

**שמור את זה!** נצטרך את זה אחר כך.

---

## שלב 5: הגדרת Web Service (Next.js)

### 4.1 יצירת Service
1. **Dashboard** → לחץ **"New +"**
2. **בחר:** **"Web Service"**
3. **Connect Repository:**
   - **Provider:** GitHub
   - **Repository:** בחר `aviviweb/furniture-shop`
   - **Branch:** `main`
   - **לחץ:** **"Connect"**

### 4.2 הגדרת Build
**מלא את הפרטים:**
- **Name:** `furniture-web`
- **Environment:** `Node`
- **Region:** אותו region כמו PostgreSQL
- **Branch:** `main`
- **Root Directory:** (השאר ריק - root)
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/web start
  ```
- **Plan:** `Free` (או `Starter` אם צריך יותר)

### 4.3 Environment Variables
**לחץ:** **"Advanced"** → **"Add Environment Variable"**

**הוסף:**
```
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

**⚠️ חשוב:** `NEXT_PUBLIC_API_URL` נוסיף אחרי שנתקן את ה-API Service!

### 4.4 Create Service
**לחץ:** **"Create Web Service"**

---

## שלב 6: הגדרת API Service (NestJS)

### 5.1 יצירת Service
1. **Dashboard** → לחץ **"New +"**
2. **בחר:** **"Web Service"**
3. **Connect Repository:**
   - **Repository:** אותו repo (`aviviweb/furniture-shop`)
   - **Branch:** `main`

### 5.2 הגדרת Build
**מלא:**
- **Name:** `furniture-api`
- **Environment:** `Node`
- **Region:** אותו region
- **Branch:** `main`
- **Root Directory:** (השאר ריק)
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/api start
  ```
- **Plan:** `Free` (או `Starter`)

### 5.3 Environment Variables
**הוסף:**
```
DEMO_MODE=false
JWT_SECRET=<generate: openssl rand -hex 32>
PORT=4000
DATABASE_URL=<העתק מ-PostgreSQL>
REDIS_URL=<העתק מ-Redis>
NODE_ENV=production
```

**⚠️ חשוב:** `FRONTEND_URL` נוסיף אחרי שנתקן את ה-Web Service!

### 5.4 Create Service
**לחץ:** **"Create Web Service"**

---

## שלב 7: הגדרת Worker Service

### 6.1 יצירת Service
1. **Dashboard** → לחץ **"New +"**
2. **בחר:** **"Background Worker"**
3. **Connect Repository:**
   - **Repository:** אותו repo
   - **Branch:** `main`

### 6.2 הגדרת Build
**מלא:**
- **Name:** `furniture-worker`
- **Environment:** `Node`
- **Region:** אותו region
- **Branch:** `main`
- **Root Directory:** (השאר ריק)
- **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
  ```
- **Start Command:**
  ```
  pnpm --filter @furniture/worker start
  ```
- **Plan:** `Free` (או `Starter`)

### 6.3 Environment Variables
**הוסף:**
```
REDIS_URL=<העתק מ-Redis>
DATABASE_URL=<העתק מ-PostgreSQL>
NODE_ENV=production
```

### 6.4 Create Service
**לחץ:** **"Create Background Worker"**

---

## שלב 8: הרצת Migrations

### דרך 1: דרך Shell (הכי קל)
1. **Dashboard** → **furniture-api** → **Shell** (בתפריט משמאל)
2. **הרץ:**
   ```bash
   pnpm --filter @furniture/prisma migrate deploy
   ```

### דרך 2: דרך Pre-deploy (אוטומטי)
1. **Dashboard** → **furniture-api** → **Settings**
2. **Pre-deploy Command:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
3. **שמור**

---

## שלב 9: עדכון URLs

### 8.1 קבלת URLs
1. **Dashboard** → **furniture-web** → **Settings**
2. **העתק את ה-URL** (נראה כמו: `https://furniture-web.onrender.com`)
3. **Dashboard** → **furniture-api** → **Settings**
4. **העתק את ה-URL** (נראה כמו: `https://furniture-api.onrender.com`)

### 8.2 עדכון Variables
**Web Service → Environment Variables:**
- **הוסף/עדכן:** `NEXT_PUBLIC_API_URL` = `https://furniture-api.onrender.com/api`

**API Service → Environment Variables:**
- **הוסף/עדכן:** `FRONTEND_URL` = `https://furniture-web.onrender.com`

---

## שלב 10: Deploy

1. **Web Service** → **Manual Deploy** → **Deploy latest commit**
2. **API Service** → **Manual Deploy** → **Deploy latest commit**
3. **Worker Service** → **Manual Deploy** → **Deploy latest commit**

---

## בדיקות

### בדיקה 1: Web Service
- פתח: `https://furniture-web.onrender.com`
- צריך לראות את האפליקציה

### בדיקה 2: API Service
- פתח: `https://furniture-api.onrender.com/api/health`
- צריך לראות: `{"status":"ok",...}`

### בדיקה 3: Worker Service
- Dashboard → **furniture-worker** → **Logs**
- צריך לראות: `Worker up with queues: ocr, ai-reports, notifications`

---

**בואו נתחיל עם שלב 1 - יצירת Render Account!**


