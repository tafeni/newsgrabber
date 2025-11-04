@echo off
REM News Grabber - Complete Scraper Test Script (Windows)
REM This script tests all components of the scraper system

echo ================================================
echo News Grabber - Scraper System Test
echo ================================================
echo.

REM 1. Check if websites exist
echo 1. Checking for active websites...
php artisan tinker --execute="echo 'Active websites: ' . \App\Models\Website::where('active', true)->count();"
echo.

REM 2. Test direct scraper command
echo 2. Testing scraper command directly...
php artisan scraper:scheduled
echo.

REM 3. Check if jobs were created
echo 3. Checking if scrape jobs were created...
php artisan tinker --execute="echo 'Pending jobs: ' . \App\Models\ScrapeJob::where('status', 'pending')->count();"
echo.

REM 4. Check queue jobs
echo 4. Checking queue system...
php artisan tinker --execute="echo 'Queue jobs: ' . DB::table('jobs')->count();"
echo.

REM 5. Test scheduler
echo 5. Testing Laravel scheduler...
php artisan schedule:run
echo.

REM 6. List scheduled tasks
echo 6. Listing all scheduled tasks...
php artisan schedule:list
echo.

echo ================================================
echo Test Complete!
echo ================================================
echo.
echo NEXT STEPS:
echo 1. If jobs were created but status is 'pending':
echo    - Run: php artisan queue:work --tries=3
echo.
echo 2. If no websites found:
echo    - Add websites via Admin panel or run: php artisan db:seed
echo.
echo 3. To monitor in real-time:
echo    Terminal 1: php artisan schedule:work
echo    Terminal 2: php artisan queue:work
echo    Terminal 3: Get-Content storage/logs/laravel.log -Wait -Tail 20
echo.
pause
