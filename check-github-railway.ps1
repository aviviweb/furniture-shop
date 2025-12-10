# בדיקת חיבור GitHub ל-Railway

Write-Host "=== בדיקת חיבור GitHub ל-Railway ===" -ForegroundColor Cyan
Write-Host ""

# בדוק Git Remote
Write-Host "1. בודק Git Remote..." -ForegroundColor Yellow
try {
    $gitRemote = git remote get-url origin 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Git Remote: $gitRemote" -ForegroundColor Green
    } else {
        Write-Host "   ❌ אין Git Remote מוגדר" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ שגיאה בבדיקת Git Remote" -ForegroundColor Red
}

Write-Host ""

# בדוק Railway CLI
Write-Host "2. בודק Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Railway CLI מותקן: $railwayVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Railway CLI לא מותקן" -ForegroundColor Red
        Write-Host "   💡 התקן עם: pnpm add -g @railway/cli" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Railway CLI לא מותקן" -ForegroundColor Red
}

Write-Host ""

# בדוק Railway Status
Write-Host "3. בודק Railway Status..." -ForegroundColor Yellow
try {
    $railwayStatus = railway status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Railway Status:" -ForegroundColor Green
        Write-Host $railwayStatus
    } else {
        Write-Host "   ⚠️  Railway לא מקושר לפרויקט" -ForegroundColor Yellow
        Write-Host "   💡 חבר עם: railway link" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  לא ניתן לבדוק Railway Status" -ForegroundColor Yellow
}

Write-Host ""

# בדוק Railway Services
Write-Host "4. בודק Railway Services..." -ForegroundColor Yellow
try {
    $railwayServices = railway service list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Services:" -ForegroundColor Green
        Write-Host $railwayServices
    } else {
        Write-Host "   ⚠️  לא ניתן לבדוק Services" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  לא ניתן לבדוק Services" -ForegroundColor Yellow
}

Write-Host ""

# בדוק railway.toml
Write-Host "5. בודק railway.toml..." -ForegroundColor Yellow
if (Test-Path "railway.toml") {
    Write-Host "   ✅ railway.toml קיים" -ForegroundColor Green
    $tomlContent = Get-Content "railway.toml" -Raw
    if ($tomlContent -match "services\.(api|web|worker)") {
        Write-Host "   ✅ מכיל הגדרות services" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  לא מכיל הגדרות services" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ railway.toml לא קיים" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== סיכום ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 לבדיקה מלאה:" -ForegroundColor Yellow
Write-Host "   1. פתח Railway Dashboard → Settings → Source" -ForegroundColor White
Write-Host "   2. בדוק אם יש 'GitHub: <repo-name>'" -ForegroundColor White
Write-Host "   3. אם לא, לחץ 'Connect GitHub'" -ForegroundColor White
Write-Host ""

