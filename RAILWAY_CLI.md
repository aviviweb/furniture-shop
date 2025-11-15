# מדריך Railway CLI - ניהול דרך Cursor Terminal

מדריך מפורט לניהול כל הגדרות Railway דרך הטרמינל ב-Cursor.

## פקודות בסיסיות

### התחברות
```powershell
# התחברות (יפתח דפדפן)
railway login

# בדיקה אם מחובר
railway whoami
```

### חיבור לפרויקט
```powershell
# חיבור לפרויקט קיים
railway link

# או עם Project ID
railway link <project-id>
```

## ניהול Services

### רשימת Services
```powershell
# רשימת כל ה-services בפרויקט
railway service list

# או בקיצור
railway service
```

### יצירת Service חדש
```powershell
# יצירת service חדש
railway service create <service-name>

# דוגמה:
railway service create api
railway service create web
railway service create worker
```

### בחירת Service לעבודה
```powershell
# עבור ל-service מסוים
railway service <service-name>

# דוגמה:
railway service api
```

## ניהול Environment Variables

### הצגת Variables
```powershell
# הצגת כל ה-variables של הפרויקט
railway variables

# הצגת variables של service מסוים
railway variables --service api
railway variables --service web
railway variables --service worker
```

### הוספת/עדכון Variable
```powershell
# הוספת variable אחד
railway variables set KEY=value

# הוספת variable ל-service מסוים
railway variables set --service api KEY=value

# הוספת מספר variables
railway variables set KEY1=value1 KEY2=value2

# דוגמאות:
railway variables set --service api DEMO_MODE=false
railway variables set --service api JWT_SECRET=my-secret-key
railway variables set --service web NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### מחיקת Variable
```powershell
# מחיקת variable
railway variables unset KEY

# מחיקת variable מ-service מסוים
railway variables unset --service api KEY
```

### ייבוא Variables מקובץ
```powershell
# ייבוא מ-.env file
railway variables --service api < .env

# או
railway variables set --service api $(cat .env)
```

## ניהול Domains

### הצגת Domains
```powershell
# הצגת כל ה-domains
railway domain list

# או
railway domain
```

### הוספת Domain
```powershell
# הוספת domain ל-service
railway domain add <domain> --service <service-name>

# דוגמאות:
railway domain add app.yourdomain.com --service web
railway domain add api.yourdomain.com --service api

# Wildcard domain (לכל ה-subdomains)
railway domain add *.yourdomain.com --service web
```

### מחיקת Domain
```powershell
# מחיקת domain
railway domain remove <domain> --service <service-name>
```

## ניהול Deployments

### פריסה
```powershell
# פריסה של service מסוים
railway up --service api

# פריסה עם path
railway up --service web --path frontend

# פריסה של כל הפרויקט
railway up
```

### הצגת Deployments
```powershell
# רשימת deployments
railway deployments

# או
railway deploy list
```

### Logs
```powershell
# הצגת logs של service
railway logs --service api
railway logs --service web
railway logs --service worker

# הצגת logs בזמן אמת
railway logs --service api --follow

# הצגת logs של deployment מסוים
railway logs --deployment <deployment-id>
```

## ניהול Database

### יצירת Database
```powershell
# יצירת PostgreSQL
railway add postgresql

# יצירת Redis
railway add redis

# יצירת MySQL
railway add mysql
```

### חיבור ל-Database
```powershell
# חיבור ל-PostgreSQL
railway connect postgresql

# או עם psql
railway connect postgresql --psql
```

## הרצת פקודות ב-Service

### הרצת פקודה ב-Service
```powershell
# הרצת פקודה ב-service
railway run --service api <command>

# דוגמאות:
railway run --service api pnpm --filter @furniture/prisma migrate deploy
railway run --service api pnpm install
railway run --service api node scripts/seed.js
```

## ניהול Projects

### רשימת Projects
```powershell
# רשימת כל ה-projects
railway projects
```

### יצירת Project חדש
```powershell
# יצירת project חדש
railway init

