# הוראות ביצוע - תוכנית שיקום Railway

## ✅ מצב נוכחי

- **Railway Token:** מוגדר ב-`fix-railway-auto.ps1`
- **Project:** מקושר (`furniture-shop`)
- **Environment:** production

---

## 🚀 ביצוע מהיר

### אופציה 1: סקריפט אוטומטי (מומלץ)

```powershell
pnpm railway:fix
```

**הסקריפט יבצע:**
- ✅ הגדרת Variables ל-API ו-Web
- ✅ הרצת Migrations
- ✅ הצגת הוראות לשלבים ידניים

---

### אופציה 2: ביצוע ידני

**עקוב אחרי `railway-recovery-checklist.md` שלב אחר שלב**

---

## 📋 מה צריך לעשות ידנית ב-Railway Dashboard

### 1. API Service → Settings → Build
**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

**Start Command:**
```
pnpm --filter @furniture/api start
```

**Port:** `4000`

### 2. API Service → Settings → Deploy → Pre-deploy step
```
pnpm --filter @furniture/prisma migrate deploy
```

### 3. API Service → Variables
- `DEMO_MODE=false`
- `JWT_SECRET=<generate>` (הרץ: `openssl rand -hex 32`)
- `PORT=4000`
- `FRONTEND_URL` (אחרי קבלת Web URL)

### 4. Web Service → Settings → Build
**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**Start Command:**
```
pnpm --filter @furniture/web start
```

**Port:** `3000`

### 5. Web Service → Variables (חובה!)
- `NEXT_PUBLIC_API_URL=https://<api-url>.railway.app/api`
- `NEXT_PUBLIC_TENANT_ID=furniture-demo`
- `NEXT_PUBLIC_BRAND_NAME=Furniture Shop`
- `NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9`
- `NEXT_PUBLIC_DEMO_MODE=false`
- `NODE_ENV=production`
- `PORT=3000`

### 6. Worker Service → Settings → Build
**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
```

**Start Command:**
```
pnpm --filter @furniture/worker start
```

---

## 🎯 סדר ביצוע מומלץ

1. **הרץ סקריפט אוטומטי:** `pnpm railway:fix`
2. **תקן Build/Start Commands** ב-Dashboard (שלבים 1, 4, 6)
3. **הוסף Pre-deploy step** (שלב 2)
4. **הוסף Variables** (שלבים 3, 5)
5. **פרוס:** `pnpm deploy:api && pnpm deploy:web && pnpm deploy:worker`
6. **עדכן URLs** אחרי קבלתם (שלב 3, 5)
7. **Redeploy** Services

---

## ✅ בדיקות סופיות

- [ ] כל Services Online
- [ ] Health check עובד: `https://<api-url>/api/health`
- [ ] Web app נטען: `https://<web-url>`
- [ ] אין Build errors
- [ ] אין Runtime errors

---

**ראה `railway-recovery-checklist.md` לפרטים מלאים**

