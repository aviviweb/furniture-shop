# תיקון מהיר ל-Railway - 5 שלבים

## שלב 1: תיקון Web Build (2 דקות)

**Railway Dashboard → `@furniture/web` → Variables:**

הוסף/תקן:
```
NEXT_PUBLIC_API_URL=https://<api-url>.railway.app/api
NEXT_PUBLIC_TENANT_ID=furniture-demo
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
PORT=3000
```

**→ Redeploy**

---

## שלב 2: תיקון Pre-deploy (1 דקה)

**Railway Dashboard → `@furniture/api` → Settings → Deploy → Pre-deploy step:**

הוסף:
```
pnpm --filter @furniture/prisma migrate deploy
```

**→ שמור → Redeploy**

---

## שלב 3: וידוא DATABASE_URL (1 דקה)

**Railway Dashboard → `@furniture/api` → Variables:**

וודא שיש:
```
DATABASE_URL=<from-postgres-service>
```

**אם אין → העתק מ-Postgres Service → Variables**

---

## שלב 4: בדיקת Warnings (2 דקות)

**לחץ על ה-Warning Triangles:**
- **API Service** - 4 warnings
- **Web Service** - 3 warnings

**תקן לפי ההוראות**

---

## שלב 5: Redeploy הכל (3 דקות)

```powershell
pnpm deploy:api
pnpm deploy:web
```

**חכה 5 דקות → בדוק Logs**

---

## ✅ סיימת!

אם עדיין יש בעיות → ראה `RAILWAY_DEPLOYMENT_ISSUES.md`

