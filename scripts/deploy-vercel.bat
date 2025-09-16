@echo off
echo Wedding Planner - Vercel Deployment Script
echo ==========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI. Please install manually.
        echo Run: npm install -g vercel
        pause
        exit /b 1
    )
)

echo.
echo Choose deployment option:
echo 1. Deploy Frontend only (to Vercel)
echo 2. Deploy Backend only (to Vercel)
echo 3. Deploy Both Frontend and Backend
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_frontend
if "%choice%"=="2" goto deploy_backend
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto end
goto invalid_choice

:deploy_frontend
echo.
echo Deploying Frontend to Vercel...
cd frontend
vercel --prod
cd ..
goto end

:deploy_backend
echo.
echo Deploying Backend to Vercel...
cd backend
vercel --prod
cd ..
goto end

:deploy_both
echo.
echo Deploying Backend first...
cd backend
vercel --prod
echo.
echo Backend deployed! Note the URL for frontend configuration.
echo.
pause
echo.
echo Deploying Frontend...
cd ../frontend
vercel --prod
cd ..
goto end

:invalid_choice
echo Invalid choice. Please try again.
goto end

:end
echo.
echo Deployment completed!
echo.
echo Next steps:
echo 1. Update frontend environment variables with backend URL
echo 2. Test your deployed application
echo 3. Configure custom domain (optional)
echo.
pause
