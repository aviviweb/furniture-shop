# ⚠️ תיקון: אתה מנסה להריץ Migrations מקומית!

## ❌ הבעיה:

**אתה הרצת:**
```powershell
pnpm --filter @furniture/prisma migrate deploy
```

**זה מנסה להתחבר ל:**
```
localhost:5432
```

**זה לא נכון!** זה מנסה להתחבר למחשב המקומי שלך, לא ל-Railway!

---

## ✅ פתרון: הרץ Migrations ב-Railway!

**Migrations צריכים לרוץ על Railway, לא על המחשב שלך!**

---

## ✅ דרך 1: Railway Dashboard (הקלה ביותר)

### שלב אחר שלב:

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **בחר את הפרויקט**
3. **לחץ על `@furniture/api` Service**
4. **בתפריט משמאל** → **"Deployments"**
5. **למעלה מימין** → **"Run Command"** (או "Shell")
6. **ייפתח חלון** → **הדבק:**
   ```
   pnpm --filter @furniture/prisma migrate deploy
   ```
7. **Enter** → חכה לסיום

**זה יריץ את ה-Migrations על Railway, לא על המחשב שלך!**

---

## ✅ דרך 2: Railway CLI (אם יש לך)

**אם יש לך Railway CLI מותקן ומחובר:**

```powershell
pnpm railway:migrate
```

או:
```powershell
pnpx --yes railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

**זה יריץ את ה-Migrations על Railway דרך CLI!**

---

## 🔍 איך לדעת שזה עובד?

**אם אתה רואה:**
```
Datasource "db": PostgreSQL database "..." at "...railway.app:5432"
```

**זה נכון!** זה מתחבר ל-Railway.

**אם אתה רואה:**
```
localhost:5432
```

**זה לא נכון!** זה מנסה להתחבר למחשב המקומי שלך.

---

## ⚠️ למה זה קורה?

**כשאתה מריץ את הפקודה ב-PowerShell המקומי:**
- זה מחפש `.env` מקומי
- זה מחפש `DATABASE_URL` מקומי
- זה מנסה להתחבר ל-localhost

**כשאתה מריץ את זה ב-Railway:**
- זה משתמש ב-Variables של Railway
- זה מתחבר ל-PostgreSQL של Railway
- זה עובד!

---

## 📋 Checklist:

- [ ] פתחתי Railway Dashboard
- [ ] בחרתי את API Service
- [ ] לחצתי על "Deployments"
- [ ] לחצתי על "Run Command"
- [ ] הדבקתי את הפקודה
- [ ] ראיתי שזה מתחבר ל-railway.app (לא localhost)
- [ ] Migrations רצו בהצלחה

---

## 🆘 עדיין לא מוצא "Run Command"?

**ראה: `איפה_להריץ_MIGRATIONS_בRAILWAY.md`**

---

**התחל עם Railway Dashboard → API Service → Deployments → Run Command!** 🚀

