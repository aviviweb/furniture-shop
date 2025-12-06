# 🔧 תיקון: שגיאת railway:migrate

## ❌ השגיאה שאתה רואה:

```
ERR_PNPM_FETCH_404  GET https://registry.npmjs.org/--yes: Not Found - 404
--yes is not in the npm registry
```

**זה אומר:** הפקודה ב-`package.json` לא נכונה.

---

## ✅ תיקון: הפקודה תוקנה!

**עכשיו תריץ שוב:**

```powershell
pnpm railway:migrate
```

**זה אמור לעבוד עכשיו!**

---

## ✅ אם עדיין לא עובד:

### דרך 1: הרץ ישירות

```powershell
pnpm dlx railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

### דרך 2: התקן Railway CLI גלובלית

```powershell
pnpm add -g @railway/cli
```

ואז:
```powershell
railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

### דרך 3: דרך Pre-deploy Step

1. **API Service** → **"Settings"** → **"Deploy"**
2. **"Pre-deploy step"** → **"+ Add pre-deploy step"**
3. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
4. **שמור** → **Redeploy**

---

## 📋 Checklist:

- [ ] תיקנתי את הפקודה ב-`package.json` (כבר נעשה!)
- [ ] ניסיתי `pnpm railway:migrate` שוב
- [ ] אם לא עבד - ניסיתי דרך 1
- [ ] אם עדיין לא - ניסיתי דרך 2
- [ ] אם עדיין לא - ניסיתי דרך 3

---

**נסה שוב: `pnpm railway:migrate`** 🚀

