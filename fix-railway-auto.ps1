# Auto-fix script for Railway deployment issues
# Run: .\fix-railway-auto.ps1

# Set Railway Token
$env:RAILWAY_TOKEN = "8e8781e6-22bd-4f5f-9317-11132ed484ff"

Write-Host "Starting Railway auto-fix..." -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "Railway CLI not installed!" -ForegroundColor Red
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    pnpm add -D -w @railway/cli
    Write-Host "Railway CLI installed" -ForegroundColor Green
} else {
    Write-Host "Railway CLI is installed" -ForegroundColor Green
}

Write-Host ""

# Check connection
Write-Host "Checking Railway connection..." -ForegroundColor Yellow
if ($env:RAILWAY_TOKEN) {
    Write-Host "Railway Token is set, using token authentication" -ForegroundColor Green
    # Test connection with status (don't use whoami as it may fail with token)
    $status = railway status 2>&1
    if ($LASTEXITCODE -eq 0 -or $status -like "*Project:*") {
        Write-Host "Connected to Railway (using token)" -ForegroundColor Green
        Write-Host "Project status: $status" -ForegroundColor Gray
    } else {
        Write-Host "Warning: Token might be invalid, but continuing..." -ForegroundColor Yellow
    }
} else {
    # Only try login if no token is set
    $whoami = railway whoami 2>&1
    if ($LASTEXITCODE -ne 0 -or $whoami -like "*Unauthorized*" -or $whoami -like "*not logged*") {
        Write-Host "Not connected to Railway" -ForegroundColor Yellow
        Write-Host "Connecting to Railway..." -ForegroundColor Yellow
        railway login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Connection failed!" -ForegroundColor Red
            Write-Host "Try: railway login" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "Connected to Railway: $whoami" -ForegroundColor Green
    }
}

Write-Host ""

# Check Project
Write-Host "Checking Project..." -ForegroundColor Yellow
$project = railway status 2>&1
if ($project -like "*not linked*" -or $project -like "*No project*" -or $LASTEXITCODE -ne 0) {
    Write-Host "Project not linked or connection issue" -ForegroundColor Yellow
    Write-Host "Attempting to link Project..." -ForegroundColor Yellow
    railway link 2>&1 | Out-Null
    # Re-check status
    $project = railway status 2>&1
    if ($project -like "*Project:*") {
        Write-Host "Project is linked: $project" -ForegroundColor Green
    } else {
        Write-Host "Warning: Could not verify project link, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "Project is linked: $project" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Setting Environment Variables" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# API Service Variables
Write-Host "Setting Variables for API Service..." -ForegroundColor Yellow
$apiVars = @{
    "DEMO_MODE" = "false"
    "PORT" = "4000"
}

foreach ($var in $apiVars.GetEnumerator()) {
    Write-Host "  -> $($var.Key) = $($var.Value)" -ForegroundColor Gray
    railway variables set --service "@furniture/api" "$($var.Key)=$($var.Value)" 2>&1 | Out-Null
}

Write-Host "API Variables set" -ForegroundColor Green
Write-Host ""

# Web Service Variables
Write-Host "Setting Variables for Web Service..." -ForegroundColor Yellow
Write-Host "IMPORTANT: You need to update NEXT_PUBLIC_API_URL manually in Dashboard!" -ForegroundColor Yellow

$webVars = @{
    "NEXT_PUBLIC_TENANT_ID" = "furniture-demo"
    "NEXT_PUBLIC_BRAND_NAME" = "Furniture Shop"
    "NEXT_PUBLIC_PRIMARY_COLOR" = "#0ea5e9"
    "NEXT_PUBLIC_DEMO_MODE" = "false"
    "NODE_ENV" = "production"
    "PORT" = "3000"
}

foreach ($var in $webVars.GetEnumerator()) {
    Write-Host "  -> $($var.Key) = $($var.Value)" -ForegroundColor Gray
    railway variables set --service "@furniture/web" "$($var.Key)=$($var.Value)" 2>&1 | Out-Null
}

Write-Host "Web Variables set" -ForegroundColor Green
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Running Database Migrations" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Running Migrations..." -ForegroundColor Yellow
railway run --service "@furniture/api" pnpm --filter @furniture/prisma migrate deploy 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Migrations completed successfully" -ForegroundColor Green
} else {
    Write-Host "Migrations failed - DB might not be ready" -ForegroundColor Yellow
    Write-Host "Try running manually: pnpm railway:migrate" -ForegroundColor Yellow
}

Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Manual Steps Required in Dashboard" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "There are a few things you need to do manually in Railway Dashboard:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Web Service -> Variables:" -ForegroundColor Cyan
Write-Host "   Add: NEXT_PUBLIC_API_URL=https://<api-service-url>.railway.app/api" -ForegroundColor White
Write-Host "   (Update after you get the API service URL)" -ForegroundColor Gray
Write-Host ""

Write-Host "2. API Service -> Settings -> Deploy -> Pre-deploy step:" -ForegroundColor Cyan
Write-Host "   Add: pnpm --filter @furniture/prisma migrate deploy" -ForegroundColor White
Write-Host ""

Write-Host "3. API Service -> Variables:" -ForegroundColor Cyan
Write-Host "   Add: JWT_SECRET=<create strong secret>" -ForegroundColor White
Write-Host "   (Run: openssl rand -hex 32)" -ForegroundColor Gray
Write-Host ""

Write-Host "4. API Service -> Variables:" -ForegroundColor Cyan
Write-Host "   Add: FRONTEND_URL=https://<web-service-url>.railway.app" -ForegroundColor White
Write-Host "   (Update after you get the Web service URL)" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Verify Build Commands are correct:" -ForegroundColor Cyan
Write-Host "   API: pnpm install --frozen-lockfile ; pnpm --filter @furniture/prisma generate ; pnpm --filter @furniture/api build" -ForegroundColor White
Write-Host "   Web: pnpm install --frozen-lockfile ; pnpm --filter @furniture/prisma generate ; pnpm --filter @furniture/web build" -ForegroundColor White
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Deployment" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$deploy = Read-Host "Do you want to deploy now? (y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "Deploying API..." -ForegroundColor Yellow
    railway up --service "@furniture/api" 2>&1
    
    Write-Host ""
    Write-Host "Deploying Web..." -ForegroundColor Yellow
    railway up --service "@furniture/web" 2>&1
    
    Write-Host ""
    Write-Host "Deploying Worker..." -ForegroundColor Yellow
    railway up --service "@furniture/worker" 2>&1
    
    Write-Host ""
    Write-Host "Deployment completed!" -ForegroundColor Green
    Write-Host "Check the Logs in Railway Dashboard" -ForegroundColor Yellow
} else {
    Write-Host "Skipping deployment" -ForegroundColor Yellow
    Write-Host "Run: pnpm deploy:api ; pnpm deploy:web" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Auto-fix completed!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "See also:" -ForegroundColor Cyan
Write-Host "   - QUICK_FIX_RAILWAY.md" -ForegroundColor White
Write-Host "   - RAILWAY_DEPLOYMENT_ISSUES.md" -ForegroundColor White
Write-Host "   - FIX_WEB_BUILD_FAILURE.md" -ForegroundColor White
Write-Host ""
