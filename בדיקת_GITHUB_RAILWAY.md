# בדיקת חיבור GitHub ל-Railway

## דרך 1: בדיקה דרך Railway Dashboard (הכי פשוט!)

### שלב 1: בדוק את ה-Source
1. **פתח Railway Dashboard** → [railway.app](https://railway.app)
2. **בחר את הפרויקט שלך** (`furniture-saas`)
3. **לחץ על "Settings"** (משמאל)
4. **לחץ על "Source"** (בתפריט השמאלי)
5. **בדוק:**
   - ✅ אם יש "GitHub" עם שם ה-repo שלך → **מחובר!**
   - ❌ אם כתוב "No source connected" → **לא מחובר**

### שלב 2: אם לא מחובר - חבר!
1. **ב-"Source"** → לחץ **"Connect GitHub"** או **"New"**
2. **בחר את ה-repo שלך** (`furniture-shop`)
3. **בחר branch** (בדרך כלל `main` או `master`)
4. **שמור**

---

## דרך 2: בדיקה דרך Terminal (PowerShell)

### בדוק את ה-Git Remote:
```powershell
git remote -v
```

**אמור להראות משהו כמו:**
```
origin  https://github.com/your-username/furniture-shop.git (fetch)
origin  https://github.com/your-username/furniture-shop.git (push)
```

### בדוק את Railway Project:
```powershell
railway status
```

**אם זה עובד, אמור להראות:**
- Project name
- Service names
- Environment

### בדוק את Railway Link:
```powershell
railway link
```

**אם זה מבקש לבחור project → זה אומר שיש חיבור!**

---

## דרך 3: בדיקה דרך Railway CLI

### בדוק את ה-Project:
```powershell
railway whoami
```

**אמור להראות את ה-username שלך ב-Railway**

### בדוק את ה-Services:
```powershell
railway service list
```

**אמור להראות את כל ה-services:**
- `@furniture/api`
- `@furniture/web`
- `@furniture/worker`

---

## מה לבדוק:

### ✅ אם GitHub מחובר:
1. **Dashboard → Settings → Source** → אמור להראות את ה-repo
2. **Dashboard → Deployments** → אמור להיות אפשרות ל-"Deploy from GitHub"
3. **Dashboard → Settings → Build** → אמור לקרוא מ-`railway.toml` אוטומטית

### ❌ אם GitHub לא מחובר:
1. **Dashboard → Settings → Source** → לחץ "Connect GitHub"
2. **בחר את ה-repo**
3. **שמור**
4. **Redeploy** את ה-services

---

## פתרון מהיר:

**אם אתה רואה ב-Dashboard → Settings → Source:**
- ✅ **"GitHub: furniture-shop"** → **מחובר! כל טוב!**
- ❌ **"No source connected"** → **לחץ "Connect GitHub"**

---

## הערות:

- **Railway יכול לעבוד גם בלי GitHub** (עם manual deploy)
- **אבל עם GitHub זה יותר נוח** (auto-deploy על push)
- **`railway.toml` עובד גם בלי GitHub** (אבל צריך להגדיר Build Commands ידנית)

---

**הכי פשוט: פתח Dashboard → Settings → Source → בדוק!**