# או עם שם
railway init --name my-project
```

### מחיקת Project
```powershell
# מחיקת project
railway delete
```

## דוגמאות שימושיות

### הגדרת כל ה-Variables ל-API Service
```powershell
railway variables set --service api \
  DEMO_MODE=false \
  JWT_SECRET=your-secret-key \
  PORT=4000 \
  DATABASE_URL=$DATABASE_URL \
  REDIS_URL=$REDIS_URL \
  FRONTEND_URL=https://app.yourdomain.com
```

### הגדרת כל ה-Variables ל-Web Service
```powershell
railway variables set --service web \
  NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api \
  NEXT_PUBLIC_TENANT_ID=furniture-demo \
  NEXT_PUBLIC_BRAND_NAME="Your Brand" \
  NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9 \
  NEXT_PUBLIC_DEMO_MODE=false \
  NODE_ENV=production \
  PORT=3000
```

### הגדרת כל ה-Variables ל-Worker Service
```powershell
railway variables set --service worker \
  REDIS_URL=$REDIS_URL \
  DATABASE_URL=$DATABASE_URL
```

### הוספת Wildcard Domain
```powershell
# הוספת wildcard domain ל-Web Service
railway domain add *.yourdomain.com --service web

# הוספת domain ל-API Service
railway domain add api.yourdomain.com --service api
```

### הרצת Migrations
```powershell
# הרצת migrations על ה-Database
railway run --service api pnpm --filter @furniture/prisma migrate deploy
```

### בדיקת Status
```powershell
# בדיקת status של כל ה-services
railway status

# בדיקת logs
railway logs --service api --follow
```

## טיפים

### 1. שימוש ב-Environment Variables מקומיים
```powershell
# הגדר variable מקומי
$env:RAILWAY_TOKEN="your-token"

# או ב-PowerShell Profile
# הוסף ל-$PROFILE:
$env:RAILWAY_TOKEN="your-token"
```

### 2. שימוש ב-Railway.toml
הקובץ `railway.toml` מגדיר את ה-services וההגדרות שלהם.
```toml
[project]
name = "furniture-saas"

[services.api]
path = "backend"
build = "pnpm --filter @furniture/api build"
start = "pnpm --filter @furniture/api start"

[services.web]
path = "frontend"
build = "pnpm --filter @furniture/web build"
start = "pnpm --filter @furniture/web start"
```

### 3. בדיקת הגדרות לפני Deploy
```powershell
# בדוק את ה-variables
railway variables --service api

# בדוק את ה-domains
railway domain list

# בדוק את ה-status
railway status
```

## פתרון בעיות

### בעיה: "Not logged in"
```powershell
# התחבר מחדש
railway login
```

### בעיה: "Project not found"
```powershell
# חבר לפרויקט
railway link

# או צור project חדש
railway init
```

### בעיה: "Service not found"
```powershell
# בדוק את רשימת ה-services
railway service list

# או צור service חדש
railway service create <service-name>
```

## עזרה נוספת

```powershell
# עזרה כללית
railway --help

# עזרה על פקודה מסוימת
railway variables --help
railway domain --help
railway service --help
```

## קיצורי דרך שימושיים

```powershell
# alias שימושיים (הוסף ל-PowerShell Profile)
function rv { railway variables $args }
function rl { railway logs $args }
function rs { railway service $args }
function rd { railway domain $args }
function ru { railway up $args }
```

## סיכום - פקודות הכי חשובות

```powershell
# 1. התחברות
railway login

# 2. חיבור לפרויקט
railway link

# 3. הצגת variables
railway variables --service api

# 4. הוספת variable
railway variables set --service api KEY=value

# 5. הוספת domain
railway domain add app.yourdomain.com --service web

# 6. הצגת logs
railway logs --service api

# 7. פריסה
railway up --service api
```

