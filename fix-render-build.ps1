# Render Build Fixer
# בודק ותיקן שגיאות Build ב-Render

param(
    [string]$ApiKey = $env:RENDER_API_KEY
)

Write-Host "`n🔧 Render Build Fixer`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "render.yaml")) {
    Write-Host "❌ ERROR: render.yaml לא נמצא!" -ForegroundColor Red
    Write-Host "ודא שאתה בתיקיית הפרויקט.`n" -ForegroundColor Yellow
    exit 1
}

# Check git status
Write-Host "📋 בודק Git status...`n" -ForegroundColor Cyan
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "⚠ יש שינויים שלא נשמרו:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    Write-Host "`nהאם אתה רוצה לשמור את השינויים לפני המשך? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "`n💾 שומר שינויים...`n" -ForegroundColor Cyan
        git add .
        $commitMessage = Read-Host "הכנס הודעת commit"
        if (-not $commitMessage) {
            $commitMessage = "Fix: Update files for Render deployment"
        }
        git commit -m $commitMessage
        Write-Host "✅ שינויים נשמרו!`n" -ForegroundColor Green
    }
}

# Check if pnpm-lock.yaml is up to date
Write-Host "🔍 בודק pnpm-lock.yaml...`n" -ForegroundColor Cyan

try {
    pnpm install --dry-run 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ pnpm-lock.yaml לא מעודכן!" -ForegroundColor Yellow
        Write-Host "מעדכן...`n" -ForegroundColor Cyan
        pnpm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ pnpm-lock.yaml עודכן!`n" -ForegroundColor Green
            git add pnpm-lock.yaml
            git commit -m "Fix: Update pnpm-lock.yaml"
        }
    } else {
        Write-Host "✅ pnpm-lock.yaml מעודכן!`n" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ לא ניתן לבדוק pnpm-lock.yaml (pnpm לא מותקן?)`n" -ForegroundColor Yellow
}

# Check prisma package.json
Write-Host "🔍 בודק Prisma configuration...`n" -ForegroundColor Cyan
$prismaPackage = Get-Content "packages/prisma/package.json" | ConvertFrom-Json

if ($prismaPackage.dependencies.prisma) {
    Write-Host "✅ Prisma ב-dependencies (תקין)`n" -ForegroundColor Green
} else {
    Write-Host "⚠ Prisma לא ב-dependencies!" -ForegroundColor Yellow
    Write-Host "מתקן...`n" -ForegroundColor Cyan
    
    if ($prismaPackage.devDependencies.prisma) {
        $prismaVersion = $prismaPackage.devDependencies.prisma
        $prismaPackage.dependencies.prisma = $prismaVersion
        $prismaPackage.PSObject.Properties.Remove('devDependencies')
        
        $prismaPackage | ConvertTo-Json -Depth 10 | Set-Content "packages/prisma/package.json"
        Write-Host "✅ Prisma הועבר ל-dependencies!`n" -ForegroundColor Green
        
        # Update lockfile
        pnpm install
        git add packages/prisma/package.json pnpm-lock.yaml
        git commit -m "Fix: Move prisma CLI to dependencies for production builds"
    }
}

# Push to GitHub
Write-Host "📤 דוחף ל-GitHub...`n" -ForegroundColor Cyan
$currentBranch = git branch --show-current
Write-Host "Branch: $currentBranch" -ForegroundColor Gray

git push origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ דחיפה הושלמה!`n" -ForegroundColor Green
    Write-Host "💡 עכשיו לך ל-Render Dashboard ולחץ 'Manual sync'`n" -ForegroundColor Yellow
} else {
    Write-Host "❌ שגיאה בדחיפה ל-GitHub!`n" -ForegroundColor Red
}

Write-Host "✅ תהליך הושלם!`n" -ForegroundColor Green

