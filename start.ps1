# Cursed Aquarium - Start Script
# This script starts both the backend API and frontend development servers

Write-Host "🐠 Starting Cursed Aquarium..." -ForegroundColor Cyan
Write-Host ""

# Start Backend API
Write-Host "Starting Backend API on http://localhost:3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\api'; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Login with:" -ForegroundColor White
Write-Host "  Username: main dps" -ForegroundColor White
Write-Host "  Password: main dps" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window (servers will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
