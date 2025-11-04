# Cron Job Setup for News Grabber

## Quick Answer

The command to scrape all configured websites:

```bash
php artisan scraper:scheduled
```

---

## Cron Job Configuration

### Option 1: Direct Scraper Command (Recommended for Testing)

Run the scraper every hour at minute 0:

```cron
0 * * * * cd /path/to/newsgrabber && php artisan scraper:scheduled >> /dev/null 2>&1
```

**Examples:**
```cron
# Every hour
0 * * * * cd /var/www/newsgrabber && php artisan scraper:scheduled >> /dev/null 2>&1

# Every 30 minutes
0,30 * * * * cd /var/www/newsgrabber && php artisan scraper:scheduled >> /dev/null 2>&1

# Every 2 hours
0 */2 * * * cd /var/www/newsgrabber && php artisan scraper:scheduled >> /dev/null 2>&1

# Every 6 hours
0 0,6,12,18 * * * cd /var/www/newsgrabber && php artisan scraper:scheduled >> /dev/null 2>&1

# Daily at 6 AM
0 6 * * * cd /var/www/newsgrabber && php artisan scraper:scheduled >> /dev/null 2>&1
```

### Option 2: Laravel Scheduler (Recommended for Production)

This is the **best practice** for Laravel applications. It uses Laravel's built-in scheduler.

**Single Cron Entry:**
```cron
* * * * * cd /var/www/newsgrabber && php artisan schedule:run >> /dev/null 2>&1
```

**Why This is Better:**
- ✅ Single cron entry manages all scheduled tasks
- ✅ Laravel handles timing, overlapping, and failures
- ✅ Built-in logging and error handling
- ✅ Already configured to run hourly (see `app/Console/Kernel.php`)

**Current Schedule Configuration:**
```php
// In app/Console/Kernel.php
protected function schedule(Schedule $schedule): void
{
    // Runs scraper every hour
    $schedule->command('scraper:scheduled')->hourly();
}
```

---

## Setting Up Cron Jobs

### Linux/Ubuntu

1. **Open crontab editor:**
   ```bash
   crontab -e
   ```

2. **Add the cron job:**
   ```cron
   * * * * * cd /var/www/newsgrabber && php artisan schedule:run >> /dev/null 2>&1
   ```

3. **Save and exit** (usually `Ctrl+X`, then `Y`, then `Enter`)

4. **Verify it's added:**
   ```bash
   crontab -l
   ```

### Windows (Task Scheduler)

Since you're on Windows, here's how to set it up:

1. **Open Task Scheduler**
   - Press `Win + R`
   - Type `taskschd.msc`
   - Press Enter

2. **Create Basic Task**
   - Click "Create Basic Task" in the right panel
   - Name: "News Grabber Scheduler"
   - Description: "Runs Laravel scheduler every minute"

3. **Trigger**
   - Choose "Daily"
   - Set start time to current time
   - Recur every: 1 day
   - Check "Repeat task every": 1 minute
   - Duration: Indefinitely

4. **Action**
   - Choose "Start a program"
   - Program/script: `C:\xampp\php\php.exe`
   - Arguments: `artisan schedule:run`
   - Start in: `C:\xampp\htdocs\newsgrabber`

5. **Finish**
   - Check "Open the Properties dialog"
   - In Properties → Settings:
     - ✅ Allow task to be run on demand
     - ✅ Run task as soon as possible after a scheduled start is missed
     - ✅ If the task fails, restart every: 1 minute

**Alternative: Windows Batch Script**

Create `run-scheduler.bat`:
```batch
@echo off
cd C:\xampp\htdocs\newsgrabber
C:\xampp\php\php.exe artisan schedule:run >> scheduler.log 2>&1
```

Then schedule this batch file in Task Scheduler.

---

## Queue Worker (Required!)

**IMPORTANT:** The scraper uses queues. You MUST run the queue worker alongside the cron job.

### Option 1: Manual (Development)
```bash
php artisan queue:work --tries=3
```

### Option 2: Supervisor (Production - Linux)

Create `/etc/supervisor/conf.d/newsgrabber-worker.conf`:
```ini
[program:newsgrabber-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/newsgrabber/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/newsgrabber/storage/logs/worker.log
stopwaitsecs=3600
```

**Start Supervisor:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start newsgrabber-worker:*
```

### Option 3: Windows Service (Production - Windows)

Use **NSSM (Non-Sucking Service Manager)**:

1. **Download NSSM:** https://nssm.cc/download
2. **Install as service:**
   ```cmd
   nssm install NewsGrabberQueue "C:\xampp\php\php.exe" "artisan queue:work --tries=3"
   nssm set NewsGrabberQueue AppDirectory "C:\xampp\htdocs\newsgrabber"
   nssm start NewsGrabberQueue
   ```

---

## Complete Production Setup

### Linux Server

1. **Add cron job:**
   ```cron
   * * * * * cd /var/www/newsgrabber && php artisan schedule:run >> /dev/null 2>&1
   ```

2. **Setup Supervisor for queue worker** (see above)

3. **Verify both are running:**
   ```bash
   # Check cron logs
   grep CRON /var/log/syslog
   
   # Check queue worker
   sudo supervisorctl status newsgrabber-worker:*
   
   # Check Laravel logs
   tail -f /var/www/newsgrabber/storage/logs/laravel.log
   ```

### Windows Server

1. **Task Scheduler** for `schedule:run` (see above)
2. **Windows Service (NSSM)** for queue worker (see above)
3. **Verify both are running:**
   - Task Scheduler → Check last run time
   - Services → Check "NewsGrabberQueue" is running
   - Check `storage/logs/laravel.log`

---

## Testing Your Cron Setup

### Test the Command Manually
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

### Test the Scheduler
```bash
php artisan schedule:run
```

### Monitor Job Execution

**Watch logs in real-time:**
```bash
# Linux/Mac
tail -f storage/logs/laravel.log

