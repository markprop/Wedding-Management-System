@echo off
echo Stopping Wedding Planner Services...
echo.

REM Stop development environment
echo Stopping development containers...
docker-compose down

REM Stop production environment
echo Stopping production containers...
docker-compose -f docker-compose.prod.yml down

echo.
echo All services stopped.
echo.

REM Ask if user wants to clean up
set /p cleanup="Do you want to remove unused Docker images and volumes? (y/n): "
if /i "%cleanup%"=="y" (
    echo Cleaning up Docker resources...
    docker system prune -f
    echo Cleanup completed.
)

echo.
echo Done!
pause

