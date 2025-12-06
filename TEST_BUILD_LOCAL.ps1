# Test Build Commands Locally (PowerShell)
# זה רק לבדיקה מקומית - Railway מריץ ב-Linux שם && עובד!

Write-Host "Testing build commands locally..." -ForegroundColor Yellow
Write-Host "Note: Railway runs on Linux where && works!" -ForegroundColor Cyan
Write-Host ""

# API Build (PowerShell syntax)
Write-Host "Building API..." -ForegroundColor Yellow
pnpm install --frozen-lockfile; if ($LASTEXITCODE -eq 0) { 
    pnpm --filter @furniture/prisma generate; if ($LASTEXITCODE -eq 0) {
        pnpm --filter @furniture/api build
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ API build successful!" -ForegroundColor Green
} else {
    Write-Host "✗ API build failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Remember: Railway uses Linux, so && will work there!" -ForegroundColor Cyan

