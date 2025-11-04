# News Grabber - Troubleshooting Guide

## Issue: `schedule:run` Does Nothing

### Why This Happens

When you run `php artisan schedule:run >> /dev/null 2>&1`, three things can cause "nothing to happen":

1. **No tasks are due right now** - Scheduler only runs tasks at their scheduled time
2. **Output is hidden** - `>> /dev/null 2>&1` throws away all output
3. **Queue worker not running** - Jobs are created but not processed

---

## Quick Fix: Run These Commands

### 1. Test the Scraper Directly (Bypass Scheduler)

```bash
php artisan scraper:scheduled
```

**Expected Output:**
```
Found 3 active websites
Queued scrape job for: TechCrunch
Queued scrape job for: BBC News
Queued scrape job for: The Verge
```

**If you get "Found 0 active websites":**
- Add websites via Admin panel: http://localhost:8000/admin/websites
- Or check database: `php artisan tinker` → `\App\Models\Website::all();`

---

### 2. Start the Queue Worker (REQUIRED!)

**The scraper won't work without this!**

```bash
php artisan queue:work --tries=3 --timeout=300
```

Keep this running in a separate terminal. You should see:
```
[2025-11-04 19:13:00] Processing: App\Jobs\ScrapeWebsiteJob
[2025-11-04 19:13:15] Processed: App\Jobs\ScrapeWebsiteJob
```

---

### 3. Test the Scheduler (See Output)

Remove the redirect to see what's happening:

```bash
php artisan schedule:run
```

**If scheduler is working:**
```
Running scheduled command: php artisan 'scraper:scheduled'
```

**If nothing is due:**
```
No scheduled commands are ready to run.
```

---

### 4. Check What's Scheduled

```bash
php artisan schedule:list
```

**Output shows:**
```
* * * * * php artisan scraper:scheduled .... Next Due: 30 seconds from now
```

---

## Complete Test Script

### Linux/Mac:
```bash
chmod +x test-scraper.sh
./test-scraper.sh
```

### Windows:
```cmd
test-scraper.bat
```

---

## Common Problems & Solutions

### Problem 1: Jobs Created But Not Processing

**Symptoms:**
- `scraper:scheduled` says "Queued scrape job"
- But scrape_jobs table shows status = "pending" forever
- Nothing appears in scraped_pages table

**Cause:** Queue worker not running

**Solution:**
```bash
# Start queue worker
php artisan queue:work --tries=3

# Check if it's working
php artisan queue:monitor
```

---

### Problem 2: "No Scheduled Commands Are Ready to Run"

**Symptoms:**
- `schedule:run` says no commands ready
- Nothing happens

**Cause:** Task not due at that exact minute

**Solution:**

**Option A:** Use `schedule:work` instead (runs continuously):
```bash
php artisan schedule:work
```

**Option B:** Change schedule to `everyMinute()` for testing:
```php
// In app/Console/Kernel.php
$schedule->command('scraper:scheduled')->everyMinute();
```

**Option C:** Run scraper directly (bypass scheduler):
```bash
php artisan scraper:scheduled
```

---

### Problem 3: No Websites Found

**Symptoms:**
```
Found 0 active websites
```

**Cause:** No websites configured

**Solution:**

**Option A:** Add via Admin:
1. Login: http://localhost:8000/login
2. Go to: Admin → Websites → Add Website
3. Add URL and mark as Active

**Option B:** Add via Tinker:
```bash
php artisan tinker
```
```php
\App\Models\Website::create([
    'url' => 'https://techcrunch.com',
    'label' => 'TechCrunch',
    'rate_limit_per_minute' => 10,
    'active' => true
]);
```

**Option C:** Seed sample data:
```bash
php artisan db:seed
```

---

### Problem 4: Schedule Runs But No Jobs Created

**Check Database Connection:**
```bash
php artisan tinker
```
```php
DB::connection()->getPdo();
// Should return PDO object, not error
```

**Check Command Works:**
```bash
php artisan scraper:scheduled
```

**Check Kernel Configuration:**
```bash
php artisan schedule:list
```

---

### Problem 5: Permission Denied (Linux)

**Symptoms:**
```
Permission denied writing to logs
```

**Solution:**
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## Debug Checklist

Use this checklist to debug step-by-step:

### [ ] Step 1: Verify Prerequisites
```bash
# Check PHP version
php -v  # Should be 8.1+

# Check database connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Check websites exist
php artisan tinker --execute="\App\Models\Website::where('active', true)->count();"
```

### [ ] Step 2: Test Direct Command
```bash
php artisan scraper:scheduled
```
- [ ] Command runs without errors
- [ ] Shows "Queued scrape job for: [Website]"
- [ ] Creates entries in scrape_jobs table

