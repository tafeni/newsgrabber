# 🚀 News Grabber - Quick Start Guide

## TL;DR - Get Running in 5 Minutes

```bash
# 1. Install dependencies
composer install && npm install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Configure database (edit .env first!)
php artisan migrate && php artisan db:seed

# 4. Build and run
npm run build
php artisan serve
```

**Open**: http://localhost:8000  
**Login**: admin@newsgrabber.com / password

---

## First Time Setup Checklist

### ✅ Prerequisites
- [ ] PHP 8.1+ installed
- [ ] PostgreSQL 13+ running
- [ ] Composer installed
- [ ] Node.js 18+ installed
- [ ] Database `newsgrabber` created

### ✅ Installation (5 steps)

**Step 1: Dependencies**
```bash
cd C:\xampp\htdocs\newsgrabber
composer install
npm install
```

**Step 2: Environment**
```bash
copy .env.example .env
php artisan key:generate
```

**Step 3: Database Config**
Edit `.env` file:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=newsgrabber
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**Step 4: Migrate & Seed**
```bash
php artisan migrate
php artisan db:seed
```

**Step 5: Build Assets**
```bash
npm run build
```

### ✅ Running the Application

Open **3 terminals**:

**Terminal 1 - Web Server:**
```bash
php artisan serve
```

**Terminal 2 - Queue Worker:**
```bash
php artisan queue:work
```

**Terminal 3 - Dev Assets (optional):**
```bash
npm run dev
```

---

## First Login

1. Go to: http://localhost:8000
2. Click **Login**
3. Use: **admin@newsgrabber.com** / **password**
4. You'll see the admin dashboard

---

## Add Your First Website

1. Click **Websites** in sidebar
2. Click **Add Website** button
3. Fill in:
   - **URL**: https://techcrunch.com (or any news site)
   - **Label**: TechCrunch
   - **Rate Limit**: 10
   - **Active**: ✓ Checked
4. Click **Create Website**

---

## Configure Topics & Keywords

1. Click **Topics** in sidebar
2. Click **Add Topic**
3. Enter:
   - **Name**: Technology
   - **Description**: Tech news and updates
4. Click **Create Topic**
5. Click **Edit** on the topic
6. Add keywords:
   - "artificial intelligence" - Phrase Match
   - "machine learning" - Phrase Match
   - "software" - Exact Match
7. Click **Add Keyword** for each

---

## Run Your First Scrape

1. Go to **Websites**
2. Click the **▶ Play** icon next to your website
3. Go to **Scrape Jobs** to watch progress
4. When complete, visit homepage to see results

---

## Common Commands

```bash
# Development
php artisan serve              # Start web server
php artisan queue:work         # Process jobs
npm run dev                    # Dev assets with HMR

# Database
php artisan migrate:fresh --seed  # Reset database
php artisan tinker             # Interactive console

# Testing
php artisan test               # Run tests
npm test                       # Frontend tests

# Production
npm run build                  # Build assets
php artisan optimize           # Cache everything
```

---

## Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d newsgrabber
```

### "Queue not processing"
```bash
# Start queue worker
php artisan queue:work

# Check failed jobs
php artisan queue:failed
```

### "Assets not loading"
```bash
npm run build
php artisan cache:clear
```

### "Permission denied"
```bash
# Windows: Usually not needed
# Linux/Mac:
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## What's Included

### ✅ Admin Features
- Dashboard with stats
- Website management (add/edit/delete)
- Topic & keyword configuration
- Manual and bulk scraping
- Job monitoring and logs

### ✅ Public Features
- Article browsing
- Full-text search
- Filtering (topic, source, date)
- Responsive design
- Article detail view

### ✅ Technical Features
- PostgreSQL full-text search
- Queue system with retries
- Content deduplication
- HTML sanitization
- Rate limiting
- Keyword matching (3 types)

---

## Next Steps

### 🎯 Immediate
1. ✅ Add real news websites
2. ✅ Configure relevant topics
3. ✅ Add keywords for matching
4. ✅ Run scrapes manually
5. ✅ Check results on homepage

### 🚀 Production
1. Deploy to server
2. Configure Supervisor for queues
3. Set up cron for scheduler
4. Enable SSL
5. Configure backups

---

## File Locations

```
Configuration:  .env
Logs:          storage/logs/laravel.log
Database:      PostgreSQL 'newsgrabber'
Public URL:    http://localhost:8000
Admin URL:     http://localhost:8000/admin
```

---

## Default Credentials

**Admin Account:**
- Email: admin@newsgrabber.com
- Password: password

**Regular User:**
- Email: user@newsgrabber.com
- Password: password

**⚠️ Change these in production!**

---

## Documentation

- **README.md** - Overview & features
- **INSTALL.md** - Detailed installation (26 pages)
- **COMMANDS.md** - Command reference
- **PROJECT_SUMMARY.md** - Architecture details
- **COMPLETION_STATUS.md** - Build status

---

## Support

📖 **Full docs**: See INSTALL.md  
🐛 **Debug**: Check `storage/logs/laravel.log`  
💻 **Test DB**: Run `php artisan tinker`, then `DB::connection()->getPdo()`  
🔄 **Reset**: Run `php artisan migrate:fresh --seed`

---

## You're Ready! 🎉

Your News Grabber application is fully built and ready to use. Follow the steps above to get started, then explore the admin interface.

**Happy scraping!**
