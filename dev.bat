@echo off
REM Development helper script for News Grabber

:menu
cls
echo ============================================
echo   NEWS GRABBER - Development Menu
echo ============================================
echo.
echo 1. Start Web Server (php artisan serve)
echo 2. Start Queue Worker (php artisan queue:work)
echo 3. Start Scheduler (php artisan schedule:work)
echo 4. Start Vite Dev Server (npm run dev)
echo 5. Run All Services (opens 4 terminals)
echo.
echo 6. Run Migrations
echo 7. Seed Database
echo 8. Reset Database (Fresh + Seed)
echo.
echo 9. Run Tests
echo 10. Clear All Caches
echo 11. View Recent Logs
echo.
echo 12. Build Production Assets
echo 13. Optimize for Production
echo.
echo 0. Exit
echo.
set /p choice="Select option: "

if "%choice%"=="1" goto server
if "%choice%"=="2" goto queue
if "%choice%"=="3" goto scheduler
if "%choice%"=="4" goto vite
if "%choice%"=="5" goto all
if "%choice%"=="6" goto migrate
if "%choice%"=="7" goto seed
if "%choice%"=="8" goto fresh
if "%choice%"=="9" goto test
if "%choice%"=="10" goto clear
if "%choice%"=="11" goto logs
if "%choice%"=="12" goto build
if "%choice%"=="13" goto optimize
if "%choice%"=="0" exit
goto menu

:server
cls
echo Starting web server...
php artisan serve
pause
goto menu

:queue
cls
echo Starting queue worker...
php artisan queue:work --tries=3
pause
goto menu

:scheduler
cls
echo Starting scheduler...
php artisan schedule:work
pause
goto menu

:vite
cls
echo Starting Vite dev server...
npm run dev
pause
goto menu

:all
cls
echo Starting all services in separate windows...
start cmd /k "title Web Server && php artisan serve"
start cmd /k "title Queue Worker && php artisan queue:work --tries=3"
start cmd /k "title Scheduler && php artisan schedule:work"
start cmd /k "title Vite Dev && npm run dev"
echo.
echo All services started in separate windows!
echo Press any key to return to menu...
pause >nul
goto menu

:migrate
cls
php artisan migrate
echo.
pause
goto menu

:seed
cls
php artisan db:seed
echo.
pause
goto menu

:fresh
cls
echo WARNING: This will delete all data!
set /p confirm="Are you sure? (Y/N): "
if /i "%confirm%"=="Y" (
    php artisan migrate:fresh --seed
    echo.
    echo Database reset complete!
) else (
    echo Cancelled.
)
pause
goto menu

:test
cls
php artisan test
echo.
pause
goto menu

:clear
cls
echo Clearing all caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
echo.
echo All caches cleared!
pause
goto menu

:logs
cls
echo Recent log entries:
echo ----------------------------------------
powershell -Command "Get-Content storage\logs\laravel.log -Tail 20"
echo ----------------------------------------
echo.
pause
goto menu

:build
cls
echo Building production assets...
npm run build
echo.
echo Build complete!
pause
goto menu

:optimize
cls
echo Optimizing for production...
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
echo.
echo Optimization complete!
pause
goto menu
