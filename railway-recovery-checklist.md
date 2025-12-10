# Railway Recovery Checklist - Step by Step

## Phase 1: Infrastructure Setup

### ✅ Step 1.1: Verify Railway Connection
- [ ] Run: `railway status`
- [ ] Should show: `Project: furniture-shop`
- [ ] If not: Token is set in `fix-railway-auto.ps1`

### ✅ Step 1.2: Verify Services Exist
**Railway Dashboard → Check Services:**
- [ ] `@furniture/api` exists
- [ ] `@furniture/web` exists
- [ ] `@furniture/worker` exists
- [ ] `Postgres` exists and Online
- [ ] `Redis` exists and Online

---

## Phase 2: API Service Configuration

### ✅ Step 2.1: Build & Start Commands
**Railway Dashboard → `@furniture/api` → Settings:**

- [ ] **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
  ```

- [ ] **Start Command:**
  ```
  pnpm --filter @furniture/api start
  ```

- [ ] **Port:** `4000`

### ✅ Step 2.2: Pre-deploy Step
**Railway Dashboard → `@furniture/api` → Settings → Deploy → Pre-deploy step:**

- [ ] **Command:**
  ```
  pnpm --filter @furniture/prisma migrate deploy
  ```

### ✅ Step 2.3: Environment Variables
**Railway Dashboard → `@furniture/api` → Variables:**

- [ ] `DEMO_MODE=false`
- [ ] `JWT_SECRET=<generate-with-openssl-rand-hex-32>`
- [ ] `PORT=4000`
- [ ] `DATABASE_URL` (auto from Postgres - verify exists)
- [ ] `REDIS_URL` (auto from Redis - verify exists)
- [ ] `FRONTEND_URL` (set after getting Web URL)

---

## Phase 3: Web Service Configuration

### ✅ Step 3.1: Build & Start Commands
**Railway Dashboard → `@furniture/web` → Settings:**

- [ ] **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
  ```

- [ ] **Start Command:**
  ```
  pnpm --filter @furniture/web start
  ```

- [ ] **Port:** `3000`

### ✅ Step 3.2: Environment Variables (CRITICAL!)
**Railway Dashboard → `@furniture/web` → Variables:**

- [ ] `NEXT_PUBLIC_API_URL=https://<api-url>.railway.app/api`
- [ ] `NEXT_PUBLIC_TENANT_ID=furniture-demo`
- [ ] `NEXT_PUBLIC_BRAND_NAME=Furniture Shop`
- [ ] `NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9`
- [ ] `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`

**⚠️ IMPORTANT:** All `NEXT_PUBLIC_*` variables MUST be set before build!

---

## Phase 4: Worker Service Configuration

### ✅ Step 4.1: Build & Start Commands
**Railway Dashboard → `@furniture/worker` → Settings:**

- [ ] **Build Command:**
  ```
  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
  ```

- [ ] **Start Command:**
  ```
  pnpm --filter @furniture/worker start
  ```

### ✅ Step 4.2: Environment Variables
**Railway Dashboard → `@furniture/worker` → Variables:**

- [ ] `REDIS_URL` (auto from Redis - verify exists)
- [ ] `DATABASE_URL` (optional)

---

## Phase 5: Database Migrations

### ✅ Step 5.1: Verify Pre-deploy Step
- [ ] Pre-deploy step is set in API Service
- [ ] Command: `pnpm --filter @furniture/prisma migrate deploy`

### ✅ Step 5.2: Run Migrations (if needed)
**Option A: Via Pre-deploy (automatic)**
- [ ] Deploy API Service - migrations will run automatically

**Option B: Via CLI**
```powershell
pnpm railway:migrate
```

**Option C: Via Dashboard**
- [ ] Railway Dashboard → `@furniture/api` → Deployments → "Run Command"
- [ ] Run: `pnpm --filter @furniture/prisma migrate deploy`

---

## Phase 6: Code Verification

### ✅ Step 6.1: PrismaService
- [ ] File: `apps/api/src/modules/prisma/prisma.service.ts`
- [ ] Has retry logic with exponential backoff
- [ ] Has connection pooling configuration

### ✅ Step 6.2: Health Check
- [ ] File: `apps/api/src/modules/app.controller.ts`
- [ ] Has `/api/health` endpoint

### ✅ Step 6.3: apiDelete
- [ ] File: `apps/web/lib/api.ts`
- [ ] Has `apiDelete` function

---

## Phase 7: Deployment

### ✅ Step 7.1: Deploy API
```powershell
pnpm deploy:api
```

**Verify:**
- [ ] Build succeeded
- [ ] Pre-deploy (migrations) succeeded
- [ ] Service is Online
- [ ] Health check works: `https://<api-url>/api/health`

### ✅ Step 7.2: Deploy Web
```powershell
pnpm deploy:web
```

**Verify:**
- [ ] Build succeeded
- [ ] Service is Online
- [ ] Web app loads: `https://<web-url>`

### ✅ Step 7.3: Deploy Worker
```powershell
pnpm deploy:worker
```

**Verify:**
- [ ] Build succeeded
- [ ] Service is Online

---

## Phase 8: Update URLs

### ✅ Step 8.1: Get URLs
**Railway Dashboard → Service → Settings → Networking:**
- [ ] API URL: `https://<api-service>.railway.app`
- [ ] Web URL: `https://<web-service>.railway.app`

### ✅ Step 8.2: Update Variables
**API Service → Variables:**
- [ ] `FRONTEND_URL=https://<web-service>.railway.app`

**Web Service → Variables:**
- [ ] `NEXT_PUBLIC_API_URL=https://<api-service>.railway.app/api`

### ✅ Step 8.3: Redeploy
- [ ] Redeploy API Service
- [ ] Redeploy Web Service

---

## Phase 9: Final Verification

### ✅ Step 9.1: Services Status
**Railway Dashboard:**
- [ ] Postgres: Online ✅
- [ ] Redis: Online ✅
- [ ] API: Online ✅
- [ ] Web: Online ✅
- [ ] Worker: Online ✅

### ✅ Step 9.2: Health Check
```powershell
curl https://<api-url>/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "demoMode": false,
  "services": {
    "api": "ok",
    "database": "ok"
  }
}
```

### ✅ Step 9.3: Logs Check
**Railway Dashboard → Service → Logs:**
- [ ] No ENOTFOUND errors
- [ ] "Database connected successfully"
- [ ] "API running on port 4000"
- [ ] "Web running on port 3000"

### ✅ Step 9.4: Application Test
- [ ] Web app loads: `https://<web-url>`
- [ ] API responds: `https://<api-url>/api/health`
- [ ] No build errors
- [ ] No runtime errors

---

## 🎯 Success Criteria

All of the following must be true:
- ✅ All services Online
- ✅ All builds succeed
- ✅ All migrations applied
- ✅ Health check returns "ok"
- ✅ Web app loads
- ✅ API responds
- ✅ No errors in logs
- ✅ No warnings (or minimal warnings)

---

## 📚 Reference Documents

- `RAILWAY_RECOVERY_PLAN.md` - Full recovery plan
- `RAILWAY_DEPLOYMENT_ISSUES.md` - Troubleshooting guide
- `FIX_WEB_BUILD_FAILURE.md` - Web build fixes
- `QUICK_FIX_RAILWAY.md` - Quick fixes
- `AUTO_FIX_README.md` - Auto-fix script guide

