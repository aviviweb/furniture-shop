# Fix Worker Service Script
# This script helps fix the Worker Service on Railway

chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Worker Service Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Show-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "> $Message" -ForegroundColor Yellow
    Write-Host ""
}

function Show-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Show-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Show-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

Write-Host ""
Show-Info "The Worker Service needs REDIS_URL to work."
Show-Info "This script will help you check and fix it."
Write-Host ""

Show-Step "Step 1: Check if Redis Service exists"
Show-Info "Please check in Railway Dashboard:"
Show-Info "1. Go to Railway Dashboard"
Show-Info "2. Look for 'Redis' service"
Show-Info "3. Make sure it's Online (green dot)"
Write-Host ""

$hasRedis = Read-Host "Do you have a Redis Service? (y/n)"
if ($hasRedis -ne 'y') {
    Show-Error "You need to create a Redis Service first!"
    Show-Info "In Railway Dashboard:"
    Show-Info "1. Click '+ New'"
    Show-Info "2. Select 'Database'"
    Show-Info "3. Select 'Add Redis'"
    Show-Info "4. Wait 1-2 minutes for Redis to start"
    Write-Host ""
    Show-Info "After creating Redis, run this script again."
    exit 1
}

Show-Success "Redis Service exists"

Write-Host ""
Show-Step "Step 2: Get REDIS_URL from Redis Service"
Show-Info "In Railway Dashboard:"
Show-Info "1. Click on Redis Service"
Show-Info "2. Go to 'Variables' (left sidebar)"
Show-Info "3. Find 'REDIS_URL'"
Show-Info "4. Click on it and copy the value"
Write-Host ""

$redisUrl = Read-Host "Paste REDIS_URL here (or press Enter to skip)"
if (-not $redisUrl) {
    Show-Error "REDIS_URL is required! Please get it from Redis Service Variables."
    exit 1
}

Show-Success "REDIS_URL received"

Write-Host ""
Show-Step "Step 3: Set REDIS_URL in Worker Service"
Show-Info "Setting REDIS_URL in Worker Service..."

try {
    # Try to set via CLI
    $result = pnpm dlx railway variables set REDIS_URL=$redisUrl --service worker 2>&1
    if ($LASTEXITCODE -eq 0) {
        Show-Success "REDIS_URL set successfully via CLI"
    } else {
        Show-Info "CLI method failed. Please set it manually in Dashboard:"
        Show-Info "1. Go to Worker Service -> Variables"
        Show-Info "2. Click '+ New Variable' or 'Add Variable'"
        Show-Info "3. Name: REDIS_URL"
        Show-Info "4. Value: $redisUrl"
        Show-Info "5. Save"
    }
} catch {
    Show-Info "Please set REDIS_URL manually in Dashboard:"
    Show-Info "1. Go to Worker Service -> Variables"
    Show-Info "2. Click '+ New Variable' or 'Add Variable'"
    Show-Info "3. Name: REDIS_URL"
    Show-Info "4. Value: $redisUrl"
    Show-Info "5. Save"
}

Write-Host ""
Show-Step "Step 4: Verify Build and Start Commands"
Show-Info "Please verify in Railway Dashboard:"
Show-Info ""
Show-Info "Build Command should be:"
Write-Host "  pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate" -ForegroundColor Yellow
Show-Info ""
Show-Info "Start Command should be:"
Write-Host "  pnpm --filter @furniture/worker start" -ForegroundColor Yellow
Write-Host ""

$verifyCommands = Read-Host "Are Build and Start Commands correct? (y/n)"
if ($verifyCommands -ne 'y') {
    Show-Info "Please fix them in Dashboard:"
    Show-Info "Worker Service -> Settings -> Build -> Custom Build Command"
    Show-Info "Worker Service -> Settings -> Deploy -> Custom Start Command"
}

Write-Host ""
Show-Step "Step 5: Redeploy Worker Service"
Show-Info "Do you want to redeploy Worker Service now?"
$redeploy = Read-Host "Type 'y' to redeploy, or 'n' to skip (y/n)"

if ($redeploy -eq 'y') {
    Show-Info "Redeploying Worker Service..."
    try {
        pnpm deploy:worker
        Show-Success "Redeploy started"
    } catch {
        Show-Error "Error redeploying. Please redeploy manually in Dashboard:"
        Show-Info "Worker Service -> Deployments -> Redeploy"
    }
} else {
    Show-Info "Skipped redeploy. Please redeploy manually:"
    Show-Info "Worker Service -> Deployments -> Redeploy"
}

Write-Host ""
Show-Step "Step 6: Check Logs"
Show-Info "After redeploy, check the Logs in Railway Dashboard:"
Show-Info "Worker Service -> Logs"
Show-Info ""
Show-Info "Look for these messages:"
Write-Host "  Worker up with queues: ocr, ai-reports, notifications" -ForegroundColor Green
Write-Host "  REDIS_URL: OK Set" -ForegroundColor Green
Write-Host "  All processors loaded successfully" -ForegroundColor Green
Write-Host ""

Show-Info "If you see these messages, Worker is working!"
Show-Info "If you see errors, check the error message and fix accordingly."
Write-Host ""

Show-Success "Script completed!"
Show-Info "Check the Logs in Railway Dashboard to verify Worker is working."
Write-Host ""

