Write-Host "🔄 Running post-pull setup..." -ForegroundColor Cyan

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Clear Next.js cache
Write-Host "`n🧹 Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Cache cleared" -ForegroundColor Green
} else {
    Write-Host "✓ No cache to clear" -ForegroundColor Green
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server" -ForegroundColor Cyan
