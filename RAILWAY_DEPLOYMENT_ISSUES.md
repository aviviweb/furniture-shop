# פתרון בעיות פריסה ב-Railway

## בעיות שזוהו

1. **Web Build נכשל** - `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`
2. **API Pre-deploy Command נכשל** - "Pre-deploy command failed"
3. **Warnings** - 3 ב-Web, 4 ב-API

---

## פתרון 1: תיקון Web Build

### בעיה
ה-build נכשל ב-Railway למרות שעובד מקומי. זה יכול להיות בגלל:
- Environment variables חסרים ב-build time
- Prisma generate לא עובד
- Dependencies חסרים

### פתרון

#### שלב 1: וידוא Environment Variables ב-Web Service

**Railway Dashboard → `@furniture/web` Service → Variables:**

וודא שיש את כל המשתנים הבאים:

```
NEXT_PUBLIC_API_URL=https://<api-service-url>.railway.app/api
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

**⚠️ חשוב:** `NEXT_PUBLIC_*` variables **חייבים** להיות מוגדרים ב-build time!

#### שלב 2: וידוא Prisma Generate

**Railway Dashboard → `@furniture/web` Service → Settings → Build Command:**

וודא שהפקודה היא:
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

#### שלב 3: בדיקת Build Logs המלאים

1. **Railway Dashboard → `@furniture/web` Service → Deployments**
2. **לחץ על ה-deployment שנכשל** (האחד עם "FAILED")
3. **לחץ "View logs"** או "Logs"
4. **גלול למטה** - חפש את השגיאה המדויקת
5. **העתק את השגיאה** - זה יעזור לזהות את הבעיה

**שגיאות נפוצות:**
- `ERR_PNPM_*` - בעיית dependencies או lockfile
- `Cannot find module '@prisma/client'` - Prisma לא generated
- `Cannot find module '@furniture/*'` - workspace dependency לא נפתר
- `Type error: ...` - שגיאת TypeScript
- `Environment variable NEXT_PUBLIC_* is missing` - variable חסר

**⚠️ חשוב:** העתק את השגיאה המדויקת - כל שגיאה דורשת פתרון שונה!

#### שלב 4: Redeploy

אחרי תיקון Variables:
1. **Settings → Deployments → Redeploy**
2. **בחר branch → Deploy**
3. **חכה 3-5 דקות**

---

## פתרון 2: תיקון Pre-deploy Command

### בעיה
Pre-deploy command נכשל, מה שגורם ל-deployments להיכשל.

### פתרון

#### שלב 1: הגדרת Pre-deploy Step

**Railway Dashboard → `@furniture/api` Service → Settings → Deploy:**

1. **גלול למטה ל-"Pre-deploy step"**
2. **לחץ "+ Add pre-deploy step"** (או "Edit")
3. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
4. **שמור**

#### שלב 2: וידוא DATABASE_URL

**Railway Dashboard → `@furniture/api` Service → Variables:**

וודא שיש:
```
DATABASE_URL=<postgres-url-from-railway>
```

**אם אין:**
1. **Postgres Service → Variables → העתק `DATABASE_URL`**
2. **API Service → Variables → "+ New Variable"**
3. **Name:** `DATABASE_URL`
4. **Value:** הדבק מה-Postgres
5. **שמור**

#### שלב 3: הרצת Migrations ידנית (אם Pre-deploy עדיין נכשל)

**דרך CLI:**
```powershell
pnpm railway:migrate
```

**או דרך Dashboard:**
1. **API Service → Deployments → "New Deployment"**
2. **בחר "Run Command"** (אם זמין)
3. **הרץ:** `pnpm --filter @furniture/prisma migrate deploy`

#### שלב 4: Redeploy

אחרי תיקון Pre-deploy:
1. **Settings → Deployments → Redeploy**
2. **בחר branch → Deploy**
3. **חכה 3-5 דקות**

---

## פתרון 3: בדיקת Warnings

### איך לבדוק Warnings

**Railway Dashboard → Service → לחץ על ה-Warning Triangle:**

1. **API Service** - לחץ על ה-4 warnings
2. **Web Service** - לחץ על ה-3 warnings

**Warnings נפוצים:**
- Environment variables חסרים
- Port לא מוגדר
- Health check נכשל
- Resource limits

### תיקון Warnings

**לכל Warning:**
1. **קרא את ההודעה**
2. **עקוב אחרי ההוראות**
3. **תקן את הבעיה**
4. **Redeploy**

---

## Checklist מלא

### לפני פריסה:

- [ ] **Postgres Service Online** ✅
- [ ] **Redis Service Online** ✅
- [ ] **DATABASE_URL מוגדר ב-API Service**
- [ ] **REDIS_URL מוגדר ב-API Service**
- [ ] **NEXT_PUBLIC_* variables מוגדרים ב-Web Service**
- [ ] **Pre-deploy step מוגדר ב-API Service**
- [ ] **Build Command נכון ב-Web Service**
- [ ] **Start Command נכון בשני ה-services**

### אחרי פריסה:

- [ ] **API Service Online** ✅
- [ ] **Web Service Online** ✅
- [ ] **Worker Service Online** ✅
- [ ] **Health check עובד:** `https://<api-url>/api/health`
- [ ] **Web app נטען:** `https://<web-url>`
- [ ] **אין Warnings** (או לפחות פחות)

---

## פקודות שימושיות

```powershell
# בדיקת מצב
railway status

# Logs
pnpm railway:logs:api
pnpm railway:logs:web

# Migrations
pnpm railway:migrate

# פריסה
pnpm deploy:api
pnpm deploy:web
pnpm deploy:worker
```

---

## אם עדיין לא עובד

1. **בדוק Logs ב-Railway Dashboard**
2. **העתק את השגיאה המדויקת**
3. **בדוק את `RAILWAY_FIXES_SUMMARY.md`**
4. **בדוק את `RAILWAY_PRE_DEPLOY_SETUP.md`**

---

## הערות חשובות

- **NEXT_PUBLIC_* variables חייבים להיות מוגדרים ב-build time**
- **Pre-deploy step רץ לפני Build**
- **אם Pre-deploy נכשל, ה-deployment לא יתחיל**
- **Migrations רצות רק פעם אחת (idempotent)**
- **Warnings לא מונעים deployment, אבל כדאי לתקן**

