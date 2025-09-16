@echo off
echo Wedding Planner - Railway Deployment Script
echo ===========================================
echo.

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLI not found. Installing...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo Failed to install Railway CLI. Please install manually.
        echo Run: npm install -g @railway/cli
        pause
        exit /b 1
    )
)

echo.
echo Deploying Backend to Railway...
echo.

cd backend

echo Logging in to Railway...
railway login

echo.
echo Creating new Railway project...
railway init

echo.
echo Setting environment variables...
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=mongodb+srv://saink4831_db_user:Wedding@suresh-wedding.autdlq2.mongodb.net/wedding_planner?retryWrites=true&w=majority&appName=Suresh-Wedding
railway variables set MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic3VyZXNoYmFyYWNoMjAwMSIsImEiOiJjbWYzcDh5a3MwMGV0MmtzNDQ3ODlkY3p6In0.OVdVP7rRea7wK1UEn1OSfw

echo.
echo Deploying to Railway...
railway up

echo.
echo Backend deployed to Railway!
echo.
echo Note the generated URL for frontend configuration.
echo.

cd ..

echo.
echo Next steps:
echo 1. Copy the Railway backend URL
echo 2. Update frontend environment variables with backend URL
echo 3. Deploy frontend to Vercel
echo.
pause
