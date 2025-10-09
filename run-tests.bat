@echo off
echo ============================================
echo FRANCOIS SMIT - INSY7314 BANKING API TESTS
echo ============================================
echo.
echo Starting Banking API Server...
echo.

REM Start the server in background
start /B node server.js

REM Wait for server to start
timeout /t 5 /nobreak >nul

echo Server started. Running comprehensive tests...
echo.

REM Run the complete test suite
node test/complete-banking-test.js

echo.
echo Tests completed! Check results above.
echo.
echo To manually test API endpoints:
echo - Health Check: https://localhost:3443/api/health
echo - API Documentation: See README.md
echo.
pause
