# Set Railway Token permanently
$env:RAILWAY_TOKEN = "8e8781e6-22bd-4f5f-9317-11132ed484ff"

# Add to PowerShell Profile for persistence
$profilePath = $PROFILE
if (-not (Test-Path $profilePath)) {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
}

$tokenLine = '$env:RAILWAY_TOKEN = "8e8781e6-22bd-4f5f-9317-11132ed484ff"'
$profileContent = Get-Content $profilePath -ErrorAction SilentlyContinue

if ($profileContent -notcontains $tokenLine) {
    Add-Content -Path $profilePath -Value ""
    Add-Content -Path $profilePath -Value "# Railway Token"
    Add-Content -Path $profilePath -Value $tokenLine
    Write-Host "Token saved to PowerShell Profile" -ForegroundColor Green
} else {
    Write-Host "Token already in PowerShell Profile" -ForegroundColor Yellow
}

Write-Host "Railway Token is now set!" -ForegroundColor Green
Write-Host "Testing connection..." -ForegroundColor Yellow
railway status

