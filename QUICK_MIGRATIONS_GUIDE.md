# ⚡ Quick Guide - Run Migrations

## 🚀 Fastest Way:

### Option 1: Railway Dashboard → Shell (2 minutes)

1. **Open:** https://railway.app
2. **Click:** Your Project → `@furniture/api` Service
3. **Click:** "Settings" → Scroll down → "Shell" (or "Command")
4. **Type:**
   ```bash
   pnpm --filter @furniture/prisma migrate:deploy
   ```
5. **Press Enter**
6. **Done!** ✅

---

### Option 2: Pre-deploy (Automatic - Best!)

1. **Railway Dashboard → API Service → Settings → Deploy**
2. **Find:** "Pre-deploy Command"
3. **Type:**
   ```
   pnpm --filter @furniture/prisma migrate:deploy
   ```
4. **Save**
5. **Redeploy** - Migrations will run automatically! ✅

---

## ❌ Don't Do This:

```powershell
# This won't work from your local computer! ❌
pnpm --filter @furniture/prisma migrate deploy
```

**Why?** Your local computer can't access Railway's internal database.

---

## ✅ Do This Instead:

**Run it INSIDE Railway Dashboard** - that's where the database is accessible!

---

**That's it! Choose one option above and you're done.**

