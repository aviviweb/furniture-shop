# Railway Auto-Login Script
# בודק ומתחבר ל-Railway אוטומטית

Write-Host "Checking Railway connection..." -ForegroundColor Yellow

# בדוק אם יש token ב-Environment Variable
if ($env:RAILWAY_TOKEN) {
    Write-Host "✓ RAILWAY_TOKEN found in environment" -ForegroundColor Green
    $env:RAILWAY_TOKEN = $env:RAILWAY_TOKEN
} else {
    Write-Host "⚠ RAILWAY_TOKEN not found in environment" -ForegroundColor Yellow
    Write-Host "Please set it with: `$env:RAILWAY_TOKEN='your-token'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or create a token at: https://railway.app/account/tokens" -ForegroundColor Cyan
    exit 1
}

# בדוק אם מחובר
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Already logged in: $whoami" -ForegroundColor Green
} else {
    Write-Host "Attempting to login with token..." -ForegroundColor Yellow
    railway login --token $env:RAILWAY_TOKEN
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Successfully logged in!" -ForegroundColor Green
    } else {
        Write-Host "✗ Login failed. Please check your token." -ForegroundColor Red
        exit 1
    }
}

# בדוק את הפרויקט
Write-Host ""
Write-Host "Checking project status..." -ForegroundColor Yellow
$status = railway status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Project linked" -ForegroundColor Green
    Write-Host $status -ForegroundColor Gray
} else {
    Write-Host "⚠ Project not linked. Run: railway link" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Railway connection ready! ✓" -ForegroundColor Green

