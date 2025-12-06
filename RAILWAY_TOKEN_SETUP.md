# הגדרת Railway Token קבוע

## דרך 1: יצירת Token דרך Dashboard (מומלץ)

### שלב 1: צור Token ב-Railway Dashboard

1. היכנס ל-[Railway Dashboard](https://railway.app)
2. לחץ על **Profile** (או **Account Settings**)
3. גלול ל-**Tokens** או **API Tokens**
4. לחץ **"Create Token"** או **"New Token"**
5. תן שם ל-token (למשל: "Cursor CLI")
6. העתק את ה-token (תראה אותו רק פעם אחת!)

### שלב 2: הגדר את ה-Token ב-Cursor

**אופציה A: דרך Environment Variable (מומלץ)**

1. פתח PowerShell ב-Cursor
2. הרץ:
   ```powershell
   $env:RAILWAY_TOKEN="your-token-here"
   ```
3. בדוק:
   ```powershell
   railway whoami
   ```

**אופציה B: דרך Railway CLI ישירות**

```powershell
railway login --token your-token-here
```

**אופציה C: שמור ב-PowerShell Profile (קבוע)**

1. בדוק איפה ה-Profile:
   ```powershell
   $PROFILE
   ```

2. פתח את ה-Profile:
   ```powershell
   notepad $PROFILE
   ```

3. הוסף את השורה:
   ```powershell
   $env:RAILWAY_TOKEN="your-token-here"
   ```

4. שמור וסגור

5. טען מחדש:
   ```powershell
   . $PROFILE
   ```

6. בדוק:
   ```powershell
   railway whoami
   ```

## דרך 2: שימוש ב-Railway Config File

Railway שומר את ה-token ב-config file. אפשר גם להגדיר אותו ידנית:

### מיקום ה-Config File:

**Windows:**
```
%USERPROFILE%\.railway\config.json
```

**או:**
```
C:\Users\<YourUsername>\.railway\config.json
```

### תוכן ה-Config File:

```json
{
  "token": "your-railway-token-here"
}
```

## דרך 3: שימוש ב-Railway Link (אם יש פרויקט)

אם יש לך פרויקט ב-Railway, אפשר להשתמש ב-Project Token:

1. ב-Railway Dashboard → בחר פרויקט → **Settings** → **General**
2. מצא את **Project Token**
3. השתמש בו:
   ```powershell
   railway link --token your-project-token
   ```

## בדיקת החיבור

לאחר הגדרת ה-token, בדוק:

```powershell
# בדוק מי אתה
railway whoami

# בדוק את הפרויקט
railway status

# רשימת services
railway service list
```

## פתרון בעיות

### בעיה: "Unauthorized" או "Not logged in"

1. ודא שה-token נכון
2. ודא שה-token לא פג תוקף
3. נסה ליצור token חדש

### בעיה: Token לא נשמר

1. ודא שה-Environment Variable מוגדר
2. בדוק את ה-PowerShell Profile
3. נסה להגדיר דרך config file

### בעיה: "Project not found"

```powershell
# חבר לפרויקט
railway link

# או עם Project ID
railway link <project-id>
```

## טיפים

1. **שמור את ה-Token במקום בטוח** - אל תעלה אותו ל-Git!
2. **השתמש ב-Environment Variables** - יותר בטוח מ-config file
3. **צור Token נפרד לכל מחשב** - קל יותר לנהל
4. **עדכן את ה-Token אם הוא פג תוקף**

## אוטומציה

אפשר ליצור סקריפט שיבדוק ויתחבר אוטומטית:

```powershell
# railway-auto-login.ps1
if (-not $env:RAILWAY_TOKEN) {
    Write-Host "RAILWAY_TOKEN not set. Please set it first." -ForegroundColor Red
    exit 1
}

railway whoami
if ($LASTEXITCODE -ne 0) {
    railway login --token $env:RAILWAY_TOKEN
}
```

