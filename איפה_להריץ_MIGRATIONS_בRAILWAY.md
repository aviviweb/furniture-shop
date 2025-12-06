# 🗄️ איפה להריץ Migrations ב-Railway - הוראות מדויקות

## 📍 איפה זה נמצא?

**Migrations לא נמצאים ב-Settings!**

**Migrations רצים דרך "Run Command" או "Shell"!**

---

## ✅ דרך 1: Run Command (הקלה ביותר)

### שלב אחר שלב:

1. **Railway Dashboard** → **בחר את הפרויקט**
2. **לחץ על `@furniture/api` Service** (לא PostgreSQL!)
3. **בתפריט משמאל** → **לחץ על "Deployments"**
4. **למעלה מימין** → **לחץ על "Run Command"** (או "Shell")
5. **ייפתח חלון/טרמינל**
6. **הדבק את הפקודה:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
7. **לחץ Enter**
8. **חכה לסיום** - אמור להראות "Applied migration: ..."

---

## ✅ דרך 2: Shell (אם יש)

### שלב אחר שלב:

1. **API Service** → **"Deployments"**
2. **לחץ על "Shell"** (אם יש כפתור כזה)
3. **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
4. **Enter**

---

## ✅ דרך 3: דרך CLI (אם יש לך Railway CLI)

```powershell
pnpm railway:migrate
```

או:
```powershell
pnpx --yes railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

---

## 📸 איפה זה נראה?

**ב-Railway Dashboard:**

```
API Service
├── Deployments  ← לחץ כאן!
│   ├── [כפתור "Run Command"] ← כאן!
│   └── [כפתור "Shell"] ← או כאן!
├── Variables
├── Metrics
└── Settings
```

---

## ⚠️ חשוב!

**Migrations לא רצים ב:**
- ❌ Settings → Deploy → Start Command
- ❌ PostgreSQL Service
- ❌ Build Command

**Migrations רצים ב:**
- ✅ Deployments → Run Command
- ✅ Deployments → Shell
- ✅ CLI (אם יש)

---

## 🔍 אם אתה לא מוצא "Run Command":

### אפשרות 1: זה נקרא אחרת
- חפש: **"Shell"**
- חפש: **"Terminal"**
- חפש: **"Console"**

### אפשרות 2: זה לא זמין
- **השתמש ב-CLI:**
  ```powershell
  pnpm railway:migrate
  ```

### אפשרות 3: דרך Deployment קיים
1. **Deployments** → **לחץ על Deployment קיים** (למשל "main")
2. **חפש כפתור "Run Command"** או **"Shell"**

---

## 📋 Checklist:

- [ ] פתחתי את API Service (לא PostgreSQL!)
- [ ] לחצתי על "Deployments" (משמאל)
- [ ] מצאתי כפתור "Run Command" או "Shell"
- [ ] הדבקתי את הפקודה: `pnpm --filter @furniture/prisma migrate deploy`
- [ ] לחצתי Enter
- [ ] חכיתי לסיום

---

## 🆘 עדיין לא מוצא?

**שלח לי:**
1. מה אתה רואה ב-"Deployments"?
2. אילו כפתורים יש שם?
3. האם יש כפתור "Run Command" או "Shell"?

**או נסה דרך CLI:**
```powershell
pnpm railway:migrate
```

---

**התחל עם: API Service → Deployments → Run Command** 🚀

