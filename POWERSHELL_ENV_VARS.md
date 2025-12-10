# הגדרת Environment Variables ב-PowerShell

## ⚠️ בעיה
ב-PowerShell, הפקודה `NODE_ENV=production` לא עובדת. זה syntax של bash/Linux.

## ✅ פתרון

### הגדרת Variable ב-PowerShell:

```powershell
$env:NODE_ENV = "production"
```

### הגדרת מספר Variables:

```powershell
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:NEXT_PUBLIC_API_URL = "https://api.example.com/api"
```

### בדיקת Variable:

```powershell
$env:NODE_ENV
```

### מחיקת Variable:

```powershell
Remove-Item Env:\NODE_ENV
```

---

## 🚀 דוגמאות שימושיות

### להרצת פקודה עם Variable:

```powershell
$env:NODE_ENV = "production"
pnpm build
```

### להרצת מספר פקודות:

```powershell
$env:NODE_ENV = "production"
$env:PORT = "3000"
pnpm start
```

---

## 📝 הערות חשובות

1. **Variables נשארים רק ב-session הנוכחי** - אחרי סגירת Terminal, הם נעלמים
2. **להגדרה קבועה** - צריך להשתמש ב-Railway Dashboard או ב-`.env` file
3. **ב-Railway** - הגדר Variables דרך Dashboard, לא דרך Terminal

---

## 🔧 ב-Railway Dashboard

**לא צריך להגדיר ב-Terminal!** פשוט:

1. **Railway Dashboard → Service → Variables**
2. **"+ New Variable"**
3. **Name:** `NODE_ENV`
4. **Value:** `production`
5. **שמור**

זה יעבוד אוטומטית! ✅
