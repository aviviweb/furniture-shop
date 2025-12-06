# Build Commands ל-Railway Dashboard

## ⚠️ חשוב: Railway מריץ ב-Linux, לא ב-PowerShell!

Railway Dashboard מריץ את ה-Build Commands ב-Linux container, שם `&&` עובד מצוין.

אם אתה מנסה להריץ את זה מקומית ב-PowerShell, זה לא יעבוד. השתמש בפקודות האלה רק ב-Railway Dashboard!

## Build Commands ל-Railway Dashboard:

### API Service - Build Command:
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

### API Service - Start Command:
```
pnpm --filter @furniture/api start
```

### Web Service - Build Command:
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

### Web Service - Start Command:
```
pnpm --filter @furniture/web start
```

### Worker Service - Build Command:
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate
```

### Worker Service - Start Command:
```
pnpm --filter @furniture/worker start
```

## אם אתה מנסה להריץ מקומית ב-PowerShell:

השתמש בפקודות האלה (עם `;` במקום `&&`):

```powershell
# API Build
pnpm install --frozen-lockfile; pnpm --filter @furniture/prisma generate; pnpm --filter @furniture/api build

# Web Build
pnpm install --frozen-lockfile; pnpm --filter @furniture/prisma generate; pnpm --filter @furniture/web build
```

או השתמש ב-`cmd /c`:

```powershell
cmd /c "pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build"
```

## איך להזין ב-Railway Dashboard:

1. היכנס ל-Railway Dashboard
2. בחר את ה-Service (API או Web)
3. לחץ על **Settings**
4. גלול ל-**Build & Deploy**
5. הזן את ה-Build Command (עם `&&` - זה יעבוד!)
6. הזן את ה-Start Command
7. לחץ **Save**

Railway יריץ את זה ב-Linux container, שם `&&` עובד מצוין! ✅