### [ ] Step 3: Check Jobs Table
```bash
php artisan tinker --execute="DB::table('jobs')->count();"
```
- [ ] Jobs are created in the jobs table
- [ ] Count increases when you run scraper:scheduled

### [ ] Step 4: Start Queue Worker
```bash
php artisan queue:work --tries=3
```
- [ ] Worker starts without errors
- [ ] Shows "Processing: App\Jobs\ScrapeWebsiteJob"
- [ ] Shows "Processed: App\Jobs\ScrapeWebsiteJob"

### [ ] Step 5: Verify Scraping Works
```bash
# Check scrape_jobs table
php artisan tinker --execute="\App\Models\ScrapeJob::latest()->first();"
```
- [ ] Status changes from "pending" → "running" → "completed"
- [ ] pages_scraped > 0
- [ ] pages_matched > 0 (if keywords match)

### [ ] Step 6: Test Scheduler
```bash
php artisan schedule:list
```
- [ ] Shows scraper:scheduled in the list
- [ ] Shows "Next Due" time

```bash
php artisan schedule:run
```
- [ ] If task is due, shows "Running scheduled command"
- [ ] Creates new scrape jobs

### [ ] Step 7: Test Cron Integration
```bash
# Run schedule every minute for 5 minutes
for i in {1..5}; do php artisan schedule:run; sleep 60; done
```
- [ ] Scheduler runs successfully each time
- [ ] New jobs created when due
- [ ] No errors in output

---

## Monitoring Commands

### Real-Time Monitoring

**Terminal 1 - Scheduler:**
```bash
php artisan schedule:work
```

**Terminal 2 - Queue Worker:**
```bash
php artisan queue:work --tries=3 --verbose
```

**Terminal 3 - Logs:**
```bash
# Linux/Mac
tail -f storage/logs/laravel.log

# Windows
Get-Content storage/logs/laravel.log -Wait -Tail 20
```

**Terminal 4 - Database (optional):**
```bash
watch -n 5 "php artisan tinker --execute='\App\Models\ScrapeJob::latest()->take(5)->get([\"id\", \"status\", \"created_at\"]);'"
```

---

## Expected Workflow

Here's what should happen when everything works:

1. **Cron triggers** `schedule:run` every minute
2. **Scheduler checks** if `scraper:scheduled` is due (hourly at :00)
3. **When due**, scheduler runs `scraper:scheduled`
4. **Command finds** all active websites
5. **Creates scrape jobs** for each website
6. **Adds jobs** to the `jobs` queue table
7. **Queue worker picks up** jobs from the queue
8. **Processes each job** (fetches URLs, extracts content)
9. **Saves matched articles** to `scraped_pages` table
10. **Updates scrape_jobs** status to "completed"

**If any step fails, the chain breaks.**

---

## Production Setup Summary

For production, you need **TWO** things running:

### 1. Cron Job (Scheduler)
```cron
* * * * * cd /path/to/newsgrabber && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Queue Worker (Service)

**Linux - Supervisor:**
```ini
[program:newsgrabber-queue]
command=php /path/to/newsgrabber/artisan queue:work --tries=3
autostart=true
autorestart=true
user=www-data
```

**Windows - NSSM Service:**
```cmd
nssm install NewsGrabberQueue "C:\xampp\php\php.exe" "artisan queue:work --tries=3"
nssm set NewsGrabberQueue AppDirectory "C:\xampp\htdocs\newsgrabber"
nssm start NewsGrabberQueue
```

---

## Still Not Working?

1. **Run the test script:**
   ```bash
   ./test-scraper.sh  # Linux
   test-scraper.bat   # Windows
   ```

2. **Check logs:**
   ```bash
   tail -100 storage/logs/laravel.log
   ```

3. **Enable debug mode:**
   ```env
   # In .env
   APP_DEBUG=true
   LOG_LEVEL=debug
   ```

4. **Test each component separately:**
   - Database: `php artisan tinker --execute="DB::connection()->getPdo();"`
   - Command: `php artisan scraper:scheduled`
   - Queue: `php artisan queue:work --once`
   - Scheduler: `php artisan schedule:run`

5. **Check system resources:**
   ```bash
   # Disk space
   df -h
   
   # Memory
   free -m
   
   # PHP processes
   ps aux | grep php
   ```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `php artisan scraper:scheduled` | Run scraper NOW (bypass scheduler) |
| `php artisan schedule:run` | Run scheduler once |
| `php artisan schedule:work` | Run scheduler continuously |
| `php artisan schedule:list` | Show all scheduled tasks |
| `php artisan queue:work` | Process queued jobs |
| `php artisan queue:monitor` | Monitor queue status |
| `php artisan queue:failed` | Show failed jobs |
| `php artisan queue:retry all` | Retry all failed jobs |
| `php artisan tinker` | Interactive console |

---

**Last Updated:** 2025-11-04  
**Status:** Scheduler configured to run every minute for testing
