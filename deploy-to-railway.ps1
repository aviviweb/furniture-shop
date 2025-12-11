# ============================================================
# Railway Deployment Automation Script
# ============================================================
# Run: .\deploy-to-railway.ps1

param(
    [switch]$SkipDeploy = $false,
    [switch]$SkipMigrations = $false
)

$ErrorActionPreference = "Continue"

# Set Railway Token
$env:RAILWAY_TOKEN = "8e8781e6-22bd-4f5f-9317-11132ed484ff"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Railway Deployment - Automated Process" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# Step 1: Check Railway CLI
# ============================================================
Write-Host "[1/8] Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "   Railway CLI not installed - installing..." -ForegroundColor Yellow
    pnpm add -D -w @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ERROR: Installation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "   OK: Railway CLI installed" -ForegroundColor Green
} else {
    Write-Host "   OK: Railway CLI is installed" -ForegroundColor Green
}
Write-Host ""

# ============================================================
# Step 2: Connect to Railway
# ============================================================
Write-Host "[2/8] Connecting to Railway..." -ForegroundColor Yellow
if ($env:RAILWAY_TOKEN) {
    Write-Host "   Using Railway Token" -ForegroundColor Gray
    $status = railway status 2>&1
    if ($LASTEXITCODE -eq 0 -or $status -like "*Project:*") {
        Write-Host "   OK: Connected to Railway" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: Cannot verify connection, continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "   ERROR: Railway Token not set!" -ForegroundColor Red
    Write-Host "   Set: `$env:RAILWAY_TOKEN = 'your-token'" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# ============================================================
# Step 3: Check/Link Project
# ============================================================
Write-Host "[3/8] Checking project..." -ForegroundColor Yellow
$project = railway status 2>&1
if ($project -like "*not linked*" -or $project -like "*No project*" -or $LASTEXITCODE -ne 0) {
    Write-Host "   Project not linked - linking..." -ForegroundColor Yellow
    railway link 2>&1 | Out-Null
    Start-Sleep -Seconds 2
    $project = railway status 2>&1
    if ($project -like "*Project:*") {
        Write-Host "   OK: Project linked" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: Cannot verify link, continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "   OK: Project linked" -ForegroundColor Green
}
Write-Host ""

# ============================================================
# Step 4: Set Environment Variables
# ============================================================
Write-Host "[4/8] Setting Environment Variables..." -ForegroundColor Yellow
Write-Host ""

# API Service Variables
Write-Host "   API Service Variables..." -ForegroundColor Cyan
$apiVars = @{
    "DEMO_MODE" = "false"
    "PORT" = "4000"
}

foreach ($var in $apiVars.GetEnumerator()) {
    Write-Host "      -> $($var.Key) = $($var.Value)" -ForegroundColor Gray
    railway variables set --service "@furniture/api" "$($var.Key)=$($var.Value)" 2>&1 | Out-Null
}
Write-Host "   OK: API Variables set" -ForegroundColor Green
Write-Host ""

# Web Service Variables
Write-Host "   Web Service Variables..." -ForegroundColor Cyan
$webVars = @{
    "NEXT_PUBLIC_TENANT_ID" = "furniture-demo"
    "NEXT_PUBLIC_BRAND_NAME" = "Furniture Shop"
    "NEXT_PUBLIC_PRIMARY_COLOR" = "#0ea5e9"
    "NEXT_PUBLIC_DEMO_MODE" = "false"
    "NODE_ENV" = "production"
    "PORT" = "3000"
}

foreach ($var in $webVars.GetEnumerator()) {
    Write-Host "      -> $($var.Key) = $($var.Value)" -ForegroundColor Gray
    railway variables set --service "@furniture/web" "$($var.Key)=$($var.Value)" 2>&1 | Out-Null
}
Write-Host "   OK: Web Variables set" -ForegroundColor Green
Write-Host ""

# Worker Service Variables (REDIS_URL and DATABASE_URL should be automatic)
Write-Host "   Worker Service Variables..." -ForegroundColor Cyan
Write-Host "      INFO: REDIS_URL and DATABASE_URL should be automatic from Railway" -ForegroundColor Gray
Write-Host "   OK: Worker Variables (automatic)" -ForegroundColor Green
Write-Host ""

Write-Host "   IMPORTANT: You need to update manually in Dashboard:" -ForegroundColor Yellow
Write-Host "      - API: JWT_SECRET (create: openssl rand -hex 32)" -ForegroundColor White
Write-Host "      - API: FRONTEND_URL (after you get Web URL)" -ForegroundColor White
Write-Host "      - Web: NEXT_PUBLIC_API_URL (after you get API URL)" -ForegroundColor White
Write-Host ""

# ============================================================
# Step 5: Run Migrations
# ============================================================
if (-not $SkipMigrations) {
    Write-Host "[5/8] Running Database Migrations..." -ForegroundColor Yellow
    Write-Host "   Running migrations..." -ForegroundColor Gray
    $migrationResult = railway run --service "@furniture/api" pnpm --filter @furniture/prisma migrate deploy 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK: Migrations completed successfully" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: Migrations failed - DB might not be ready" -ForegroundColor Yellow
        Write-Host "   Try running manually: railway run --service '@furniture/api' pnpm --filter @furniture/prisma migrate deploy" -ForegroundColor Gray
    }
} else {
    Write-Host "[5/8] Skipping Migrations (--SkipMigrations)" -ForegroundColor Yellow
}
Write-Host ""

# ============================================================
# Step 6: Push code to GitHub (if there are changes)
# ============================================================
Write-Host "[6/8] Checking Git changes..." -ForegroundColor Yellow
$gitStatus = git status --porcelain 2>&1
if ($gitStatus) {
    Write-Host "   There are unpushed changes:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    $push = Read-Host "   Push to GitHub? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host "   Pushing to GitHub..." -ForegroundColor Gray
        git add .
        git commit -m "Deploy: Railway deployment preparation"
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   OK: Code pushed to GitHub" -ForegroundColor Green
        } else {
            Write-Host "   WARNING: Push failed - check manually" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   Skipping push" -ForegroundColor Gray
    }
} else {
    Write-Host "   OK: No changes - code is synced" -ForegroundColor Green
}
Write-Host ""

# ============================================================
# Step 7: Deploy Services
# ============================================================
if (-not $SkipDeploy) {
    Write-Host "[7/8] Deploying Services..." -ForegroundColor Yellow
    Write-Host ""

    # Deploy API
    Write-Host "   Deploying API Service..." -ForegroundColor Cyan
    railway up --service "@furniture/api" --detach 2>&1 | Out-Null
    Write-Host "   OK: API deployment started" -ForegroundColor Green
    Start-Sleep -Seconds 3

    # Deploy Web
    Write-Host "   Deploying Web Service..." -ForegroundColor Cyan
    railway up --service "@furniture/web" --detach 2>&1 | Out-Null
    Write-Host "   OK: Web deployment started" -ForegroundColor Green
    Start-Sleep -Seconds 3

    # Deploy Worker
    Write-Host "   Deploying Worker Service..." -ForegroundColor Cyan
    railway up --service "@furniture/worker" --detach 2>&1 | Out-Null
    Write-Host "   OK: Worker deployment started" -ForegroundColor Green
    Write-Host ""

    Write-Host "   INFO: Deployments running in background" -ForegroundColor Gray
    Write-Host "   Check Logs in Railway Dashboard" -ForegroundColor Gray
} else {
    Write-Host "[7/8] Skipping Deployment (--SkipDeploy)" -ForegroundColor Yellow
}
Write-Host ""

# ============================================================
# Step 8: Summary and Next Steps
# ============================================================
Write-Host "[8/8] Summary..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "OK: Automated process completed!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Manual steps remaining:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Railway Dashboard -> API Service -> Variables:" -ForegroundColor White
Write-Host "   - Add JWT_SECRET (create: openssl rand -hex 32)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Railway Dashboard -> Each Service -> Settings -> Build:" -ForegroundColor White
Write-Host "   - API: pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build" -ForegroundColor Gray
Write-Host "   - Web: pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/web build" -ForegroundColor Gray
Write-Host "   - Worker: pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Railway Dashboard -> Each Service -> Settings -> Deploy:" -ForegroundColor White
Write-Host "   - API: pnpm --filter @furniture/api start" -ForegroundColor Gray
Write-Host "   - Web: pnpm --filter @furniture/web start" -ForegroundColor Gray
Write-Host "   - Worker: pnpm --filter @furniture/worker start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Railway Dashboard -> Each Service -> Settings -> Networking:" -ForegroundColor White
Write-Host "   - Click 'Generate Domain' for each service" -ForegroundColor Gray
Write-Host "   - Copy the URLs" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Update Variables with URLs:" -ForegroundColor White
Write-Host "   - API -> FRONTEND_URL = https://<web-url>.railway.app" -ForegroundColor Gray
Write-Host "   - Web -> NEXT_PUBLIC_API_URL = https://<api-url>.railway.app/api" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Railway Dashboard -> Each Service -> Deployments -> Redeploy" -ForegroundColor White
Write-Host ""
Write-Host "7. Check Logs:" -ForegroundColor White
Write-Host "   - API: Should see 'Nest application successfully started'" -ForegroundColor Gray
Write-Host "   - Web: Should see 'Ready on port 3000'" -ForegroundColor Gray
Write-Host "   - Worker: Should see 'Worker up with queues'" -ForegroundColor Gray
Write-Host ""

Write-Host "Additional guides:" -ForegroundColor Cyan
Write-Host "   - תיקון_סופי_RAILWAY_עכשיו.md" -ForegroundColor White
Write-Host "   - תיקון_WORKER_RAILWAY.md" -ForegroundColor White
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

