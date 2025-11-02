#!/bin/bash

# Development helper script for News Grabber

show_menu() {
    clear
    echo "============================================"
    echo "   NEWS GRABBER - Development Menu"
    echo "============================================"
    echo ""
    echo "1. Start Web Server (php artisan serve)"
    echo "2. Start Queue Worker (php artisan queue:work)"
    echo "3. Start Scheduler (php artisan schedule:work)"
    echo "4. Start Vite Dev Server (npm run dev)"
    echo "5. Run All Services (in background)"
    echo ""
    echo "6. Run Migrations"
    echo "7. Seed Database"
    echo "8. Reset Database (Fresh + Seed)"
    echo ""
    echo "9. Run Tests"
    echo "10. Clear All Caches"
    echo "11. View Recent Logs"
    echo ""
    echo "12. Build Production Assets"
    echo "13. Optimize for Production"
    echo ""
    echo "0. Exit"
    echo ""
    read -p "Select option: " choice
}

start_server() {
    echo "Starting web server..."
    php artisan serve
}

start_queue() {
    echo "Starting queue worker..."
    php artisan queue:work --tries=3
}

start_scheduler() {
    echo "Starting scheduler..."
    php artisan schedule:work
}

start_vite() {
    echo "Starting Vite dev server..."
    npm run dev
}

start_all() {
    echo "Starting all services..."
    php artisan serve > /dev/null 2>&1 &
    echo "✓ Web server started (PID: $!)"
    
    php artisan queue:work --tries=3 > /dev/null 2>&1 &
    echo "✓ Queue worker started (PID: $!)"
    
    php artisan schedule:work > /dev/null 2>&1 &
    echo "✓ Scheduler started (PID: $!)"
    
    npm run dev > /dev/null 2>&1 &
    echo "✓ Vite dev server started (PID: $!)"
    
    echo ""
    echo "All services running in background!"
    echo "To stop: ps aux | grep 'artisan\|vite' | grep -v grep | awk '{print \$2}' | xargs kill"
    read -p "Press enter to continue..."
}

run_migrate() {
    php artisan migrate
    read -p "Press enter to continue..."
}

run_seed() {
    php artisan db:seed
    read -p "Press enter to continue..."
}

reset_database() {
    echo "WARNING: This will delete all data!"
    read -p "Are you sure? (y/N): " confirm
    if [[ $confirm == [yY] ]]; then
        php artisan migrate:fresh --seed
        echo ""
        echo "Database reset complete!"
    else
        echo "Cancelled."
    fi
    read -p "Press enter to continue..."
}

run_tests() {
    php artisan test
    read -p "Press enter to continue..."
}

clear_caches() {
    echo "Clearing all caches..."
    php artisan cache:clear
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan optimize:clear
    echo ""
    echo "All caches cleared!"
    read -p "Press enter to continue..."
}

view_logs() {
    echo "Recent log entries:"
    echo "----------------------------------------"
    tail -n 20 storage/logs/laravel.log
    echo "----------------------------------------"
    read -p "Press enter to continue..."
}

build_assets() {
    echo "Building production assets..."
    npm run build
    echo ""
    echo "Build complete!"
    read -p "Press enter to continue..."
}

optimize_production() {
    echo "Optimizing for production..."
    composer install --optimize-autoloader --no-dev
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    npm run build
    echo ""
    echo "Optimization complete!"
    read -p "Press enter to continue..."
}

while true; do
    show_menu
    case $choice in
        1) start_server ;;
        2) start_queue ;;
        3) start_scheduler ;;
        4) start_vite ;;
        5) start_all ;;
        6) run_migrate ;;
        7) run_seed ;;
        8) reset_database ;;
        9) run_tests ;;
        10) clear_caches ;;
        11) view_logs ;;
        12) build_assets ;;
        13) optimize_production ;;
        0) exit 0 ;;
        *) echo "Invalid option"; sleep 1 ;;
    esac
done
