# News Grabber - Detailed Installation Guide

## System Requirements

### Minimum Requirements
- **PHP**: 8.1 or higher with extensions:
  - OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath
  - PostgreSQL PDO driver (pdo_pgsql)
- **PostgreSQL**: 13 or higher
- **Composer**: 2.x
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Memory**: 512MB minimum, 1GB recommended
- **Disk Space**: 500MB minimum

### Recommended for Production
- **PHP**: 8.2+
- **PostgreSQL**: 15+
- **Web Server**: Nginx 1.20+ or Apache 2.4+
- **Process Manager**: Supervisor for queue workers
- **Memory**: 2GB+

## Step-by-Step Installation

### 1. Verify Prerequisites

```bash
# Check PHP version and extensions
php -v
php -m | grep -E "pdo_pgsql|mbstring|xml|openssl"

# Check PostgreSQL
psql --version

# Check Composer
composer --version

# Check Node.js and npm
node --version
npm --version
```

### 2. Clone or Navigate to Project

```bash
cd C:\xampp\htdocs\newsgrabber
```

### 3. Install PHP Dependencies

```bash
# Install all Composer packages
composer install

# If you encounter memory issues:
php -d memory_limit=-1 C:\path\to\composer.phar install
```

### 4. Install JavaScript Dependencies

```bash
# Install npm packages
npm install

# If you encounter network issues:
npm install --legacy-peer-deps
```

### 5. Environment Configuration

```bash
# Copy the example environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

Edit `.env` with your configuration:

```env
APP_NAME='News Grabber'
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=newsgrabber
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Queue Configuration
QUEUE_CONNECTION=database

# Scraper Settings
SCRAPER_USER_AGENT="NewsGrabber/1.0 (Mozilla/5.0 compatible)"
SCRAPER_TIMEOUT=30
SCRAPER_MAX_RETRIES=3
SCRAPER_GLOBAL_RATE_LIMIT=10
SCRAPER_STORE_RAW_HTML=false
SCRAPER_MAX_CONTENT_SIZE=5000000
```

### 6. Create PostgreSQL Database

**Option A: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE newsgrabber;

# Create user (optional)
CREATE USER newsgrabber_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE newsgrabber TO newsgrabber_user;

# Exit
\q
```

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `newsgrabber`
4. Save

### 7. Run Database Migrations

```bash
# Run all migrations
php artisan migrate

# If you need to start fresh:
php artisan migrate:fresh
```

This creates all tables including:
- users
- websites
- topics
- keywords
- scraped_pages (with full-text search)
- scrape_jobs
- jobs (queue table)

### 8. Seed Sample Data

```bash
php artisan db:seed
```

This creates:
- **Admin user**: admin@newsgrabber.com / password
- **Regular user**: user@newsgrabber.com / password
- **Sample topics**: Technology, Business, Science
- **Sample keywords**: AI, machine learning, software, etc.

### 9. Build Frontend Assets

**For Development:**
```bash
npm run dev
```
This starts Vite dev server with hot module replacement.

**For Production:**
```bash
npm run build
```
This creates optimized production bundles.

### 10. Storage Setup

```bash
# Create symbolic link for public storage
php artisan storage:link

# Set permissions (Linux/Mac)
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Windows: No special permissions needed
```

### 11. Start Application Services

Open **3 separate terminal windows**:

**Terminal 1 - Web Server:**
```bash
cd C:\xampp\htdocs\newsgrabber
php artisan serve
```
Application will be available at: http://localhost:8000

**Terminal 2 - Queue Worker:**
```bash
cd C:\xampp\htdocs\newsgrabber
php artisan queue:work --tries=3
```
Processes scraping jobs in the background.

**Terminal 3 - Scheduler (for scheduled scrapes):**
```bash
cd C:\xampp\htdocs\newsgrabber
php artisan schedule:work
```
Runs scheduled tasks (scrapes run every hour by default).

### 12. Verify Installation

1. Open browser to http://localhost:8000
2. You should see the public content listing page
3. Click "Login" and use: admin@newsgrabber.com / password
4. Navigate to Admin Dashboard
5. Check all sections: Websites, Topics, Scrape Jobs

## First-Time Setup

### Add Your First Website

1. Login as admin
2. Go to Admin → Websites
3. Click "Add Website"
4. Enter:
   - **URL**: https://example.com (use a real news site)
   - **Label**: Example News Site
   - **Rate Limit**: 10 (requests per minute)
   - **Active**: Checked
5. Click "Create Website"

### Configure Topics and Keywords

1. Go to Admin → Topics
2. Click "Add Topic"
3. Enter topic name and description
4. Save, then click "Edit" on the topic
5. Add keywords with match types:
   - **Phrase**: Matches anywhere in text
   - **Exact**: Whole word match
   - **Regex**: Advanced pattern matching

### Run Your First Scrape

1. Go to Admin → Websites
2. Click the "Play" icon next to your website
3. Go to Admin → Scrape Jobs to monitor progress
4. Once complete, visit the homepage to see scraped content

## Production Deployment

### 1. Environment Setup

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

QUEUE_CONNECTION=database
```

### 2. Optimize Application

```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev

# Build production assets
npm run build
```

### 3. Web Server Configuration

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/newsgrabber/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 4. Queue Worker (Supervisor)

Create `/etc/supervisor/conf.d/newsgrabber-worker.conf`:

```ini
[program:newsgrabber-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/newsgrabber/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/newsgrabber/storage/logs/worker.log
stopwaitsecs=3600
```

Start supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start newsgrabber-worker:*
```

### 5. Scheduler (Cron)

Add to crontab:
```bash
* * * * * cd /path/to/newsgrabber && php artisan schedule:run >> /dev/null 2>&1
```

## Troubleshooting

### Database Connection Failed

**Problem**: "SQLSTATE[08006] [7] connection failed"

**Solutions**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in `.env`
3. Ensure database exists: `psql -l`
4. Check pg_hba.conf for connection permissions

### Queue Not Processing

**Problem**: Jobs stay in "pending" status

**Solutions**:
1. Start queue worker: `php artisan queue:work`
2. Check for failed jobs: `php artisan queue:failed`
3. Retry failed jobs: `php artisan queue:retry all`
4. Clear queue: `php artisan queue:flush`

### Assets Not Loading

**Problem**: CSS/JS files not found

**Solutions**:
1. Run `npm run build`
2. Clear cache: `php artisan cache:clear`
3. Check public/build directory exists
4. Verify APP_URL in `.env`

### Permission Denied Errors

**Problem**: "The stream or file could not be opened"

**Solutions (Linux)**:
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Scraping Fails

**Problem**: Scrape jobs fail immediately

**Solutions**:
1. Check logs: `storage/logs/laravel.log`
2. Verify website is accessible: `curl -I https://target-site.com`
3. Check SSL certificates: `curl -k https://target-site.com`
4. Increase timeout in `.env`: `SCRAPER_TIMEOUT=60`

## Support

For additional help:
- Check `storage/logs/laravel.log` for errors
- Run `php artisan about` for system information
- Use `php artisan tinker` for debugging
- Review Laravel documentation: https://laravel.com/docs

## Next Steps

1. Configure SSL certificate (Let's Encrypt recommended)
2. Set up database backups
3. Configure log rotation
4. Set up monitoring (e.g., Laravel Telescope)
5. Review security checklist in README.md
