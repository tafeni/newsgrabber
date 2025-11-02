# News Grabber - Verification Checklist

Use this checklist to verify your installation and ensure all components are working correctly.

---

## ✅ Pre-Installation Verification

### System Requirements
- [ ] PHP 8.1 or higher installed (`php -v`)
- [ ] PostgreSQL 13 or higher running (`psql --version`)
- [ ] Composer installed (`composer --version`)
- [ ] Node.js 18 or higher (`node --version`)
- [ ] npm installed (`npm --version`)

### PHP Extensions
Run `php -m` and verify these extensions are installed:
- [ ] pdo_pgsql
- [ ] mbstring
- [ ] xml
- [ ] openssl
- [ ] tokenizer
- [ ] json
- [ ] bcmath

### Database Setup
- [ ] PostgreSQL server is running
- [ ] Database `newsgrabber` is created
- [ ] Database user has appropriate permissions

---

## ✅ Installation Verification

### Dependencies
- [ ] Composer packages installed (`vendor` directory exists)
- [ ] NPM packages installed (`node_modules` directory exists)
- [ ] No dependency conflicts or errors

### Environment Configuration
- [ ] `.env` file exists (copied from `.env.example`)
- [ ] `APP_KEY` is generated (not empty in `.env`)
- [ ] Database credentials are correct in `.env`
- [ ] `QUEUE_CONNECTION` is set to `database`
- [ ] Scraper configuration variables are set

### Database Migrations
- [ ] All migrations run successfully
- [ ] 7 tables created: users, websites, topics, keywords, scraped_pages, scrape_jobs, jobs
- [ ] Full-text search tsvector column exists in scraped_pages
- [ ] GIN index created on scraped_pages.content_tsv

### Database Seeding
- [ ] Admin user created (admin@newsgrabber.com)
- [ ] Regular user created (user@newsgrabber.com)
- [ ] Sample topics created (Technology, Business, Science)
- [ ] Sample keywords created

### Asset Compilation
- [ ] Frontend assets built (`public/build` directory exists)
- [ ] CSS and JS files generated
- [ ] Vite manifest exists

### File Permissions (Linux/Mac)
- [ ] `storage` directory is writable
- [ ] `bootstrap/cache` directory is writable
- [ ] Storage link created (`public/storage` → `storage/app/public`)

---

## ✅ Backend Verification

### Models
- [ ] User model works: `php artisan tinker` → `User::count()`
- [ ] Website model works: `Website::count()`
- [ ] Topic model works: `Topic::count()`
- [ ] Keyword model works: `Keyword::count()`
- [ ] ScrapedPage model works: `ScrapedPage::count()`
- [ ] ScrapeJob model works: `ScrapeJob::count()`

### Services
Check if service files exist:
- [ ] `app/Services/ContentExtractor.php`
- [ ] `app/Services/KeywordMatcher.php`
- [ ] `app/Services/ScraperService.php`

