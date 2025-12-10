# תיקון בעיות חיבור ל-Railway

## 🔍 איך לבדוק מה הבעיה

### שלב 1: בדיקת התחברות

```powershell
railway whoami
```

**אם אתה רואה:**
- ✅ את השם שלך → אתה מחובר!
- ❌ "Unauthorized" → צריך להתחבר
- ❌ "not logged in" → צריך להתחבר
- ❌ "command not found" → Railway CLI לא מותקן

---

## ✅ פתרון 1: התחברות ל-Railway

### דרך 1: התחברות רגילה (מומלץ)

```powershell
railway login
```

**זה יפתח דפדפן:**
1. התחבר ל-Railway
2. אשר את ההרשאות
3. חזור ל-Terminal

---

### דרך 2: התחברות ללא דפדפן

אם הדפדפן לא נפתח:

```powershell
railway login --browserless
```

**זה יבקש ממך:**
1. להעתיק token
2. להדביק ב-Terminal

---

### דרך 3: שימוש ב-Token ישירות

אם יש לך Railway Token:

```powershell
$env:RAILWAY_TOKEN = "your-token-here"
railway whoami
```

**או ב-PowerShell Profile:**
```powershell
# פתח: notepad $PROFILE
# הוסף:
$env:RAILWAY_TOKEN = "your-token-here"
```

---

## ✅ פתרון 2: בדיקת Project

אחרי התחברות, בדוק ש-Project מקושר:

```powershell
railway status
```

**אם אתה רואה:**
- ✅ Project name → Project מקושר!
- ❌ "not linked" → צריך לקשר Project
- ❌ "No project" → צריך לקשר Project

**לקישור Project:**
```powershell
railway link
```

**זה יבקש ממך:**
1. לבחור Project מהרשימה
2. או להזין Project ID

---

## ✅ פתרון 3: התקנת Railway CLI

אם `railway` לא עובד:

```powershell
pnpm add -D -w @railway/cli
```

**או גלובלית:**
```powershell
pnpm add -g @railway/cli
```

**או דרך npm:**
```powershell
npm install -g @railway/cli
```

---

## ✅ פתרון 4: בעיות נפוצות

### בעיה: "Unauthorized"

**פתרון:**
```powershell
railway login
```

---

### בעיה: "Project not found"

**פתרון:**
```powershell
railway link
```

**או צור Project חדש:**
```powershell
railway init
```

---

### בעיה: "Service not found"

**פתרון:**
```powershell
# בדוק רשימת Services
railway service

# או צור Service חדש
railway service create api
railway service create web
railway service create worker
```

---

### בעיה: "Login session does not exist"

**פתרון:**
```powershell
# התחבר מחדש
railway login

# או השתמש ב-Token
$env:RAILWAY_TOKEN = "your-token"
```

---

## 🔑 איך לקבל Railway Token

1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **Settings** → **Tokens**
3. **"New Token"**
4. **העתק את ה-Token**
5. **השתמש בו:**
   ```powershell
   $env:RAILWAY_TOKEN = "your-token-here"
   ```

---

## 📋 Checklist

- [ ] Railway CLI מותקן (`railway --version`)
- [ ] מחובר ל-Railway (`railway whoami`)
- [ ] Project מקושר (`railway status`)
- [ ] Services קיימים (`railway service`)

---

## 🆘 אם עדיין לא עובד

1. **בדוק את ה-Logs:**
   ```powershell
   railway whoami 2>&1
   ```

2. **נסה להתחבר מחדש:**
   ```powershell
   railway logout
   railway login
   ```

3. **בדוק את ה-Version:**
   ```powershell
   railway --version
   ```

4. **עדכן Railway CLI:**
   ```powershell
   pnpm update -g @railway/cli
   ```

---

## 💡 טיפים

1. **תמיד בדוק `railway whoami`** לפני הרצת פקודות
2. **אם יש בעיות, נסה `railway logout` ואז `railway login`**
3. **שמור את ה-Token במקום בטוח** - תצטרך אותו אם הדפדפן לא עובד

---

## 📚 ראה גם

- `AUTO_FIX_README.md` - סקריפט אוטומטי
- `RAILWAY_DEPLOYMENT_ISSUES.md` - פתרון בעיות כללי

