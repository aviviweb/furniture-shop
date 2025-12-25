# Render Status Checker
# בודק את הסטטוס של כל ה-services ב-Render

param(
    [string]$ApiKey = $env:RENDER_API_KEY,
    [string]$ServiceName = ""
)

# Colors for output
function Write-Status {
    param([string]$Status, [string]$Service)
    switch ($Status.ToLower()) {
        "live" { Write-Host "✓ $Service : LIVE" -ForegroundColor Green }
        "building" { Write-Host "⏳ $Service : BUILDING..." -ForegroundColor Yellow }
        "deploying" { Write-Host "⏳ $Service : DEPLOYING..." -ForegroundColor Yellow }
        "failed" { Write-Host "✗ $Service : FAILED" -ForegroundColor Red }
        "suspended" { Write-Host "⚠ $Service : SUSPENDED" -ForegroundColor Yellow }
        default { Write-Host "? $Service : $Status" -ForegroundColor Gray }
    }
}

Write-Host "`n🔍 Render Status Checker`n" -ForegroundColor Cyan

if (-not $ApiKey) {
    Write-Host "❌ ERROR: RENDER_API_KEY לא מוגדר!" -ForegroundColor Red
    Write-Host "`nאיך להגדיר:" -ForegroundColor Yellow
    Write-Host "1. לך ל: https://dashboard.render.com/account/api-keys" -ForegroundColor White
    Write-Host "2. צור API Key חדש" -ForegroundColor White
    Write-Host "3. הרץ: `$env:RENDER_API_KEY='your-api-key'" -ForegroundColor White
    Write-Host "   או: .\check-render-status.ps1 -ApiKey 'your-api-key'`n" -ForegroundColor White
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Accept" = "application/json"
}

try {
    Write-Host "📡 מחבר ל-Render API...`n" -ForegroundColor Cyan
    
    # Get all services
    $servicesUrl = "https://api.render.com/v1/services"
    $response = Invoke-RestMethod -Uri $servicesUrl -Headers $headers -Method Get
    
    $services = @("furniture-web", "furniture-api", "furniture-worker")
    $foundServices = @()
    
    foreach ($service in $response) {
        if ($services -contains $service.service.name) {
            $foundServices += $service.service
        }
    }
    
    if ($foundServices.Count -eq 0) {
        Write-Host "⚠ לא נמצאו services. ודא שהשמות נכונים." -ForegroundColor Yellow
        Write-Host "Services שנמצאו:" -ForegroundColor Gray
        foreach ($service in $response) {
            Write-Host "  - $($service.service.name)" -ForegroundColor Gray
        }
        exit 0
    }
    
    Write-Host "📊 סטטוס Services:`n" -ForegroundColor Cyan
    
    foreach ($service in $foundServices) {
        $status = $service.serviceDetails.deploy.status
        $name = $service.service.name
        $serviceId = $service.service.id
        
        Write-Status -Status $status -Service $name
        
        if ($status -eq "failed" -or $status -eq "build_failed") {
            Write-Host "   Service ID: $serviceId" -ForegroundColor Gray
            Write-Host "   🔗 לבדיקת Logs: https://dashboard.render.com/web/$serviceId/logs" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✅ בדיקה הושלמה!`n" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ שגיאה בחיבור ל-Render API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nודא ש:" -ForegroundColor Yellow
    Write-Host "1. API Key תקין" -ForegroundColor White
    Write-Host "2. יש חיבור לאינטרנט" -ForegroundColor White
    Write-Host "3. ה-API Key יש לו הרשאות מתאימות`n" -ForegroundColor White
    exit 1
}

