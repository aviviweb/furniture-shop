# Railway Token Setup Script
# עוזר להגדיר Railway Token בצורה בטוחה

param(
    [Parameter(Mandatory=$false)]
    [string]$Token = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Token Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# אם לא סופק token, בקש מהמשתמש
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Please enter your Railway token:" -ForegroundColor Yellow
    Write-Host "(You can create one at: https://railway.app/account/tokens)" -ForegroundColor Gray
    Write-Host ""
    $Token = Read-Host "Token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Token)
    $Token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "✗ Token is required!" -ForegroundColor Red
    exit 1
}

Write-Host "Setting up Railway token..." -ForegroundColor Yellow
Write-Host ""

# בדוק אם ה-Profile קיים
$profilePath = $PROFILE
$profileDir = Split-Path -Parent $profilePath

if (-not (Test-Path $profileDir)) {
    Write-Host "Creating PowerShell profile directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

# בדוק אם יש כבר RAILWAY_TOKEN ב-Profile
$profileContent = ""
if (Test-Path $profilePath) {
    $profileContent = Get-Content $profilePath -Raw
}

# הסר הגדרות קודמות של RAILWAY_TOKEN
$lines = $profileContent -split "`n" | Where-Object { 
    $_ -notmatch '^\s*\$env:RAILWAY_TOKEN\s*=' 
}

# הוסף את ה-token החדש
$newLine = "`$env:RAILWAY_TOKEN=`"$Token`""
$lines += $newLine

# שמור את ה-Profile
$lines -join "`n" | Set-Content $profilePath -Encoding UTF8

Write-Host "✓ Token saved to PowerShell profile" -ForegroundColor Green
Write-Host "  Profile location: $profilePath" -ForegroundColor Gray
Write-Host ""

# הגדר גם לסשן הנוכחי
$env:RAILWAY_TOKEN = $Token
Write-Host "✓ Token set for current session" -ForegroundColor Green
Write-Host ""

# בדוק את החיבור
Write-Host "Testing Railway connection..." -ForegroundColor Yellow
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully connected to Railway!" -ForegroundColor Green
    Write-Host "  $whoami" -ForegroundColor Gray
} else {
    Write-Host "⚠ Could not verify connection. Please check your token." -ForegroundColor Yellow
    Write-Host "  Try running: railway whoami" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The token is now saved in your PowerShell profile." -ForegroundColor Green
Write-Host "It will be loaded automatically in new PowerShell sessions." -ForegroundColor Green
Write-Host ""
Write-Host "To reload in current session, run:" -ForegroundColor Yellow
Write-Host "  . `$PROFILE" -ForegroundColor Gray
Write-Host ""

