# תיקון מהיר - Deployment שנכשל

## ⚡ תיקון מהיר ב-3 צעדים:

### 1. בדוק את ה-Logs
- Dashboard → בחר service שנכשל → Deployments → בחר deployment → Logs
- קרא את ה-error message

### 2. תקן את ה-Settings

#### API Service → Settings → Build & Deploy:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

**Start Command:**
```
pnpm --filter @furniture/api start
```

**Port:** `4000`

#### Web Service → Settings → Build & Deploy:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**Start Command:**
```
pnpm --filter @furniture/web start
```

**Port:** `3000`

### 3. בדוק Environment Variables

#### API Service → Variables:
```
DEMO_MODE=false
JWT_SECRET=<צור מפתח חזק>
PORT=4000
```

#### Web Service → Variables:
```
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_BRAND_NAME=Furniture Shop
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

### 4. Redeploy
- לחץ "Deploy" או "Redeploy"
- בחר `main` branch
- לחץ "Deploy"

✅ **סיימת!**

ראה `FIX_DEPLOYMENT_FAILURES.md` לפרטים נוספים.

