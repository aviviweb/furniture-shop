# 🚫 איך לצאת ממצב דמו - מדריך מלא

## הבעיה
אם המערכת במצב דמו, לא ניתן לצאת ממנו דרך ה-UI כי:
1. `DEMO_MODE` environment variable קובע את מצב המערכת
2. אם `DEMO_MODE=true`, המערכת תמיד במצב דמו
3. `toggleDemoMode` לא עובד אם המערכת במצב דמו

---

## ✅ פתרון - 3 דרכים

### דרך 1: דרך Render Dashboard (המומלץ)

#### שלב 1: בדוק את Environment Variables
1. **Render Dashboard** → **furniture-api** → **"Environment"**
2. **חפש:** `DEMO_MODE`
3. **אם יש:**
   - **ערוך** → **הגדר ל:** `false`
   - **שמור**
4. **אם אין:**
   - **הוסף:** `DEMO_MODE` = `false`
   - **שמור**

#### שלב 2: בדוק את Web Service
1. **Render Dashboard** → **furniture-web** → **"Environment"**
2. **חפש:** `NEXT_PUBLIC_DEMO_MODE`
3. **אם יש:**
   - **ערוך** → **הגדר ל:** `false`
   - **שמור**
4. **אם אין:**
   - **הוסף:** `NEXT_PUBLIC_DEMO_MODE` = `false`
   - **שמור**

#### שלב 3: Redeploy
1. **furniture-api** → **"Manual Deploy"** → **"Deploy latest commit"**
2. **furniture-web** → **"Manual Deploy"** → **"Deploy latest commit"**

#### שלב 4: בדוק Logs
1. **furniture-api** → **"Logs"**
2. **חפש:** `✅ API running on port 4000, Demo Mode: false`
3. **אם אתה רואה `Demo Mode: false`** → זה עובד! ✅

---

### דרך 2: דרך render.yaml (אוטומטי)

הקוד כבר מוגדר ב-`render.yaml`:
```yaml
envVars:
  - key: DEMO_MODE
    value: "false"
  - key: NEXT_PUBLIC_DEMO_MODE
    value: "false"
```

**אם זה לא עובד:**
1. **Render Dashboard** → **Blueprints** → **furniture-shop**
2. **לחץ על "Manual sync"**
3. **חכה ל-Deploy**

---

### דרך 3: דרך Database (אם Company במצב דמו)

אם `DEMO_MODE=false` אבל Company עדיין במצב דמו:

#### דרך API (אם יש לך גישה):
```bash
PATCH /api/superadmin/toggleDemoMode
{
  "tenantId": "furniture-demo",
  "demo": false
}
```

#### דרך Database ישירות:
1. **Render Dashboard** → **furniture-db** → **"Connect"**
2. **הרץ:**
```sql
UPDATE "Company" 
SET "demoMode" = false 
WHERE "tenantId" = 'furniture-demo';
```

---

## 🔍 איך לבדוק שהכל עובד

### בדיקה 1: API Logs
1. **Render Dashboard** → **furniture-api** → **"Logs"**
2. **חפש:** `Demo Mode: false`
3. **אם אתה רואה `false`** → ✅ עובד!

### בדיקה 2: Health Endpoint
1. **פתח:** `https://furniture-api-xxx.onrender.com/api/health`
2. **צריך לראות:**
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

### בדיקה 3: Frontend Banner
1. **פתח:** את האפליקציה
2. **אם אתה לא רואה את ה-Banner "מצב דמו פעיל"** → ✅ עובד!

---

## ⚠️ בעיות נפוצות

### בעיה 1: עדיין רואה "מצב דמו פעיל"
**פתרון:**
1. בדוק ש-`DEMO_MODE=false` ב-API
2. בדוק ש-`NEXT_PUBLIC_DEMO_MODE=false` ב-Web
3. בדוק את ה-Company ב-DB: `demoMode` צריך להיות `false`
4. **רענן את הדף** (Ctrl+F5)

### בעיה 2: Company לא קיים ב-DB
**פתרון:**
1. **צור Company חדש:**
```sql
INSERT INTO "Company" (id, "tenantId", name, currency, "demoMode", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'furniture-demo',
  'Furniture Shop',
  'ILS',
  false,
  NOW(),
  NOW()
);
```

### בעיה 3: עדיין לא עובד אחרי הכל
**פתרון:**
1. **נקה את ה-Cache:**
   - בדפדפן: Ctrl+Shift+Delete → Clear cache
   - ב-Render: **"Clear build cache"** → **Redeploy**
2. **בדוק את ה-Logs** - אולי יש שגיאות
3. **וודא ש-Migrations רצו** - בדוק ב-Logs

---

## 📋 Checklist

- [ ] `DEMO_MODE=false` ב-furniture-api
- [ ] `NEXT_PUBLIC_DEMO_MODE=false` ב-furniture-web
- [ ] Redeploy של API
- [ ] Redeploy של Web
- [ ] בדיקת Logs - רואה `Demo Mode: false`
- [ ] בדיקת Health endpoint - `demoMode: false`
- [ ] בדיקת Frontend - אין Banner "מצב דמו פעיל"
- [ ] Company ב-DB עם `demoMode=false`

---

## 🎯 סיכום

**הדרך הכי פשוטה:**
1. **Render Dashboard** → **furniture-api** → **Environment** → `DEMO_MODE=false`
2. **Render Dashboard** → **furniture-web** → **Environment** → `NEXT_PUBLIC_DEMO_MODE=false`
3. **Redeploy** את שני ה-Services
4. **בדוק Logs** - אמור לראות `Demo Mode: false`

**זה אמור לעבוד!** ✅

