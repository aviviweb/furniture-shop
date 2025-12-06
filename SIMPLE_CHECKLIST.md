# רשימת בדיקה פשוטה - פריסה ל-Railway

## ✅ API Service

- [ ] Settings → Build Command: `pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build`
- [ ] Settings → Start Command: `pnpm --filter @furniture/api start`
- [ ] Settings → Port: `4000`
- [ ] Variables → `DEMO_MODE` = `false`
- [ ] Variables → `PORT` = `4000`
- [ ] Variables → `JWT_SECRET` = (מפתח כלשהו)
- [ ] Variables → `DATABASE_URL` = (אוטומטי)
- [ ] Variables → `REDIS_URL` = (אוטומטי)
- [ ] Deployments → לחץ "Deploy" → בחר `main` → לחץ "Deploy"
- [ ] בדוק Logs - אמור לעבוד!

## ✅ Web Service

- [ ] Settings → Build Command: `pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build`
- [ ] Settings → Start Command: `pnpm --filter @furniture/web start`
- [ ] Settings → Port: `3000`
- [ ] Variables → `NEXT_PUBLIC_TENANT_ID` = `furniture-demo`
- [ ] Variables → `NEXT_PUBLIC_BRAND_NAME` = `Furniture Shop`
- [ ] Variables → `NEXT_PUBLIC_PRIMARY_COLOR` = `#0ea5e9`
- [ ] Variables → `NEXT_PUBLIC_DEMO_MODE` = `false`
- [ ] Variables → `NODE_ENV` = `production`
- [ ] Variables → `PORT` = `3000`
- [ ] Deployments → לחץ "Deploy" → בחר `main` → לחץ "Deploy"
- [ ] בדוק Logs - אמור לעבוד!

## ✅ אחרי ששניהם עובדים:

- [ ] קבל URLs: Settings → Networking → Generate Domain
- [ ] עדכן `FRONTEND_URL` ב-API service
- [ ] עדכן `NEXT_PUBLIC_API_URL` ב-Web service
- [ ] Redeploy את שני ה-services

## 🎉 סיימת!


