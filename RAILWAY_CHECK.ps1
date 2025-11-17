# Railway Status Check Script
# בודק את המצב הנוכחי של Railway deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Deployment Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "[1/7] Checking Railway CLI..." -ForegroundColor Yellow
$railwayVersion = railway --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Railway CLI installed: $railwayVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Railway CLI not found. Install with: pnpm add -g @railway/cli" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if logged in
Write-Host "[2/7] Checking Railway authentication..." -ForegroundColor Yellow
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Logged in: $whoami" -ForegroundColor Green
} else {
    Write-Host "✗ Not logged in. Run: railway login" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if project is linked
Write-Host "[3/7] Checking project link..." -ForegroundColor Yellow
$status = railway status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Project linked" -ForegroundColor Green
    Write-Host $status -ForegroundColor Gray
} else {
    Write-Host "⚠ Project not linked. Run: railway link" -ForegroundColor Yellow
}
Write-Host ""

# Check services
Write-Host "[4/7] Checking services..." -ForegroundColor Yellow
$services = railway service 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Services found:" -ForegroundColor Green
    Write-Host $services -ForegroundColor Gray
    
    # Check for required services
    $requiredServices = @("api", "web", "worker")
    foreach ($service in $requiredServices) {
        if ($services -match $service) {
            Write-Host "  ✓ $service service exists" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $service service missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠ Could not list services" -ForegroundColor Yellow
}
Write-Host ""

# Check environment variables
Write-Host "[5/7] Checking environment variables..." -ForegroundColor Yellow
$vars = railway variables 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Environment variables found" -ForegroundColor Green
    
    # Check for required variables
    $requiredVars = @("DATABASE_URL", "REDIS_URL", "JWT_SECRET", "DEMO_MODE")
    foreach ($var in $requiredVars) {
        if ($vars -match $var) {
            Write-Host "  ✓ $var is set" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $var is missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠ Could not list variables" -ForegroundColor Yellow
}
Write-Host ""

# Check API service variables
Write-Host "[6/7] Checking API service variables..." -ForegroundColor Yellow
$apiVars = railway variables --service api 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ API service variables:" -ForegroundColor Green
    $requiredApiVars = @("DATABASE_URL", "REDIS_URL", "JWT_SECRET", "DEMO_MODE", "FRONTEND_URL")
    foreach ($var in $requiredApiVars) {
        if ($apiVars -match $var) {
            Write-Host "  ✓ $var" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $var missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠ Could not check API variables" -ForegroundColor Yellow
}
Write-Host ""

# Check Web service variables
Write-Host "[7/7] Checking Web service variables..." -ForegroundColor Yellow
$webVars = railway variables --service web 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Web service variables:" -ForegroundColor Green
    $requiredWebVars = @("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_TENANT_ID", "NEXT_PUBLIC_DEMO_MODE", "NODE_ENV")
    foreach ($var in $requiredWebVars) {
        if ($webVars -match $var) {
            Write-Host "  ✓ $var" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $var missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠ Could not check Web variables" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Check complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host '1. If services are missing, create them: railway service create [name]' -ForegroundColor White
Write-Host '2. If variables are missing, set them: railway variables set --service [service] KEY=value' -ForegroundColor White
Write-Host '3. Run migrations: railway run --service api pnpm --filter @furniture/prisma migrate deploy' -ForegroundColor White
Write-Host '4. Deploy: railway up --service [service]' -ForegroundColor White

