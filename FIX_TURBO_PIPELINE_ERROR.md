# תיקון שגיאת Turbo Pipeline

## 🔴 הבעיה:

```
Rename `pipeline` field to `tasks`
help: Changed in 2.0: `pipeline` has been renamed to `tasks`
ELIFECYCLE Command failed with exit code 1.
```

## ✅ הפתרון:

הבעיה היא ש-Railway מנסה להריץ `pnpm run build` מה-root, וזה מריץ `turbo build`. אבל ה-`turbo.json` כבר תקין עם `tasks`.

### פתרון 1: ודא שה-Build Command נכון ב-Railway

ב-Railway Dashboard, ודא שה-Build Command **לא** מריץ `pnpm run build` מה-root, אלא:

#### API Service → Settings → Build & Deploy:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build
```

**לא:**
```
pnpm run build
```

#### Web Service → Settings → Build & Deploy:

**Build Command:**
```
pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build
```

**לא:**
```
pnpm run build
```

### פתרון 2: ודא שה-turbo.json תקין

ה-`turbo.json` כבר תקין, אבל ודא שהוא נראה כך:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {},
    "test": {}
  }
}
```

**חשוב:** השתמש ב-`tasks` ולא ב-`pipeline`!

### פתרון 3: נקה את ה-Cache

אם עדיין יש בעיה, נסה לנקות את ה-cache:

1. ב-Railway Dashboard → Settings → Build & Deploy
2. לחץ על **"Clear Build Cache"** או **"Rebuild"**
3. או מחק את ה-`.turbo` folder (אם יש)

### פתרון 4: ודא שה-turbo version נכון

ב-`package.json`:
```json
{
  "devDependencies": {
    "turbo": "^2.1.1"
  }
}
```

ודא שזה גרסה 2.0+ (לא 1.x).

## 📋 Checklist:

- [ ] Build Command ב-Railway לא מריץ `pnpm run build` מה-root
- [ ] Build Command מריץ `pnpm --filter @furniture/api build` (או web)
- [ ] `turbo.json` משתמש ב-`tasks` ולא ב-`pipeline`
- [ ] `turbo` version הוא 2.0+ ב-`package.json`
- [ ] Cache נוקה (אם צריך)

## 🚀 אחרי תיקון:

1. **שמור את השינויים ב-Railway Dashboard**
2. **Redeploy:**
   - לחץ "Deploy" או "Redeploy"
   - בחר branch: `main`
   - לחץ "Deploy"
3. **בדוק את ה-Logs** - אמור לעבוד עכשיו!

