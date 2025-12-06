# Railway vs Local - הבדלים חשובים

## ⚠️ חשוב להבין:

### Railway (Linux):
- ✅ `&&` עובד מצוין
- ✅ Build Commands עם `&&` יעבדו
- ✅ זה מה ש-Railway משתמש בו

### PowerShell (Windows מקומי):
- ❌ `&&` לא עובד
- ✅ צריך להשתמש ב-`;` או `-and`
- ⚠️ זה רק לבדיקה מקומית

## 🔧 Build Commands:

### ב-Railway Dashboard (Linux):
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```
✅ זה יעבוד ב-Railway!

### ב-PowerShell מקומי (לבדיקה):
```powershell
pnpm install --frozen-lockfile; pnpm --filter @furniture/prisma generate; pnpm --filter @furniture/api build
```
✅ זה יעבוד ב-PowerShell מקומי

## 💡 המלצה:

**אל תדאג מהשגיאה ב-PowerShell!**

- Railway מריץ ב-Linux container
- שם `&&` עובד מצוין
- השגיאה ב-PowerShell לא רלוונטית ל-Railway

## ✅ מה לעשות:

1. **הזן את ה-Build Command עם `&&` ב-Railway Dashboard**
2. **Railway יריץ את זה ב-Linux - זה יעבוד!**
3. **אל תנסה להריץ את זה מקומית ב-PowerShell** (אלא אם אתה משתמש ב-`;`)

## 🚀 לבדיקה מקומית:

אם אתה רוצה לבדוק מקומית, השתמש ב-`TEST_BUILD_LOCAL.ps1`:
```powershell
.\TEST_BUILD_LOCAL.ps1
```

או פשוט:
```powershell
pnpm install --frozen-lockfile; pnpm --filter @furniture/prisma generate; pnpm --filter @furniture/api build
```

## 📝 סיכום:

- **Railway = Linux = `&&` עובד** ✅
- **PowerShell = Windows = `&&` לא עובד** ❌
- **השתמש ב-`&&` ב-Railway Dashboard** ✅

