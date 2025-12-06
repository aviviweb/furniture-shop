# תיקון מיידי - מה לתקן עכשיו!

## 🔴 בעיה 1: Build Command לא נכון

**מה יש עכשיו:**
```
pnpm --filter @furniture/api build
```

**מה צריך להיות:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

### איך לתקן:

1. ב-Railway Dashboard → API Service → Settings → Build & Deploy
2. מצא **"Custom Build Command"**
3. מחק את: `pnpm --filter @furniture/api build`
4. הדבק את זה:
   ```
   pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
   ```
5. לחץ **"Save"**

## 🔴 בעיה 2: Custom Domain שגוי

**מה יש עכשיו:**
- Domain: `furniture-shop` (שגיאה: "Malformed Domain")

**מה לעשות:**
1. לחץ **"Cancel"** (אל תוסיף custom domain עכשיו)
2. השתמש ב-domain האוטומטי: `furnitureapi-production-ebea.up.railway.app`
3. זה יעבוד מצוין!

## ✅ מה כבר נכון:

- ✅ Start Command: `pnpm --filter @furniture/api start` - נכון!
- ✅ Watch Paths: `/apps/api/**` - בסדר
- ✅ Region: EU West - בסדר

## 🚀 אחרי התיקון:

1. **שמור את השינויים**
2. **Redeploy:**
   - לחץ "Deployments" → "Deploy" או "Redeploy"
   - בחר `main` → "Deploy"
3. **חכה** - זה יקח כמה דקות
4. **בדוק Logs** - אמור לעבוד עכשיו!

## 📝 סיכום:

**תקן רק את ה-Build Command** - זה הבעיה העיקרית!

**Build Command הנכון:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

**Start Command (כבר נכון):**
```
pnpm --filter @furniture/api start
```


