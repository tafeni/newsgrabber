#!/bin/bash

echo "============================================"
echo "News Grabber - Automated Setup Script"
echo "============================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo ".env file already exists. Skipping environment setup."
else
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo "Please edit .env file with your database credentials before continuing."
    read -p "Press enter when ready..."
fi

echo ""
echo "Installing Composer dependencies..."
composer install
if [ $? -ne 0 ]; then
    echo "ERROR: Composer install failed!"
    exit 1
fi

echo ""
echo "Installing NPM dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: NPM install failed!"
    exit 1
fi

echo ""
echo "Generating application key..."
php artisan key:generate

echo ""
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    php artisan migrate
    if [ $? -ne 0 ]; then
        echo "ERROR: Migration failed! Please check your database configuration."
        exit 1
    fi
fi

echo ""
read -p "Do you want to seed sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    php artisan db:seed
fi

echo ""
echo "Creating storage link..."
php artisan storage:link

echo ""
echo "Building frontend assets..."
npm run build

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "To start the application:"
echo "  1. Terminal 1: php artisan serve"
echo "  2. Terminal 2: php artisan queue:work"
echo "  3. Terminal 3: php artisan schedule:work (optional)"
echo "  4. Terminal 4: npm run dev (for development)"
echo ""
echo "Default credentials:"
echo "  Admin: admin@newsgrabber.com / password"
echo "  User: user@newsgrabber.com / password"
echo ""
echo "Open your browser to: http://localhost:8000"
echo "============================================"