# Windows PowerShell
Get-Content storage/logs/laravel.log -Wait -Tail 20
```

**Check database:**
```sql
-- View pending jobs
SELECT * FROM jobs ORDER BY created_at DESC;

-- View scrape job status
SELECT * FROM scrape_jobs ORDER BY created_at DESC LIMIT 10;

-- View scraped content
SELECT COUNT(*) as total, DATE(created_at) as date 
FROM scraped_pages 
GROUP BY DATE(created_at) 
ORDER BY date DESC;
```

### Verify Scraping is Working

1. **Admin Dashboard:**
   - Go to: http://localhost:8000/admin
   - Check "Recent Scrape Jobs"

2. **Scrape Jobs Page:**
   - Go to: Admin → Scrape Jobs
   - Verify jobs are completing successfully

3. **Content Page:**
   - Go to: Homepage
   - Verify new articles are appearing

---

## Troubleshooting

### Cron Not Running?

**Check cron service (Linux):**
```bash
sudo systemctl status cron
sudo systemctl start cron
```

**Check cron logs (Linux):**
```bash
grep CRON /var/log/syslog | tail -20
```

**Verify path and permissions:**
```bash
which php  # Use full path in cron
ls -la /var/www/newsgrabber/artisan  # Check permissions
```

### Jobs Stuck in Queue?

**Problem:** Jobs are created but not processing

**Solution:** Queue worker is not running
```bash
# Start manually
php artisan queue:work

# Or restart Supervisor
sudo supervisorctl restart newsgrabber-worker:*
```

### No Websites Being Scraped?

**Check if websites are active:**
```bash
php artisan tinker
>>> \App\Models\Website::where('active', true)->count();
```

**Verify websites exist:**
```bash
php artisan tinker
>>> \App\Models\Website::all()->pluck('label', 'active');
```

### Permission Errors (Linux)?

```bash
# Fix Laravel permissions
sudo chown -R www-data:www-data /var/www/newsgrabber
sudo chmod -R 775 /var/www/newsgrabber/storage
sudo chmod -R 775 /var/www/newsgrabber/bootstrap/cache
```

---

## Recommended Schedules

### News Websites (Time-Sensitive)
```php
// Every 30 minutes during business hours
$schedule->command('scraper:scheduled')
    ->everyThirtyMinutes()
    ->between('6:00', '22:00');
```

### General Content (Moderate)
```php
// Every 2 hours
$schedule->command('scraper:scheduled')->everyTwoHours();
```

### Blogs/Slow-Moving Content
```php
// Twice daily
$schedule->command('scraper:scheduled')->twiceDaily(8, 20);
```

### Heavy Traffic Sites (Rate-Limited)
```php
// Every 4 hours
$schedule->command('scraper:scheduled')->everyFourHours();
```

**To customize, edit:** `app/Console/Kernel.php`

---

## Monitoring & Alerts

### Log Scrape Results

Add to `.env`:
```env
LOG_CHANNEL=daily
LOG_LEVEL=info
```

### Email Alerts on Failures

In `app/Console/Kernel.php`:
```php
$schedule->command('scraper:scheduled')
    ->hourly()
    ->onFailure(function () {
        // Send email notification
        Mail::to('admin@example.com')->send(new ScraperFailedMail());
    });
```

### Slack Notifications

```bash
composer require laravel/slack-notification-channel
```

```php
$schedule->command('scraper:scheduled')
    ->hourly()
    ->onSuccess(function () {
        // Notify success
    })
    ->onFailure(function () {
        // Notify failure
    });
```

---

## Quick Reference

| Task | Command |
|------|---------|
| **Manual scrape all** | `php artisan scraper:scheduled` |
| **Run scheduler** | `php artisan schedule:run` |
| **Run queue worker** | `php artisan queue:work` |
| **View failed jobs** | `php artisan queue:failed` |
| **Retry failed jobs** | `php artisan queue:retry all` |
| **Clear all jobs** | `php artisan queue:flush` |
| **Test scheduler** | `php artisan schedule:list` |

---

## Summary

✅ **Command:** `php artisan scraper:scheduled`  
✅ **Production Cron:** `* * * * * cd /path && php artisan schedule:run`  
✅ **Queue Worker:** Must be running (Supervisor/NSSM)  
✅ **Frequency:** Configured in `app/Console/Kernel.php` (currently hourly)  
✅ **Monitoring:** Admin → Scrape Jobs page

**Your cron job is ready to deploy!** 🚀
