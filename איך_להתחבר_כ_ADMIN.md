# 🔐 איך להתחבר כ-Master Admin

## 📋 פרטי התחברות:

מהקוד, יש משתמש **SUPER_ADMIN** שנוצר ב-seed:

### פרטי התחברות:

- **Email:** `super@platform.local`
- **Password:** `changeme`
- **Role:** `SUPER_ADMIN`
- **Tenant:** `platform`

---

## ✅ איך להתחבר:

### דרך 1: דרך דף Login (אם עובד)

1. **פתח את האפליקציה** → **`/login`**
2. **הזן:**
   - Email: `super@platform.local`
   - Password: `changeme`
3. **לחץ "התחבר"**

**הערה:** אם דף ה-Login לא עובד, ראה דרך 2.

---

### דרך 2: דרך API ישירות (אם דף Login לא עובד)

#### באמצעות cURL או Postman:

```bash
POST https://your-api-url.railway.app/api/auth/login
Content-Type: application/json

{
  "email": "super@platform.local",
  "password": "changeme",
  "tenantId": "platform"
}
```

#### באמצעות PowerShell:

```powershell
$body = @{
    email = "super@platform.local"
    password = "changeme"
    tenantId = "platform"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-api-url.railway.app/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

**תקבל Token** → שמור אותו והשתמש בו ב-Headers:
```
Authorization: Bearer <token>
```

---

### דרך 3: אם המשתמש לא קיים (צריך להריץ Seed)

אם המשתמש לא קיים ב-Database, צריך להריץ את ה-Seed:

#### דרך Railway Dashboard:

1. **API Service** → **Deployments** → **"Run Command"** או **"Shell"**
2. **הרץ:**
   ```
   pnpm --filter @furniture/prisma db seed
   ```

#### דרך CLI מקומי (אם יש גישה ל-Database):

```powershell
cd packages/prisma
pnpm db seed
```

---

## 🔍 איך לבדוק אם המשתמש קיים:

### דרך Railway Dashboard:

1. **PostgreSQL Service** → **"Data"** או **"Query"**
2. **הרץ Query:**
   ```sql
   SELECT email, role FROM "User" WHERE email = 'super@platform.local';
   ```

אם אתה רואה את המשתמש → הוא קיים! ✅

אם לא → צריך להריץ Seed.

---

## 🎯 אחרי התחברות:

### גישה ל-Super Admin Panel:

1. **לך ל-** `/superadmin`
2. **אמור לראות את דף מנהל המערכת**

### הרשאות:

- ✅ גישה לכל ה-Companies
- ✅ אפשרות לשנות Demo Mode
- ✅ גישה לכל הנתונים

---

## 🆘 אם לא עובד:

### 1. בדוק שה-Seed הורץ:

```sql
SELECT * FROM "User" WHERE role = 'SUPER_ADMIN';
```

### 2. בדוק שה-API עובד:

```powershell
# בדוק אם ה-API מגיב
Invoke-RestMethod -Uri "https://your-api-url.railway.app/api/auth/login" -Method Post -Body '{"email":"test","password":"test"}' -ContentType "application/json"
```

### 3. בדוק Logs:

```powershell
pnpm railway:logs:api
```

---

## 📝 סיכום:

**פרטי התחברות:**
- Email: `super@platform.local`
- Password: `changeme`
- Tenant: `platform` (אופציונלי)

**אם המשתמש לא קיים** → הרץ Seed:
```powershell
pnpm --filter @furniture/prisma db seed
```

---

**התחל עם ניסיון להתחבר דרך `/login`!** 🚀

