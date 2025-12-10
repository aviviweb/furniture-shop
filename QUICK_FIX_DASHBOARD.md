# תיקון מהיר דרך Dashboard - 10 דקות

## 🎯 מטרה
לתקן את כל בעיות Railway דרך Dashboard בלבד (בלי CLI).

---

## ✅ שלב 1: API Service (3 דקות)

### Build Command
**`@furniture/api` → Settings → Build:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

### Start Command
**`@furniture/api` → Settings → Deploy:**
```
pnpm --filter @furniture/api start
```

### Port
`4000`

### Pre-deploy Step
**`@furniture/api` → Settings → Deploy → Pre-deploy step:**
```
pnpm --filter @furniture/prisma migrate deploy
```

### Variables
**`@furniture/api` → Variables:**
- `DEMO_MODE` = `false`
- `JWT_SECRET` = `<generate>` (הרץ: `openssl rand -hex 32`)
- `PORT` = `4000`
- `FRONTEND_URL` = `https://<web-url>.railway.app` (אחרי קבלת Web URL)

**⚠️ איך לקבל את ה-Web URL:**
1. Dashboard → `@furniture/web` → Settings → Networking
2. לחץ "Generate Domain" (או העתק domain קיים)
3. העתק את ה-URL (בלי `/api`)
4. דוגמה: `https://furnitureweb-xxx.up.railway.app`

---

## ✅ שלב 2: Web Service (3 דקות)

### Build Command
**`@furniture/web` → Settings → Build:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

### Start Command
**`@furniture/web` → Settings → Deploy:**
```
pnpm --filter @furniture/web start
```

### Port
`3000`

### Variables (חובה!)
**`@furniture/web` → Variables:**
- `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
- `NEXT_PUBLIC_BRAND_NAME` = `Furniture Shop`
- `NEXT_PUBLIC_PRIMARY_COLOR` = `#0ea5e9`
- `NEXT_PUBLIC_DEMO_MODE` = `false`
- `NODE_ENV` = `production`
- `PORT` = `3000`
- `NEXT_PUBLIC_API_URL` = `https://<api-url>.railway.app/api` 

**⚠️ איך לקבל את ה-API URL:**
1. Dashboard → `@furniture/api` → Settings → Networking
2. לחץ "Generate Domain" (או העתק domain קיים)
3. העתק את ה-URL
4. הוסף `/api` בסוף
5. דוגמה: אם ה-URL הוא `https://furnitureapi-xxx.up.railway.app`, אז תמלא: `https://furnitureapi-xxx.up.railway.app/api`

---

## ✅ שלב 3: Worker Service (1 דקה)

### Build Command
**`@furniture/worker` → Settings → Build:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
```

### Start Command
**`@furniture/worker` → Settings → Deploy:**
```
pnpm --filter @furniture/worker start
```

---

## ✅ שלב 4: Redeploy (2 דקות)

**Dashboard → כל Service → Deployments → "Redeploy"**

---

## ✅ שלב 5: עדכון URLs (1 דקה)

**ראה `HOW_TO_GET_URLS.md` להוראות מפורטות!**

**בקצרה:**
1. **קבל API URL:** Dashboard → `@furniture/api` → Settings → Networking → העתק URL
2. **קבל Web URL:** Dashboard → `@furniture/web` → Settings → Networking → העתק URL
3. **עדכן Variables:**
   - **API → Variables:** `FRONTEND_URL` = `<web-url>` (בלי `/api`)
   - **Web → Variables:** `NEXT_PUBLIC_API_URL` = `<api-url>/api` (עם `/api`)
4. **Redeploy** שניהם

---

## ✅ סיימת!

**ראה `RAILWAY_FIX_NOW.md` לפרטים מלאים**

