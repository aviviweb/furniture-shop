# Fix Demo Mode in Render - Simple Version
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
Write-Host "Connecting to Render API..." -ForegroundColor Cyan
Write-Host ""

try {
    # Get all services
    $services = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method Get
    
    foreach ($item in $services) {
        $service = $item.service
        $name = $service.name
        $id = $service.id
        
        if ($name -eq "furniture-api") {
            Write-Host "Checking furniture-api..." -ForegroundColor Yellow
            
            # Get env vars
            $envVars = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$id/env-vars" -Headers $headers -Method Get
            
            # Check DEMO_MODE
            $demoVar = $envVars.envVars | Where-Object { $_.key -eq "DEMO_MODE" }
            if ($demoVar -and $demoVar.value -ne "false") {
                Write-Host "  Updating DEMO_MODE=false..." -ForegroundColor Cyan
                $body = @{ value = "false" } | ConvertTo-Json
                Invoke-RestMethod -Uri "https://api.render.com/v1/services/$id/env-vars/DEMO_MODE" -Headers $headers -Method Put -Body $body | Out-Null
                Write-Host "  Updated!" -ForegroundColor Green
            } elseif (-not $demoVar) {
                Write-Host "  Adding DEMO_MODE=false..." -ForegroundColor Cyan
                $body = @{ key = "DEMO_MODE"; value = "false" } | ConvertTo-Json
                Invoke-RestMethod -Uri "https://api.render.com/v1/services/$id/env-vars" -Headers $headers -Method Post -Body $body | Out-Null
                Write-Host "  Added!" -ForegroundColor Green
            } else {
                Write-Host "  DEMO_MODE already false" -ForegroundColor Green
            }
        }
        
        if ($name -eq "furniture-web") {
            Write-Host "Checking furniture-web..." -ForegroundColor Yellow
            
            # Get env vars
            $envVars = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$id/env-vars" -Headers $headers -Method Get
            
            # Check NEXT_PUBLIC_DEMO_MODE
            $demoVar = $envVars.envVars | Where-Object { $_.key -eq "NEXT_PUBLIC_DEMO_MODE" }
            if ($demoVar -and $demoVar.value -ne "false") {
                Write-Host "  Updating NEXT_PUBLIC_DEMO_MODE=false..." -ForegroundColor Cyan
                $body = @{ value = "false" } | ConvertTo-Json
                Invoke-RestMethod -Uri "https://api.render.com/v1/services/$id/env-vars/NEXT_PUBLIC_DEMO_MODE" -Headers $headers -Method Put -Body $body | Out-Null
                Write-Host "  Updated!" -ForegroundColor Green
            } elseif (-not $demoVar) {
                Write-Host "  Adding NEXT_PUBLIC_DEMO_MODE=false..." -ForegroundColor Cyan
                $body = @{ key = "NEXT_PUBLIC_DEMO_MODE"; value = "false" } | ConvertTo-Json
                Invoke-RestMethod -Uri "https://api.render.com/v1/services/$id/env-vars" -Headers $headers -Method Post -Body $body | Out-Null
                Write-Host "  Added!" -ForegroundColor Green
            } else {
                Write-Host "  NEXT_PUBLIC_DEMO_MODE already false" -ForegroundColor Green
            }
        }
    }
    
    Write-Host ""
    Write-Host "Done!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now go to Render Dashboard and perform Manual Deploy for each service" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}
