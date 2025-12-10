# התחלה מהירה - Railway

## ✅ Token כבר מוגדר!

ה-Token שלך כבר שמור בסקריפט. עכשיו:

### שלב 1: הרץ את הסקריפט האוטומטי

```powershell
pnpm railway:fix
```

**או:**
```powershell
.\fix-railway-auto.ps1
```

זה יגדיר את כל ה-Variables ויריץ Migrations.

---

### שלב 2: הגדרות ידניות ב-Dashboard

אחרי שהסקריפט רץ, פתח **Railway Dashboard**:

1. **Web Service → Variables:**
   - הוסף: `NEXT_PUBLIC_API_URL=https://<api-url>.railway.app/api`
   - (תעדכן אחרי שתקבל את ה-URL)

2. **API Service → Settings → Deploy → Pre-deploy step:**
   - הוסף: `pnpm --filter @furniture/prisma migrate deploy`

3. **API Service → Variables:**
   - הוסף: `JWT_SECRET=<create-secret>`
   - (הרץ: `openssl rand -hex 32`)

4. **API Service → Variables:**
   - הוסף: `FRONTEND_URL=https://<web-url>.railway.app`
   - (תעדכן אחרי שתקבל את ה-URL)

---

### שלב 3: פריסה

```powershell
pnpm deploy:api
pnpm deploy:web
```

---

## 🎯 הכל מוכן!

הרץ `pnpm railway:fix` והכל יתקן אוטומטית!