### Controllers
Check if controller files exist:
- [ ] `app/Http/Controllers/ContentController.php`
- [ ] `app/Http/Controllers/Admin/DashboardController.php`
- [ ] `app/Http/Controllers/Admin/WebsiteController.php`
- [ ] `app/Http/Controllers/Admin/TopicController.php`
- [ ] `app/Http/Controllers/Admin/KeywordController.php`
- [ ] `app/Http/Controllers/Admin/ScrapeJobController.php`
- [ ] `app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- [ ] `app/Http/Controllers/Auth/RegisteredUserController.php`

### Jobs & Commands
- [ ] `app/Jobs/ScrapeWebsiteJob.php` exists
- [ ] `app/Console/Commands/ScrapeScheduledWebsites.php` exists
- [ ] Scheduler configured in `app/Console/Kernel.php`

### Middleware
- [ ] `app/Http/Middleware/HandleInertiaRequests.php` exists
- [ ] `app/Http/Middleware/AdminMiddleware.php` exists
- [ ] Middleware registered in `app/Http/Kernel.php`

### Routes
Run `php artisan route:list` and verify:
- [ ] Public routes exist (`/`, `/content/{page}`)
- [ ] Auth routes exist (`/login`, `/register`, `/logout`)
- [ ] Admin routes exist (prefixed with `/admin`)
- [ ] Admin routes have `auth` and `admin` middleware

### Configuration
- [ ] `config/scraper.php` exists with all settings
- [ ] Scraper settings load correctly: `config('scraper.user_agent')`

---

## ✅ Frontend Verification

### Layouts
- [ ] `resources/js/Layouts/AdminLayout.jsx` exists
- [ ] `resources/js/Layouts/PublicLayout.jsx` exists

### Admin Pages
- [ ] `resources/js/Pages/Admin/Dashboard.jsx`
- [ ] `resources/js/Pages/Admin/Websites/Index.jsx`
- [ ] `resources/js/Pages/Admin/Websites/Create.jsx`
- [ ] `resources/js/Pages/Admin/Websites/Edit.jsx`
- [ ] `resources/js/Pages/Admin/Topics/Index.jsx`
- [ ] `resources/js/Pages/Admin/Topics/Create.jsx`
- [ ] `resources/js/Pages/Admin/Topics/Edit.jsx`
- [ ] `resources/js/Pages/Admin/ScrapeJobs/Index.jsx`

### Public Pages
- [ ] `resources/js/Pages/Public/Content/Index.jsx`
- [ ] `resources/js/Pages/Public/Content/Show.jsx`

### Auth Pages
- [ ] `resources/js/Pages/Auth/Login.jsx`
- [ ] `resources/js/Pages/Auth/Register.jsx`

### Configuration Files
- [ ] `tailwind.config.js` configured
- [ ] `vite.config.js` configured with React plugin
- [ ] `postcss.config.js` configured
- [ ] `resources/css/app.css` has Tailwind directives

---

## ✅ Functionality Verification

### Authentication
- [ ] Can access login page at `/login`
- [ ] Can login with admin credentials
- [ ] Can login with user credentials
- [ ] Can logout
- [ ] Can register new account
- [ ] Admin users redirected to `/admin` after login
- [ ] Regular users redirected to `/` after login

### Authorization
- [ ] Admin can access `/admin` routes
- [ ] Regular users cannot access `/admin` routes (403 error)
- [ ] Guest users redirected to login for protected routes

### Admin - Dashboard
- [ ] Dashboard loads at `/admin`
- [ ] Statistics display correctly
- [ ] Recent jobs list shows (if any jobs exist)
- [ ] No JavaScript errors in console

### Admin - Websites
- [ ] Can view websites list at `/admin/websites`
- [ ] Can click "Add Website" button
- [ ] Can fill and submit create form
- [ ] New website appears in list
- [ ] Can edit existing website
- [ ] Can delete website (with confirmation)
- [ ] Play icon appears next to each website

### Admin - Topics
- [ ] Can view topics list at `/admin/topics`
- [ ] Can create new topic
- [ ] Can edit topic
- [ ] Can delete topic (with confirmation)
- [ ] Keywords count displays correctly

### Admin - Topic Keywords
- [ ] Can edit topic to manage keywords
- [ ] Can add new keyword
- [ ] Can select match type (phrase, exact, regex)
- [ ] Can delete keyword
- [ ] Keywords display in list

### Admin - Scrape Jobs
- [ ] Can view scrape jobs at `/admin/scrape-jobs`
- [ ] Jobs display with status badges
- [ ] Job details show (pages scraped, matched, duration)
- [ ] Status icons display correctly

### Public Interface
- [ ] Homepage loads at `/`
- [ ] Articles display in grid layout (if any scraped)
- [ ] Search bar is functional
- [ ] Filter panel toggles open/close
- [ ] Can filter by topic
- [ ] Can filter by website/source
- [ ] Can filter by date
- [ ] Pagination works (if enough articles)
- [ ] Can click article to view details

### Queue System
- [ ] Queue worker starts: `php artisan queue:work`
- [ ] Jobs appear in `jobs` table when created
- [ ] Jobs process and disappear from `jobs` table
- [ ] Failed jobs go to `failed_jobs` table (if failures occur)
- [ ] Can retry failed jobs: `php artisan queue:retry all`

### Scraping
- [ ] Manual scrape triggers when play icon clicked
- [ ] Scrape job appears in Scrape Jobs list
- [ ] Job status changes (pending → running → completed)
- [ ] Scraped pages appear in `scraped_pages` table
- [ ] Scraped content visible on homepage
- [ ] No errors in `storage/logs/laravel.log`

---

## ✅ Testing Verification

### Backend Tests
- [ ] Test suite runs: `php artisan test`
- [ ] All tests pass
- [ ] No errors or warnings
- [ ] Code coverage available (optional)

### Frontend Tests (if configured)
- [ ] Jest tests run: `npm test`
- [ ] No test failures
- [ ] No configuration errors

---

## ✅ Development Tools

### Artisan Commands
- [ ] `php artisan serve` starts web server
- [ ] `php artisan queue:work` processes jobs
- [ ] `php artisan schedule:work` runs scheduler
- [ ] `php artisan scraper:scheduled` runs scrapes
- [ ] `php artisan migrate` works
- [ ] `php artisan db:seed` works
- [ ] `php artisan tinker` starts REPL

### NPM Scripts
- [ ] `npm run dev` starts Vite dev server
- [ ] `npm run build` creates production build
- [ ] `npm test` runs tests (if configured)
- [ ] Hot module replacement works in dev mode

### Helper Scripts
- [ ] `setup.bat` / `setup.sh` runs successfully
- [ ] `dev.bat` / `dev.sh` menu works
- [ ] All menu options function correctly

---

## ✅ Documentation Verification

### Files Exist
- [ ] README.md
- [ ] INSTALL.md
- [ ] COMMANDS.md
- [ ] PROJECT_SUMMARY.md
- [ ] QUICK_START.md
- [ ] COMPLETION_STATUS.md
- [ ] VERIFICATION_CHECKLIST.md (this file)
- [ ] BUILD_COMPLETE.txt

### Documentation Quality
- [ ] Installation instructions are clear
- [ ] Commands are accurate and tested
- [ ] Examples are provided
- [ ] Troubleshooting section exists

---

## ✅ Production Readiness (Optional)

### Optimization
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Run `npm run build`

### Environment
- [ ] `APP_ENV=production` in `.env`
- [ ] `APP_DEBUG=false` in `.env`
- [ ] `APP_URL` set to production URL
- [ ] Strong `APP_KEY` generated

### Security
- [ ] Database credentials are secure
- [ ] File permissions are correct
- [ ] CSRF protection enabled
- [ ] HTTPS configured (if deployed)
- [ ] Rate limiting configured

### Infrastructure
- [ ] Web server configured (Nginx/Apache)
- [ ] Supervisor configured for queue workers
- [ ] Cron job configured for scheduler
- [ ] Database backups configured
- [ ] Log rotation configured
- [ ] Monitoring set up (optional)

---

## ✅ Final Verification

### Smoke Test
1. [ ] Open browser to application URL
2. [ ] Homepage loads without errors
3. [ ] Can navigate to login page
4. [ ] Can login as admin
5. [ ] Admin dashboard loads
6. [ ] Can add a website
7. [ ] Can create a topic with keywords
8. [ ] Can trigger a manual scrape
9. [ ] Scrape job appears in monitoring
10. [ ] Content appears on homepage (if scrape successful)

### Error Check
- [ ] No PHP errors in `storage/logs/laravel.log`
- [ ] No JavaScript errors in browser console
- [ ] No 500 errors when navigating pages
- [ ] No 404 errors for assets (CSS/JS)

### Performance Check
- [ ] Pages load in reasonable time (< 2 seconds)
- [ ] Database queries are efficient
- [ ] No N+1 query problems
- [ ] Assets are minified in production

---

## 🎉 All Checks Passed?

If all items are checked, your News Grabber installation is:
- ✅ Fully installed
- ✅ Properly configured
- ✅ Functionally complete
- ✅ Ready for use

**Congratulations! Your application is ready to aggregate news content.**

---

## 🐛 Issues Found?

If any checks failed:

1. **Review error messages** in terminal or logs
2. **Check INSTALL.md** for detailed setup instructions
3. **See COMMANDS.md** for troubleshooting commands
4. **Review .env** configuration
5. **Check database connection** and permissions
6. **Verify all dependencies** are installed
7. **Clear caches**: `php artisan optimize:clear`
8. **Review logs**: `storage/logs/laravel.log`

For specific issues, see the Troubleshooting section in INSTALL.md.
