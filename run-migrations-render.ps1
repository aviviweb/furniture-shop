# Run Migrations on Render via API
param([string]$ApiKey = $env:RENDER_API_KEY)

if (-not $ApiKey) {
    Write-Host "ERROR: RENDER_API_KEY not set!" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "Finding furniture-api service..." -ForegroundColor Cyan
Write-Host ""

try {
    # Get all services
    $services = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method Get
    
    $apiService = $null
    foreach ($item in $services) {
        if ($item.service.name -eq "furniture-api") {
            $apiService = $item.service
            break
        }
    }
    
    if (-not $apiService) {
        Write-Host "ERROR: furniture-api service not found!" -ForegroundColor Red
        exit 1
    }
    
    $serviceId = $apiService.id
    Write-Host "Found furniture-api (ID: $serviceId)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Running migrations..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Command: pnpm --filter @furniture/prisma migrate deploy" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "NOTE: Render API doesn't support running commands directly." -ForegroundColor Yellow
    Write-Host "You need to run migrations via Shell in Render Dashboard." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://dashboard.render.com/web/$serviceId" -ForegroundColor White
    Write-Host "2. Click 'Shell' in the left menu" -ForegroundColor White
    Write-Host "3. Run: pnpm --filter @furniture/prisma migrate deploy" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}

