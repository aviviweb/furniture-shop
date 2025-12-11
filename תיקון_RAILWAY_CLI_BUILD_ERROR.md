# 🔧 תיקון שגיאת Build - @railway/cli

## 🔴 הבעיה:

הבילד נכשל עם השגיאה:
```
./node_modules/@railway/cli postinstall: Error: Failed fetching the binary: Service Unavailable
```

**למה זה קורה?**
- `@railway/cli` נמצא ב-`devDependencies`
- Railway מנסה להתקין אותו בזמן ה-build
- הוא מנסה להוריד binary ונכשל
- **`@railway/cli` זה כלי CLI למקומי בלבד - לא צריך להיות ב-production build!**

---

## ✅ הפתרון:

### מה תיקנתי:

1. **הסרתי `@railway/cli` מ-`devDependencies`**
2. **הוספתי אותו ל-`optionalDependencies`**

**למה `optionalDependencies`?**
- זה אומר ש-pnpm לא יכפה התקנה שלו
- אם הוא לא יכול להתקין - זה בסדר, זה לא יכשיל את ה-build
- הוא עדיין יהיה זמין למקומי (אם תתקין אותו ידנית)

---

## 🚀 מה לעשות עכשיו:

### שלב 1: עדכן את הקוד

```powershell
git add package.json
git commit -m "Fix: Move @railway/cli to optionalDependencies to fix build"
git push origin main
```

---

### שלב 2: Redeploy ב-Railway

**Railway Dashboard → כל Service → Deployments → "Redeploy"**

**או דרך CLI:**
```powershell
railway up --service "@furniture/api"
railway up --service "@furniture/web"
railway up --service "@furniture/worker"
```

---

## 💡 למה זה עובד?

- **`optionalDependencies`** = לא חובה להתקין
- **אם זה לא מתקין** = זה בסדר, לא יכשיל את ה-build
- **למקומי** = עדיין תוכל להתקין אותו ידנית: `pnpm add -D -w @railway/cli`

---

## ✅ Checklist:

- [ ] עדכנתי את `package.json` (הושלם אוטומטית)
- [ ] דחפתי את הקוד ל-GitHub
- [ ] Redeploy ב-Railway
- [ ] בדקתי שה-Build עובר

---

**עכשיו ה-Build צריך לעבור! 🎉**

