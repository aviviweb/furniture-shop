# הרצת Migrations ב-Render - מדריך

## הבעיה
`preDeployCommand` לא נתמך ב-Free plan של Render, אז Migrations לא רצים אוטומטית.

## הפתרון: הרצת Migrations ידנית

### דרך 1: דרך Shell (אם יש)

1. **Render Dashboard** → **furniture-api** → **"Shell"** (בתפריט השמאלי)
2. **הרץ:**
   ```bash
   pnpm --filter @furniture/prisma migrate deploy
   ```

---

### דרך 2: דרך Manual Deploy עם Command

אם אין Shell, אפשר להריץ Migrations דרך Manual Deploy:

1. **Render Dashboard** → **furniture-api** → **"Manual Deploy"**
2. **בחר:** **"Deploy latest commit"**
3. **לפני ה-Deploy**, אפשר להוסיף command ב-Settings:
   - **Settings** → **Pre-deploy Command** (אם יש)
   - **הרץ:** `pnpm --filter @furniture/prisma migrate deploy`

**⚠️ הערה:** אם אין Pre-deploy Command ב-Free plan, צריך להריץ Migrations דרך Shell או דרך API.

---

### דרך 3: דרך API (אוטומטי)

ניתן להריץ Migrations דרך Render API:

```powershell
# הרץ את זה ב-PowerShell
$env:RENDER_API_KEY='your-api-key'
$serviceId='srv-d534ogshg0os738jnan0'  # Service ID של furniture-api

$headers = @{
    "Authorization" = "Bearer $env:RENDER_API_KEY"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Trigger deploy with command
$body = @{
    clearCache = "do_not_clear"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -Method Post -Body $body
```

---

### דרך 4: דרך render.yaml (לא עובד ב-Free plan)

ניסינו להוסיף `preDeployCommand` ל-`render.yaml`, אבל זה לא נתמך ב-Free plan.

---

## מה לעשות עכשיו:

### אופציה A: דרך Dashboard Shell (הכי פשוט)
1. **Render Dashboard** → **furniture-api** → **"Shell"**
2. **הרץ:** `pnpm --filter @furniture/prisma migrate deploy`

### אופציה B: דרך Manual Deploy
1. **Render Dashboard** → **furniture-api** → **"Manual Deploy"**
2. **בחר:** **"Deploy latest commit"**
3. אחרי ה-Deploy, Migrations לא ירוצו אוטומטית, אבל ה-API יעבוד

---

## בדיקה שהכל עובד:

1. **פתח:** `https://furniture-api-xxx.onrender.com/api/health`
2. **צריך לראות:** `{"status":"ok","services":{"api":"ok","database":"ok"}}`
3. אם `database` = `"error"` → Migrations לא רצו

---

**התחל עם דרך 1 (Shell) - זה הכי פשוט!**

