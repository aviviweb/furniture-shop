# Railway Setup Script
# מגדיר את כל ה-Environment Variables הנדרשים ל-Railway

param(
    [string]$ApiUrl = "",
    [string]$WebUrl = "",
    [string]$JwtSecret = "",
    [string]$TenantId = "furniture-demo"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Environment Variables Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if logged in
Write-Host "Checking Railway authentication..." -ForegroundColor Yellow
try {
    $whoami = railway whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Not logged in. Please run: railway login" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Logged in" -ForegroundColor Green
} catch {
    Write-Host "✗ Not logged in. Please run: railway login" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Get DATABASE_URL and REDIS_URL from Railway
Write-Host "Getting DATABASE_URL and REDIS_URL from Railway..." -ForegroundColor Yellow
try {
    $allVars = railway variables 2>&1
    $dbUrl = ($allVars | Select-String "DATABASE_URL").ToString()
    $redisUrl = ($allVars | Select-String "REDIS_URL").ToString()
    
    if ($dbUrl) {
        Write-Host "✓ DATABASE_URL found" -ForegroundColor Green
    } else {
        Write-Host "⚠ DATABASE_URL not found. Make sure PostgreSQL is added: railway add postgresql" -ForegroundColor Yellow
    }
    
    if ($redisUrl) {
        Write-Host "✓ REDIS_URL found" -ForegroundColor Green
    } else {
        Write-Host "⚠ REDIS_URL not found. Make sure Redis is added: railway add redis" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Could not get database URLs" -ForegroundColor Yellow
}
Write-Host ""

# Generate JWT_SECRET if not provided
if ([string]::IsNullOrEmpty($JwtSecret)) {
    Write-Host "Generating JWT_SECRET..." -ForegroundColor Yellow
    $JwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    Write-Host "✓ Generated JWT_SECRET" -ForegroundColor Green
}

# Prompt for URLs if not provided
if ([string]::IsNullOrEmpty($ApiUrl)) {
    $ApiUrl = Read-Host "Enter API service URL (e.g., https://api.railway.app)"
}

if ([string]::IsNullOrEmpty($WebUrl)) {
    $WebUrl = Read-Host "Enter Web service URL (e.g., https://web.railway.app)"
}

Write-Host ""
Write-Host "Setting up API service variables..." -ForegroundColor Yellow

# API Service Variables
$apiVars = @(
    "DEMO_MODE=false",
    "JWT_SECRET=$JwtSecret",
    "PORT=4000",
    "FRONTEND_URL=$WebUrl"
)

foreach ($var in $apiVars) {
    Write-Host "  Setting $var..." -ForegroundColor Gray
    railway variables set --service api $var 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ Set" -ForegroundColor Green
    } else {
        Write-Host "    ✗ Failed" -ForegroundColor Red
    }
}

# DATABASE_URL and REDIS_URL should be automatically available, but we can verify
Write-Host ""
Write-Host "Verifying DATABASE_URL and REDIS_URL for API service..." -ForegroundColor Yellow
$apiVarsCheck = railway variables --service api 2>&1
if ($apiVarsCheck -match "DATABASE_URL") {
    Write-Host "  ✓ DATABASE_URL available" -ForegroundColor Green
} else {
    Write-Host "  ⚠ DATABASE_URL not found (should be auto-injected)" -ForegroundColor Yellow
}
if ($apiVarsCheck -match "REDIS_URL") {
    Write-Host "  ✓ REDIS_URL available" -ForegroundColor Green
} else {
    Write-Host "  ⚠ REDIS_URL not found (should be auto-injected)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setting up Web service variables..." -ForegroundColor Yellow

# Web Service Variables
$webVars = @(
    "NEXT_PUBLIC_API_URL=$ApiUrl/api",
    "NEXT_PUBLIC_TENANT_ID=$TenantId",
    "NEXT_PUBLIC_BRAND_NAME=Furniture Shop",
    "NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9",
    "NEXT_PUBLIC_DEMO_MODE=false",
    "NODE_ENV=production",
    "PORT=3000"
)

foreach ($var in $webVars) {
    Write-Host "  Setting $var..." -ForegroundColor Gray
    railway variables set --service web $var 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ Set" -ForegroundColor Green
    } else {
        Write-Host "    ✗ Failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Setting up Worker service variables..." -ForegroundColor Yellow

# Worker Service Variables (DATABASE_URL and REDIS_URL should be auto-injected)
$workerVarsCheck = railway variables --service worker 2>&1
if ($workerVarsCheck -match "DATABASE_URL") {
    Write-Host "  ✓ DATABASE_URL available" -ForegroundColor Green
} else {
    Write-Host "  ⚠ DATABASE_URL not found (should be auto-injected)" -ForegroundColor Yellow
}
if ($workerVarsCheck -match "REDIS_URL") {
    Write-Host "  ✓ REDIS_URL available" -ForegroundColor Green
} else {
    Write-Host "  ⚠ REDIS_URL not found (should be auto-injected)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run database migrations:" -ForegroundColor White
Write-Host "   railway run --service api pnpm --filter @furniture/prisma migrate deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy services:" -ForegroundColor White
Write-Host "   railway up --service api" -ForegroundColor Gray
Write-Host "   railway up --service web" -ForegroundColor Gray
Write-Host "   railway up --service worker" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check logs:" -ForegroundColor White
Write-Host "   railway logs --service api" -ForegroundColor Gray
Write-Host "   railway logs --service web" -ForegroundColor Gray

