@echo off
echo Starting Wedding Planner Development Environment...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo Please edit .env file with your configuration before running again.
    pause
    exit /b 1
)

echo Building and starting containers...
docker-compose up --build -d

echo.
echo Services starting up...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo MongoDB Express: http://localhost:8081
echo.

echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo Checking service health...
docker-compose ps

echo.
echo Development environment is ready!
echo Press any key to view logs or Ctrl+C to exit...
pause >nul

docker-compose logs -f

