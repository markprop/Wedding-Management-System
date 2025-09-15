@echo off
echo Starting Wedding Planner Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm install && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm start"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
