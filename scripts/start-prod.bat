@echo off
echo Starting Wedding Planner Production Environment...
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
    echo Please edit .env file with your production configuration before running again.
    pause
    exit /b 1
)

echo Building and starting production containers...
docker-compose -f docker-compose.prod.yml up --build -d

echo.
echo Production services starting up...
echo Frontend: http://localhost
echo Backend API: http://localhost:5000
echo.

echo Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo Checking service health...
docker-compose -f docker-compose.prod.yml ps

echo.
echo Production environment is ready!
echo Press any key to view logs or Ctrl+C to exit...
pause >nul

docker-compose -f docker-compose.prod.yml logs -f

