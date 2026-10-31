# FoodVerse - Complete Full-Stack Launch Script
# Starts both FastAPI Backend (port 8000) and Vite React Frontend (port 5173)

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  FoodVerse - Multimodal AI Food Intelligence Platform" -ForegroundColor Emerald
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan

# Start Backend in separate process
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; & '.\.venv\Scripts\python.exe' run.py" -PassThru

Start-Sleep -Seconds 2

Write-Host "Starting Vite React Frontend on http://localhost:5173..." -ForegroundColor Cyan
# Start Frontend in separate process
$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$env:Path = 'C:\Users\HP\.local\tools\node;' + `$env:Path; cd `"$frontendPath`"; & 'C:\Users\HP\.local\tools\node\npm.cmd' run dev" -PassThru

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " FoodVerse is actively running!" -ForegroundColor Green
Write-Host " - Frontend Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host " - Backend API & Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host " - Demo Login:         demo@foodverse.ai / FoodVerseDemo2026!" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Press any key to exit this launcher window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
