# Fix Demo Mode in Render
# בודק ומעדכן DEMO_MODE variables ב-Render

param(
    [string]$ApiKey = $env:RENDER_API_KEY
)

Write-Host "`n🔧 Fix Demo Mode in Render`n" -ForegroundColor Cyan

if (-not $ApiKey) {
    Write-Host "❌ ERROR: RENDER_API_KEY לא מוגדר!" -ForegroundColor Red
    Write-Host "`nאיך להגדיר:" -ForegroundColor Yellow
    Write-Host "1. לך ל: https://dashboard.render.com/account/api-keys" -ForegroundColor White
    Write-Host "2. צור API Key חדש" -ForegroundColor White
    Write-Host "3. הרץ: `$env:RENDER_API_KEY='your-api-key'" -ForegroundColor White
    Write-Host "   או: .\fix-demo-mode-render.ps1 -ApiKey 'your-api-key'`n" -ForegroundColor White
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

try {
    Write-Host "📡 מחבר ל-Render API...`n" -ForegroundColor Cyan
    
    # Get all services
    $servicesUrl = "https://api.render.com/v1/services"
    $response = Invoke-RestMethod -Uri $servicesUrl -Headers $headers -Method Get
    
    $targetServices = @("furniture-api", "furniture-web")
    $foundServices = @()
    
    foreach ($service in $response) {
        if ($targetServices -contains $service.service.name) {
            $foundServices += $service.service
        }
    }
    
    if ($foundServices.Count -eq 0) {
        Write-Host "⚠ לא נמצאו services. ודא שהשמות נכונים." -ForegroundColor Yellow
        exit 0
    }
    
    Write-Host "📊 בודק ומעדכן Environment Variables:`n" -ForegroundColor Cyan
    
    foreach ($service in $foundServices) {
        $serviceName = $service.service.name
        $serviceId = $service.service.id
        
        Write-Host "🔍 בודק $serviceName (ID: $serviceId)..." -ForegroundColor Yellow
        
        # Get current environment variables
        $envUrl = "https://api.render.com/v1/services/$serviceId/env-vars"
        $envVars = Invoke-RestMethod -Uri $envUrl -Headers $headers -Method Get
        
        $needsUpdate = $false
        $varsToUpdate = @{}
        
        if ($serviceName -eq "furniture-api") {
            $demoModeVar = $envVars.envVars | Where-Object { $_.key -eq "DEMO_MODE" }
            $currentDemoMode = if ($demoModeVar) { $demoModeVar.value } else { $null }
            if ($currentDemoMode -ne "false") {
                Write-Host "  WARNING: DEMO_MODE = '$currentDemoMode' (needs to be 'false')" -ForegroundColor Yellow
                $varsToUpdate["DEMO_MODE"] = "false"
                $needsUpdate = $true
            } else {
                Write-Host "  OK: DEMO_MODE = 'false' (correct)" -ForegroundColor Green
            }
        }
        
        if ($serviceName -eq "furniture-web") {
            $demoModeVar = $envVars.envVars | Where-Object { $_.key -eq "NEXT_PUBLIC_DEMO_MODE" }
            $currentDemoMode = if ($demoModeVar) { $demoModeVar.value } else { $null }
            if ($currentDemoMode -ne "false") {
                Write-Host "  WARNING: NEXT_PUBLIC_DEMO_MODE = '$currentDemoMode' (needs to be 'false')" -ForegroundColor Yellow
                $varsToUpdate["NEXT_PUBLIC_DEMO_MODE"] = "false"
                $needsUpdate = $true
            } else {
                Write-Host "  OK: NEXT_PUBLIC_DEMO_MODE = 'false' (correct)" -ForegroundColor Green
            }
        }
        
        if ($needsUpdate) {
            Write-Host "  📝 מעדכן Environment Variables..." -ForegroundColor Cyan
            
            foreach ($key in $varsToUpdate.Keys) {
                $value = $varsToUpdate[$key]
                $body = @{
                    key = $key
                    value = $value
                } | ConvertTo-Json
                
                try {
                    # Render API uses PUT for updating env vars
                    $putUrl = "https://api.render.com/v1/services/$serviceId/env-vars/$key"
                    $putBody = @{
                        value = $value
                    } | ConvertTo-Json
                    
                    Invoke-RestMethod -Uri $putUrl -Headers $headers -Method Put -Body $putBody | Out-Null
                    Write-Host "  ✅ $key = '$value' עודכן!" -ForegroundColor Green
                } catch {
                    # If PUT fails, try POST (for new variables)
                    try {
                        $postBody = @{
                            key = $key
                            value = $value
                        } | ConvertTo-Json
                        Invoke-RestMethod -Uri $envUrl -Headers $headers -Method Post -Body $postBody | Out-Null
                        Write-Host "  ✅ $key = '$value' נוסף!" -ForegroundColor Green
                    } catch {
                        Write-Host "  ❌ שגיאה בעדכון $key : $($_.Exception.Message)" -ForegroundColor Red
                    }
                }
            }
            
            Write-Host "  💡 צריך לבצע Manual Deploy של $serviceName כדי שהשינויים ייכנסו לתוקף" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✅ בדיקה הושלמה!`n" -ForegroundColor Green
    Write-Host "💡 עכשיו לך ל-Render Dashboard ולבצע Manual Deploy לכל service שעודכן`n" -ForegroundColor Yellow
    
} catch {
    Write-Host "`n❌ שגיאה בחיבור ל-Render API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nודא ש:" -ForegroundColor Yellow
    Write-Host "1. API Key תקין" -ForegroundColor White
    Write-Host "2. יש חיבור לאינטרנט" -ForegroundColor White
    Write-Host "3. ה-API Key יש לו הרשאות מתאימות`n" -ForegroundColor White
    exit 1
}

