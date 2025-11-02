# News Grabber - Command Reference

## Quick Commands

### Development

```bash
# Start all services (run in separate terminals)
php artisan serve              # Web server (localhost:8000)
php artisan queue:work         # Queue worker
php artisan schedule:work      # Task scheduler
npm run dev                    # Vite dev server with HMR

# Database
php artisan migrate            # Run migrations
php artisan migrate:fresh      # Drop all tables and re-migrate
php artisan db:seed            # Seed sample data
php artisan migrate:fresh --seed  # Reset and seed

# Cache
php artisan cache:clear        # Clear application cache
php artisan config:clear       # Clear config cache
php artisan route:clear        # Clear route cache
php artisan view:clear         # Clear compiled views
```

### Scraper Commands

```bash
# Manual scrape all active websites
php artisan scraper:scheduled

# Check scrape jobs status
php artisan queue:failed       # View failed jobs
php artisan queue:retry all    # Retry all failed jobs
php artisan queue:flush        # Clear all failed jobs

# Monitor queue in real-time
php artisan queue:work --verbose
```

### Testing

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ScraperServiceTest.php

# Run tests with coverage
php artisan test --coverage

# Frontend tests
npm test
npm test -- --watch            # Watch mode
```

### Production

```bash
# Optimize for production
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build

# Clear all caches
php artisan optimize:clear

# Check application status
php artisan about
```

## Artisan Commands

### User Management

```bash
# Create admin user (use tinker)
php artisan tinker
>>> App\Models\User::create([
...   'name' => 'Admin',
...   'email' => 'admin@example.com',
...   'password' => bcrypt('password'),
...   'role' => 'admin'
... ]);
```

### Queue Management

```bash
# Start queue worker
php artisan queue:work

# With specific options
php artisan queue:work --tries=3 --timeout=60

# Monitor queue
php artisan queue:monitor database --max=100

# Restart all queue workers
php artisan queue:restart

# Pause queue workers
php artisan queue:pause

# Resume queue workers
php artisan queue:resume
```

### Logs

```bash
# View logs
tail -f storage/logs/laravel.log

# Clear logs
> storage/logs/laravel.log      # Linux/Mac
echo. > storage/logs/laravel.log  # Windows
```

## Database Commands

### PostgreSQL

```bash
# Connect to database
psql -U postgres -d newsgrabber

# Backup database
pg_dump -U postgres newsgrabber > backup.sql

# Restore database
psql -U postgres newsgrabber < backup.sql

# Check database size
psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('newsgrabber'));"
```

### Laravel Database

```bash
# Generate migration
php artisan make:migration create_table_name

# Generate model
php artisan make:model ModelName -m  # with migration

# Database seeder
php artisan make:seeder TableSeeder
```

## npm Commands

```bash
# Install dependencies
npm install

# Development
npm run dev              # Start Vite dev server

# Production build
npm run build            # Build for production

# Testing
npm test                 # Run Jest tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # With coverage

# Linting (if configured)
npm run lint
```

## Debugging

```bash
# Laravel Tinker (REPL)
php artisan tinker

# Useful Tinker commands:
>>> App\Models\Website::all()              # List all websites
>>> App\Models\ScrapedPage::count()        # Count pages
>>> App\Models\ScrapeJob::latest()->first()  # Latest job
>>> Cache::flush()                         # Clear cache
>>> DB::connection()->getPdo()             # Test DB connection

# Check routes
php artisan route:list

# Check registered commands
php artisan list
```

## Git (if version controlling)

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: News Grabber application"

# .gitignore important entries (already configured):
# /node_modules
# /public/build
# /vendor
# .env
# /storage/*.key
```

## Supervisor (Production Queue Management)

```bash
# Reload supervisor
sudo supervisorctl reread
sudo supervisorctl update

# Start workers
sudo supervisorctl start newsgrabber-worker:*

# Stop workers
sudo supervisorctl stop newsgrabber-worker:*

# Restart workers
sudo supervisorctl restart newsgrabber-worker:*

# Check status
sudo supervisorctl status
```

## Maintenance

```bash
# Put application in maintenance mode
php artisan down

# Allow specific IPs during maintenance
php artisan down --secret="maintenance-token"
# Access via: /maintenance-token

# Bring application back up
php artisan up
```

## Performance

```bash
# Generate performance report
php artisan optimize

# Profile slow queries
php artisan db:show

# Check Redis connection (if using)
php artisan redis:client

# Monitor horizon (if installed)
php artisan horizon
```

## Common Tasks

### Add New Website

```php
// Via Tinker
php artisan tinker
>>> $website = App\Models\Website::create([
...   'url' => 'https://example.com',
...   'label' => 'Example Site',
...   'rate_limit_per_minute' => 10,
...   'active' => true
... ]);
```

### Add Topic with Keywords

```php
// Via Tinker
>>> $topic = App\Models\Topic::create([
...   'name' => 'Technology',
...   'description' => 'Tech news'
... ]);
>>> $topic->keywords()->create([
...   'keyword' => 'artificial intelligence',
...   'match_type' => 'phrase'
... ]);
```

### Manually Trigger Scrape

```php
// Via Tinker
>>> $website = App\Models\Website::find(1);
>>> $job = App\Models\ScrapeJob::create([
...   'website_id' => $website->id,
...   'status' => 'pending'
... ]);
>>> App\Jobs\ScrapeWebsiteJob::dispatch($website, $job);
```

## Troubleshooting Commands

```bash
# Check PHP configuration
php -i | grep -i "pdo_pgsql"

# Test PostgreSQL connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check disk space
df -h                    # Linux/Mac
dir                      # Windows

# Check process status
ps aux | grep php        # Linux/Mac
tasklist | findstr php   # Windows

# Kill stuck process
kill -9 <PID>            # Linux/Mac
taskkill /F /PID <PID>   # Windows
```

## Environment-Specific

### Development

```bash
# Enable debug mode
APP_DEBUG=true

# Use sync queue (no worker needed)
QUEUE_CONNECTION=sync

# Detailed error pages
APP_ENV=local
```

### Production

```bash
# Disable debug
APP_DEBUG=false

# Use database queue
QUEUE_CONNECTION=database

# Production environment
APP_ENV=production
```

## Useful Aliases (Optional)

Add to your shell profile (.bashrc, .zshrc):

```bash
alias pa='php artisan'
alias pam='php artisan migrate'
alias pas='php artisan serve'
alias paq='php artisan queue:work'
alias pat='php artisan tinker'
alias nrd='npm run dev'
alias nrb='npm run build'
```

## Emergency

```bash
# Application not working
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
composer dump-autoload

# Queue stuck
php artisan queue:restart
php artisan queue:flush

# Complete reset (CAUTION: Deletes all data)
php artisan migrate:fresh --seed
php artisan cache:clear
npm run build
```

## Resources

- Laravel Docs: https://laravel.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- React Docs: https://react.dev/
- Inertia.js Docs: https://inertiajs.com/
