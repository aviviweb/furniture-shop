# 🚀 תיקון מקיף - Railway Deployment

## 📋 סקירה כללית

מדריך זה מסביר איך לתקן את כל הבעיות ב-Railway Deployment.

## 🔍 בעיות שזוהו:

1. **Build Command לא נכון** - Railway מריץ `pnpm run build` במקום Build Command מ-railway.toml
2. **Database Connection Error (P1001)** - API לא יכול להתחבר ל-PostgreSQL
3. **Worker Crashed** - Worker לא עובד
4. **API Crashed** - API לא עובד

---

## ✅ פתרון שלב אחר שלב

### שלב 1: הרצת סקריפט אוטומטי

**הדרך הקלה ביותר:**

```powershell
.\fix-railway.ps1
```

הסקריפט יבצע:
- ✅ בדיקת Environment Variables
- ✅ הגדרת Variables (אופציונלי)
- ✅ הרצת Migrations
- ✅ בדיקת Logs
- ✅ Redeploy Services

---

### שלב 2: תיקון Build/Start Commands (חייב דרך Dashboard)

#### API Service:

1. **Railway Dashboard** → **API Service** → **Settings** → **Build**
2. **Custom Build Command** → **הדבק:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
   ```
3. **Settings** → **Deploy** → **Custom Start Command** → **הדבק:**
   ```
   pnpm --filter @furniture/api start
   ```

#### Web Service:

1. **Railway Dashboard** → **Web Service** → **Settings** → **Build**
2. **Custom Build Command** → **הדבק:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
   ```
3. **Settings** → **Deploy** → **Custom Start Command** → **הדבק:**
   ```
   pnpm --filter @furniture/web start
   ```

#### Worker Service:

1. **Railway Dashboard** → **Worker Service** → **Settings** → **Build**
2. **Custom Build Command** → **הדבק:**
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
   ```
3. **Settings** → **Deploy** → **Custom Start Command** → **הדבק:**
   ```
   pnpm --filter @furniture/worker start
   ```

---

### שלב 3: הוספת Pre-deploy Step (חייב דרך Dashboard)

1. **API Service** → **Settings** → **Deploy**
2. **Pre-deploy step** → **"+ Add pre-deploy step"**
3. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
4. **שמור**

**זה יריץ Migrations לפני כל Deployment!**

---

### שלב 4: תיקון Environment Variables

#### דרך Dashboard (מומלץ):

1. **PostgreSQL Service** → **Variables** → **חפש `DATABASE_URL`** → **העתק**
2. **API Service** → **Variables** → **חפש `DATABASE_URL`** → **ערוך** → **הדבק**
3. **API Service** → **Variables** → **חפש `DEMO_MODE`** → **ערוך** → **החלף ל-`false`**
4. **API Service** → **Variables** → **חפש `FRONTEND_URL`** → **ערוך** → **הזן URL של Web Service**
5. **Web Service** → **Variables** → **חפש `NEXT_PUBLIC_API_URL`** → **ערוך** → **הזן URL של API Service + /api**

#### דרך CLI:

```powershell
# הגדר DEMO_MODE=false
pnpm dlx railway variables set DEMO_MODE=false --service api

# הגדר FRONTEND_URL (החלף ב-URL האמיתי)
pnpm dlx railway variables set FRONTEND_URL=https://your-web.railway.app --service api

# הגדר NEXT_PUBLIC_API_URL (החלף ב-URL האמיתי)
pnpm dlx railway variables set NEXT_PUBLIC_API_URL=https://your-api.railway.app/api --service web
```

---

### שלב 5: הרצת Migrations

#### דרך CLI:

```powershell
# הרץ Migrations
pnpm railway:migrate
```

#### דרך Dashboard:

1. **API Service** → **Deployments** → **לחץ על Deployment אחרון**
2. **"Run Command"** או **"Shell"**
3. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```

---

### שלב 6: Redeploy Services

#### דרך CLI:

