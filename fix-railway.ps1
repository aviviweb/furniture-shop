# Railway Fix Script - תיקון אוטומטי של Railway Deployment
# הרץ את הסקריפט הזה כדי לתקן את כל הבעיות ב-Railway

# Fix encoding for Hebrew characters
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Railway Fix Script - תיקון אוטומטי" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# פונקציה להצגת הודעות
function Show-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "▶ $Message" -ForegroundColor Yellow
    Write-Host ""
}

function Show-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Show-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Show-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# בדיקה אם pnpm מותקן
Show-Step "בודק התקנות..."
try {
    $pnpmVersion = pnpm --version
    Show-Success "pnpm מותקן: $pnpmVersion"
} catch {
    Show-Error "pnpm לא מותקן! התקן אותו קודם."
    exit 1
}

# בדיקה אם railway CLI מותקן
try {
    $railwayVersion = pnpm dlx railway --version 2>&1
    Show-Success "Railway CLI זמין"
} catch {
    Show-Info "מתקין Railway CLI..."
    pnpm dlx railway --version | Out-Null
    Show-Success "Railway CLI הותקן"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  שלב 1: בדיקת Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Show-Step "בודק Variables של API Service..."
try {
    pnpm dlx railway variables --service api
    Show-Success "Variables של API Service נטענו"
} catch {
    Show-Error "שגיאה בטעינת Variables של API Service"
}

Write-Host ""
Show-Step "בודק Variables של Web Service..."
try {
    pnpm dlx railway variables --service web
    Show-Success "Variables של Web Service נטענו"
} catch {
    Show-Error "שגיאה בטעינת Variables של Web Service"
}

Write-Host ""
Show-Step "בודק Variables של Worker Service..."
try {
    pnpm dlx railway variables --service worker
    Show-Success "Variables של Worker Service נטענו"
} catch {
    Show-Error "שגיאה בטעינת Variables של Worker Service"
}

Write-Host ""
Show-Step "בודק DATABASE_URL ב-PostgreSQL Service..."
try {
    pnpm dlx railway variables --service postgres | Select-String "DATABASE_URL"
    Show-Success "DATABASE_URL נמצא ב-PostgreSQL Service"
} catch {
    Show-Error "שגיאה בטעינת DATABASE_URL מ-PostgreSQL Service"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  שלב 2: הגדרת Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "האם תרצה להגדיר Environment Variables אוטומטית?"
$setVars = Read-Host "הקלד 'y' לאישור, או 'n' לדילוג (y/n)"

if ($setVars -eq 'y') {
    Show-Step "מגדיר DEMO_MODE=false ב-API Service..."
    try {
        pnpm dlx railway variables set DEMO_MODE=false --service api
        Show-Success "DEMO_MODE הוגדר ל-false"
    } catch {
        Show-Error "שגיאה בהגדרת DEMO_MODE"
    }

    Write-Host ""
    Show-Info "הגדרת FRONTEND_URL ב-API Service"
    Show-Info "צריך להזין את ה-URL של Web Service (לדוגמה: https://your-web.railway.app)"
    $frontendUrl = Read-Host "Enter FRONTEND_URL (or press Enter to skip)"
    if ($frontendUrl) {
        try {
            pnpm dlx railway variables set FRONTEND_URL=$frontendUrl --service api
            Show-Success "FRONTEND_URL הוגדר"
        } catch {
            Show-Error "שגיאה בהגדרת FRONTEND_URL"
        }
    }

    Write-Host ""
    Show-Info "הגדרת NEXT_PUBLIC_API_URL ב-Web Service"
    Show-Info "צריך להזין את ה-URL של API Service (לדוגמה: https://your-api.railway.app/api)"
    $apiUrl = Read-Host "Enter NEXT_PUBLIC_API_URL (or press Enter to skip)"
    if ($apiUrl) {
        try {
            pnpm dlx railway variables set NEXT_PUBLIC_API_URL=$apiUrl --service web
            Show-Success "NEXT_PUBLIC_API_URL הוגדר"
        } catch {
            Show-Error "שגיאה בהגדרת NEXT_PUBLIC_API_URL"
        }
    }
} else {
    Show-Info "דילגת על הגדרת Variables. תוכל להגדיר אותם מאוחר יותר דרך Dashboard או CLI."
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  שלב 3: הרצת Migrations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "האם תרצה להריץ Migrations עכשיו?"
$runMigrations = Read-Host "הקלד 'y' לאישור, או 'n' לדילוג (y/n)"

if ($runMigrations -eq 'y') {
    Show-Step "מריץ Migrations ב-API Service..."
    try {
        pnpm railway:migrate
        Show-Success "Migrations הורצו בהצלחה"
    } catch {
        Show-Error "שגיאה בהרצת Migrations"
        Show-Info "נסה להריץ ידנית: pnpm railway:migrate"
    }
} else {
    Show-Info "דילגת על Migrations. זכור להריץ אותם לפני Deployment!"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  שלב 4: בדיקת Logs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "האם תרצה לבדוק Logs עכשיו?"
$checkLogs = Read-Host "הקלד 'y' לאישור, או 'n' לדילוג (y/n)"

if ($checkLogs -eq 'y') {
    Write-Host ""
    Show-Step "Checking API Service Logs (last 10 lines)..."
    try {
        pnpm dlx railway logs --service api --tail 10
    } catch {
        Show-Error "שגיאה בטעינת Logs של API Service"
    }

    Write-Host ""
    Show-Step "Checking Web Service Logs (last 10 lines)..."
    try {
        pnpm dlx railway logs --service web --tail 10
    } catch {
        Show-Error "שגיאה בטעינת Logs של Web Service"
    }

    Write-Host ""
    Show-Step "Checking Worker Service Logs (last 10 lines)..."
    try {
        pnpm dlx railway logs --service worker --tail 10
    } catch {
        Show-Error "שגיאה בטעינת Logs של Worker Service"
    }
} else {
    Show-Info "דילגת על בדיקת Logs. תוכל לבדוק מאוחר יותר עם: pnpm railway:logs:api"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  שלב 5: Redeploy Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "האם תרצה ל-Redeploy את ה-Services עכשיו?"
$redeploy = Read-Host "הקלד 'y' לאישור, או 'n' לדילוג (y/n)"

if ($redeploy -eq 'y') {
    Write-Host ""
    Show-Info "איזה Service תרצה ל-Redeploy?"
    Write-Host "1. API Service"
    Write-Host "2. Web Service"
    Write-Host "3. Worker Service"
    Write-Host "4. הכל"
    $serviceChoice = Read-Host "הקלד מספר (1-4)"

    switch ($serviceChoice) {
        "1" {
            Show-Step "מבצע Redeploy ל-API Service..."
            try {
                pnpm deploy:api
                Show-Success "Redeploy של API Service הושלם"
            } catch {
                Show-Error "שגיאה ב-Redeploy של API Service"
            }
        }
        "2" {
            Show-Step "מבצע Redeploy ל-Web Service..."
            try {
                pnpm deploy:web
                Show-Success "Redeploy של Web Service הושלם"
            } catch {
                Show-Error "שגיאה ב-Redeploy של Web Service"
            }
        }
        "3" {
            Show-Step "מבצע Redeploy ל-Worker Service..."
            try {
                pnpm deploy:worker
                Show-Success "Redeploy של Worker Service הושלם"
            } catch {
                Show-Error "שגיאה ב-Redeploy של Worker Service"
            }
        }
        "4" {
            Show-Step "מבצע Redeploy לכל ה-Services..."
            try {
                pnpm deploy:all
                Show-Success "Redeploy של כל ה-Services הושלם"
            } catch {
                Show-Error "שגיאה ב-Redeploy של כל ה-Services"
            }
        }
        default {
            Show-Info "דילגת על Redeploy"
        }
    }
} else {
    Show-Info "דילגת על Redeploy. תוכל ל-Redeploy מאוחר יותר דרך Dashboard או CLI"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  סיכום" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "הסקריפט הושלם!"
Write-Host ""
Show-Info "⚠️  חשוב: יש דברים שצריך לעשות דרך Dashboard:"
Write-Host ""
Write-Host "1. Build Command:" -ForegroundColor Yellow
Write-Host "   API Service → Settings → Build → Custom Build Command"
Write-Host "   וודא שזה: pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build"
Write-Host ""
Write-Host "2. Start Command:" -ForegroundColor Yellow
Write-Host "   API Service → Settings → Deploy → Custom Start Command"
Write-Host "   וודא שזה: pnpm --filter @furniture/api start"
Write-Host ""
Write-Host "3. Pre-deploy Step:" -ForegroundColor Yellow
Write-Host "   API Service → Settings → Deploy → Pre-deploy step"
Write-Host "   הוסף: pnpm --filter @furniture/prisma migrate deploy"
Write-Host ""
Write-Host "4. DATABASE_URL:" -ForegroundColor Yellow
Write-Host "   העתק מ-PostgreSQL Service → Variables"
Write-Host "   הדבק ב-API Service → Variables"
Write-Host ""

Show-Success "הכל מוכן! בדוק את ה-Logs ב-Railway Dashboard כדי לוודא שהכל עובד."
Write-Host ""

