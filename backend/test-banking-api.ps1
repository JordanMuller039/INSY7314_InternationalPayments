# FRANCOIS SMIT - INSY7314 Banking API Test Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "FRANCOIS SMIT - INSY7314 BANKING API TESTS" -ForegroundColor Cyan  
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Start server in background
Write-Host "Starting Banking API Server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden

# Wait for server startup
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test health endpoint
Write-Host "Testing server health..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "https://localhost:3443/api/health" -SkipCertificateCheck -ErrorAction Stop
    Write-Host "✅ Server is running successfully!" -ForegroundColor Green
    Write-Host "Server Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Server health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying to start server manually..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Running comprehensive test suite..." -ForegroundColor Yellow
Write-Host ""

# Run test suite
node test/complete-banking-test.js

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Manual testing URLs:" -ForegroundColor Yellow
Write-Host "- Health: https://localhost:3443/api/health" -ForegroundColor White
Write-Host "- API Base: https://localhost:3443/api/" -ForegroundColor White
Write-Host ""
Write-Host "Server Process ID: $($serverProcess.Id)" -ForegroundColor Yellow
Write-Host "To stop server: Stop-Process -Id $($serverProcess.Id)" -ForegroundColor Yellow

Read-Host -Prompt "Press Enter to continue..."
