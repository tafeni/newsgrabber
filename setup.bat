@echo off
echo ============================================
echo News Grabber - Automated Setup Script
echo ============================================
echo.

REM Check if .env exists
if exist .env (
    echo .env file already exists. Skipping environment setup.
) else (
    echo Copying .env.example to .env...
    copy .env.example .env
    echo Please edit .env file with your database credentials before continuing.
    echo Press any key when ready...
    pause >nul
)

echo.
echo Installing Composer dependencies...
call composer install
if errorlevel 1 (
    echo ERROR: Composer install failed!
    pause
    exit /b 1
)

echo.
echo Installing NPM dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: NPM install failed!
    pause
    exit /b 1
)

echo.
echo Generating application key...
call php artisan key:generate

echo.
echo Do you want to run database migrations? (Y/N)
set /p migrate="Your choice: "
if /i "%migrate%"=="Y" (
    echo Running migrations...
    call php artisan migrate
    if errorlevel 1 (
        echo ERROR: Migration failed! Please check your database configuration.
        pause
        exit /b 1
    )
)

echo.
echo Do you want to seed sample data? (Y/N)
set /p seed="Your choice: "
if /i "%seed%"=="Y" (
    echo Seeding database...
    call php artisan db:seed
)

echo.
echo Creating storage link...
call php artisan storage:link

echo.
echo Building frontend assets...
call npm run build

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the application:
echo   1. Terminal 1: php artisan serve
echo   2. Terminal 2: php artisan queue:work
echo   3. Terminal 3: php artisan schedule:work (optional)
echo   4. Terminal 4: npm run dev (for development)
echo.
echo Default credentials:
echo   Admin: admin@newsgrabber.com / password
echo   User: user@newsgrabber.com / password
echo.
echo Open your browser to: http://localhost:8000
echo ============================================
pause