```powershell
# Redeploy API Service
pnpm deploy:api

# Redeploy Web Service
pnpm deploy:web

# Redeploy Worker Service
pnpm deploy:worker

# Redeploy הכל
pnpm deploy:all
```

#### דרך Dashboard:

1. **כל Service** → **Deployments** → **"Redeploy"**
2. **בחר `main`** → **"Deploy"**
3. **חכה 3-5 דקות**

---

### שלב 7: בדיקת Logs

#### דרך CLI:

```powershell
# בדוק Logs של API Service
pnpm railway:logs:api

# בדוק Logs של Web Service
pnpm railway:logs:web

# בדוק Logs של Worker Service
pnpm railway:logs:worker
```

#### דרך Dashboard:

1. **כל Service** → **"Logs"**
2. **חפש שגיאות** (אדום)
3. **חפש הודעות הצלחה** (ירוק)

---

## 📋 Checklist מלא

### Dashboard (חייב):

- [ ] תיקנתי Build Command של API Service
- [ ] תיקנתי Start Command של API Service
- [ ] תיקנתי Build Command של Web Service
- [ ] תיקנתי Start Command של Web Service
- [ ] תיקנתי Build Command של Worker Service
- [ ] תיקנתי Start Command של Worker Service
- [ ] הוספתי Pre-deploy step ל-API Service
- [ ] העתקתי DATABASE_URL מ-PostgreSQL ל-API Service
- [ ] הגדרתי DEMO_MODE=false ב-API Service
- [ ] הגדרתי FRONTEND_URL ב-API Service
- [ ] הגדרתי NEXT_PUBLIC_API_URL ב-Web Service

### CLI (אופציונלי):

- [ ] הרצתי Migrations (`pnpm railway:migrate`)
- [ ] בדקתי Logs של כל ה-Services
- [ ] ביצעתי Redeploy לכל ה-Services

---

## 🆘 פתרון בעיות

### שגיאה: "Can't reach database server" (P1001)

**פתרון:**
1. וודא ש-PostgreSQL Service עובד (Online)
2. וודא ש-DATABASE_URL זהה ב-PostgreSQL ו-API Services
3. וודא ש-Migrations הורצו
4. בדוק Logs של PostgreSQL Service

### שגיאה: "Rename `pipeline` field to `tasks`"

**פתרון:**
1. וודא ש-Build Command נכון ב-Dashboard
2. וודא ש-`turbo.json` משתמש ב-`tasks` ולא `pipeline` (כבר נכון)
3. Redeploy את ה-Service

### שגיאה: "Service not found"

**פתרון:**
1. וודא שאתה מחובר ל-Railway CLI:
   ```powershell
   pnpm dlx railway login
   ```
2. וודא שהפרויקט מקושר:
   ```powershell
   pnpm dlx railway link
   ```

### שגיאה: "Unauthorized" או "Login session does not exist"

**פתרון:**
1. התחבר מחדש:
   ```powershell
   pnpm dlx railway login --browserless
   ```
2. או הגדר RAILWAY_TOKEN:
   ```powershell
   $env:RAILWAY_TOKEN="your-token-here"
   ```

---

## 🎯 סדר ביצוע מומלץ:

1. ✅ **הרץ את הסקריפט:** `.\fix-railway.ps1`
2. ✅ **תקן Build/Start Commands דרך Dashboard**
3. ✅ **הוסף Pre-deploy Step דרך Dashboard**
4. ✅ **תקן Environment Variables (Dashboard או CLI)**
5. ✅ **הרץ Migrations (CLI או Dashboard)**
6. ✅ **Redeploy כל ה-Services**
7. ✅ **בדוק Logs**

---

## 📞 עזרה נוספת

אם עדיין יש בעיות:

1. **בדוק את ה-Logs** - זה יעזור לזהות את הבעיה המדויקת
2. **וודא שכל ה-Services Online** - Redis, Postgres, Web
3. **וודא ש-Environment Variables נכונים** - במיוחד DATABASE_URL
4. **וודא ש-Migrations הורצו** - זה קריטי!

---

**התחל עם הרצת הסקריפט: `.\fix-railway.ps1`** 🚀

