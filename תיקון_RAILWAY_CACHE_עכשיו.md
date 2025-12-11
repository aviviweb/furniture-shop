# 🔧 תיקון Railway Cache - apiDelete לא נראה

## 🔴 הבעיה:

הקוד ב-GitHub כולל את `apiDelete` (commit `9b9f422`), אבל Railway עדיין לא רואה אותו.

**זה אומר שיש בעיה עם Railway Cache או שהקוד לא נדחף כמו שצריך.**

---

## ✅ פתרון מיידי:

### שלב 1: ודא שהקוד נדחף

```powershell
# בדוק אם יש שינויים שלא נדחפו
git status
git log origin/main..HEAD --oneline

# אם יש שינויים - דחוף אותם
git push origin main
```

---

### שלב 2: נקה Build Cache ב-Railway

**Railway Dashboard:**

1. **עבור ל-`@furniture/web` Service**
2. **Settings** → **Build**
3. **חפש "Clear Build Cache"** או **"Rebuild"**
4. **לחץ על זה**

**או דרך CLI:**

```powershell
railway variables set --service "@furniture/web" RAILWAY_CLEAR_CACHE=1
```

---

### שלב 3: Redeploy עם Force

**Railway Dashboard:**

1. **`@furniture/web`** → **Deployments**
2. **לחץ על "..." (3 נקודות)**
3. **בחר "Redeploy"** או **"Deploy Latest"**
4. **אם יש אפשרות "Force Rebuild"** → סמן אותה

**או דרך CLI:**

```powershell
railway up --service "@furniture/web" --detach
```

---

### שלב 4: בדוק את ה-Commit ב-GitHub

1. **פתח GitHub** → ה-repo שלך
2. **עבור ל-`apps/web/lib/api.ts`**
3. **וודא שיש `export async function apiDelete`** (שורה 78)
4. **אם זה לא קיים** → הקוד לא נדחף, צריך לדחוף שוב

---

### שלב 5: אם זה עדיין לא עובד - דחוף מחדש

```powershell
# הוסף שינוי קטן כדי לכפות commit חדש
git add apps/web/lib/api.ts
git commit --amend --no-edit
git push --force-with-lease origin main
```

**⚠️ זהירות:** `--force-with-lease` בטוח יותר מ-`--force`

---

## 💡 למה זה קורה:

- **Railway משתמש ב-Cache** → צריך לנקות
- **הקוד לא נדחף** → צריך לדחוף
- **Build Cache ישן** → צריך Rebuild

---

## ✅ Checklist:

- [ ] `git status` - אין שינויים לא נדחפים
- [ ] `git push origin main` - הקוד נדחף
- [ ] בדוק ב-GitHub שהקוד שם
- [ ] נקה Build Cache ב-Railway
- [ ] Redeploy עם Force Rebuild
- [ ] בדוק שה-Build עובר

---

**בואו ננסה את זה עכשיו!**

