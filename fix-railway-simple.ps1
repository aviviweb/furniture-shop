# Railway Fix Script - Simple Version
# Run this script to fix Railway deployment issues

chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Railway Fix Script" -ForegroundColor Cyan
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

# Check if pnpm is installed
Show-Step "Checking installations..."
try {
    $pnpmVersion = pnpm --version
    Show-Success "pnpm installed: $pnpmVersion"
} catch {
    Show-Error "pnpm is not installed! Please install it first."
    exit 1
}

# Check if railway CLI is available
try {
    $railwayVersion = pnpm dlx railway --version 2>&1
    Show-Success "Railway CLI is available"
} catch {
    Show-Info "Installing Railway CLI..."
    pnpm dlx railway --version | Out-Null
    Show-Success "Railway CLI installed"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Check Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Show-Step "Checking API Service Variables..."
try {
    pnpm dlx railway variables --service api
    Show-Success "API Service Variables loaded"
} catch {
    Show-Error "Error loading API Service Variables"
}

Write-Host ""
Show-Step "Checking Web Service Variables..."
try {
    pnpm dlx railway variables --service web
    Show-Success "Web Service Variables loaded"
} catch {
    Show-Error "Error loading Web Service Variables"
}

Write-Host ""
Show-Step "Checking Worker Service Variables..."
try {
    pnpm dlx railway variables --service worker
    Show-Success "Worker Service Variables loaded"
} catch {
    Show-Error "Error loading Worker Service Variables"
}

Write-Host ""
Show-Step "Checking DATABASE_URL in PostgreSQL Service..."
try {
    pnpm dlx railway variables --service postgres | Select-String "DATABASE_URL"
    Show-Success "DATABASE_URL found in PostgreSQL Service"
} catch {
    Show-Error "Error loading DATABASE_URL from PostgreSQL Service"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Set Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "Do you want to set Environment Variables automatically?"
$setVars = Read-Host "Type 'y' to confirm, or 'n' to skip (y/n)"

if ($setVars -eq 'y') {
    Show-Step "Setting DEMO_MODE=false in API Service..."
    try {
        pnpm dlx railway variables set DEMO_MODE=false --service api
        Show-Success "DEMO_MODE set to false"
    } catch {
        Show-Error "Error setting DEMO_MODE"
    }

    Write-Host ""
    Show-Info "Setting FRONTEND_URL in API Service"
    Show-Info "Enter the URL of Web Service (e.g., https://your-web.railway.app)"
    $frontendUrl = Read-Host "Enter FRONTEND_URL (or press Enter to skip)"
    if ($frontendUrl) {
        try {
            pnpm dlx railway variables set FRONTEND_URL=$frontendUrl --service api
            Show-Success "FRONTEND_URL set"
        } catch {
            Show-Error "Error setting FRONTEND_URL"
        }
    }

    Write-Host ""
    Show-Info "Setting NEXT_PUBLIC_API_URL in Web Service"
    Show-Info "Enter the URL of API Service (e.g., https://your-api.railway.app/api)"
    $apiUrl = Read-Host "Enter NEXT_PUBLIC_API_URL (or press Enter to skip)"
    if ($apiUrl) {
        try {
            pnpm dlx railway variables set NEXT_PUBLIC_API_URL=$apiUrl --service web
            Show-Success "NEXT_PUBLIC_API_URL set"
        } catch {
            Show-Error "Error setting NEXT_PUBLIC_API_URL"
        }
    }
} else {
    Show-Info "Skipped setting Variables. You can set them later via Dashboard or CLI."
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Run Migrations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "Do you want to run Migrations now?"
$runMigrations = Read-Host "Type 'y' to confirm, or 'n' to skip (y/n)"

if ($runMigrations -eq 'y') {
    Show-Step "Running Migrations in API Service..."
    try {
        pnpm railway:migrate
        Show-Success "Migrations completed successfully"
    } catch {
        Show-Error "Error running Migrations"
        Show-Info "Try running manually: pnpm railway:migrate"
    }
} else {
    Show-Info "Skipped Migrations. Remember to run them before Deployment!"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 4: Check Logs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "Do you want to check Logs now?"
$checkLogs = Read-Host "Type 'y' to confirm, or 'n' to skip (y/n)"

if ($checkLogs -eq 'y') {
    Write-Host ""
    Show-Step "Checking API Service Logs (last 10 lines)..."
    try {
        pnpm dlx railway logs --service api --tail 10
    } catch {
        Show-Error "Error loading API Service Logs"
    }

    Write-Host ""
    Show-Step "Checking Web Service Logs (last 10 lines)..."
    try {
        pnpm dlx railway logs --service web --tail 10
    } catch {
        Show-Error "Error loading Web Service Logs"
    }

    Write-Host ""
    Show-Step "Checking Worker Service Logs (last 10 lines)..."
    try {
        pnpm dlx railway logs --service worker --tail 10
    } catch {
        Show-Error "Error loading Worker Service Logs"
    }
} else {
    Show-Info "Skipped checking Logs. You can check later with: pnpm railway:logs:api"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 5: Redeploy Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "Do you want to Redeploy Services now?"
$redeploy = Read-Host "Type 'y' to confirm, or 'n' to skip (y/n)"

if ($redeploy -eq 'y') {
    Write-Host ""
    Show-Info "Which Service do you want to Redeploy?"
    Write-Host "1. API Service"
    Write-Host "2. Web Service"
    Write-Host "3. Worker Service"
    Write-Host "4. All Services"
    $serviceChoice = Read-Host "Enter number (1-4)"

    switch ($serviceChoice) {
        "1" {
            Show-Step "Redeploying API Service..."
            try {
                pnpm deploy:api
                Show-Success "API Service Redeploy completed"
            } catch {
                Show-Error "Error redeploying API Service"
            }
        }
        "2" {
            Show-Step "Redeploying Web Service..."
            try {
                pnpm deploy:web
                Show-Success "Web Service Redeploy completed"
            } catch {
                Show-Error "Error redeploying Web Service"
            }
        }
        "3" {
            Show-Step "Redeploying Worker Service..."
            try {
                pnpm deploy:worker
                Show-Success "Worker Service Redeploy completed"
            } catch {
                Show-Error "Error redeploying Worker Service"
            }
        }
        "4" {
            Show-Step "Redeploying All Services..."
            try {
                pnpm deploy:all
                Show-Success "All Services Redeploy completed"
            } catch {
                Show-Error "Error redeploying All Services"
            }
        }
        default {
            Show-Info "Skipped Redeploy"
        }
    }
} else {
    Show-Info "Skipped Redeploy. You can redeploy later via Dashboard or CLI"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Show-Info "Script completed!"
Write-Host ""
Show-Info "IMPORTANT: Some things must be done via Dashboard:"
Write-Host ""
Write-Host "1. Build Command:" -ForegroundColor Yellow
Write-Host "   API Service -> Settings -> Build -> Custom Build Command"
Write-Host "   Should be: pnpm install --frozen-lockfile && pnpm --filter @furniture/prisma generate && pnpm --filter @furniture/api build"
Write-Host ""
Write-Host "2. Start Command:" -ForegroundColor Yellow
Write-Host "   API Service -> Settings -> Deploy -> Custom Start Command"
Write-Host "   Should be: pnpm --filter @furniture/api start"
Write-Host ""
Write-Host "3. Pre-deploy Step:" -ForegroundColor Yellow
Write-Host "   API Service -> Settings -> Deploy -> Pre-deploy step"
Write-Host "   Add: pnpm --filter @furniture/prisma migrate deploy"
Write-Host ""
Write-Host "4. DATABASE_URL:" -ForegroundColor Yellow
Write-Host "   Copy from PostgreSQL Service -> Variables"
Write-Host "   Paste to API Service -> Variables"
Write-Host ""

Show-Success "All done! Check the Logs in Railway Dashboard to verify everything is working."
Write-Host ""

