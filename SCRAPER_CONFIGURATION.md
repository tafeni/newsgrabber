# Scraper Configuration - Current Week Focus

## Overview

The scraper is now configured to focus on **current week content** (last 7 days). This ensures you only collect the most recent, relevant articles.

## How It Works

### 1. **Content Age Filtering**
- After extracting content, the scraper checks the article's publish date
- Articles older than 7 days are automatically skipped
- This prevents storing outdated content

### 2. **Priority Link Discovery**
The scraper now prioritizes links from sections that typically contain fresh content:
- `.latest-posts`, `.recent-posts`, `.latest-news`
- `.today`, `.this-week`, `.breaking-news`
- `[class*="latest"]`, `[class*="recent"]`, `[class*="trending"]`

### 3. **Date-Based URL Prioritization**
- URLs containing current month/year patterns get priority
- Example: `/2025/11/article-name` will be prioritized over `/2023/05/article-name`
- Focuses on current and last month to capture very recent content

## Configuration

### Environment Variable

In your `.env` file:

```env
# Only scrape content from the last X days (7 = current week, 0 = no limit)
SCRAPER_MAX_CONTENT_AGE_DAYS=7
```

### Adjusting the Time Window

You can customize the time window:

- **Current week (default)**: `SCRAPER_MAX_CONTENT_AGE_DAYS=7`
- **Last 3 days**: `SCRAPER_MAX_CONTENT_AGE_DAYS=3`
- **Last 2 weeks**: `SCRAPER_MAX_CONTENT_AGE_DAYS=14`
- **Last month**: `SCRAPER_MAX_CONTENT_AGE_DAYS=30`
- **No limit (all content)**: `SCRAPER_MAX_CONTENT_AGE_DAYS=0`

## What Happens to Old Content

### Articles Without Publish Dates
- If an article doesn't have a detectable publish date, the scraper will still process it
- This ensures you don't miss important breaking news

### Skipped Articles
- Old articles are logged: `"Skipping old article (X days old): [title]"`
- They count towards `pages_scraped` but not `pages_matched`
- Check `storage/logs/laravel.log` to see which articles were skipped

## Benefits

✅ **Always Fresh**: Only current, relevant content  
✅ **Reduced Noise**: No old, duplicate, or outdated articles  
✅ **Better Performance**: Less content to process and store  
✅ **Focused Topics**: Recent content better matches current interests  

## Example Scrape Output

```
[2025-11-04 18:30:00] Starting scrape for website: TechNews
[2025-11-04 18:30:05] Found 25 article links on TechNews
[2025-11-04 18:30:10] Saved article: "AI Breakthrough 2025" (Published: 2025-11-04 10:00:00)
[2025-11-04 18:30:12] Skipping old article (15 days old): "Old Software Update"
[2025-11-04 18:30:15] Saved article: "Tech Conference Today" (Published: 2025-11-03 14:30:00)
[2025-11-04 18:30:18] Scraped 3 pages, 2 matched. Duration: 18s
```

## Testing

To test the configuration:

1. **Set to 1 day** for testing:
   ```env
   SCRAPER_MAX_CONTENT_AGE_DAYS=1
   ```

2. **Run a scrape**:
   ```bash
   php artisan scraper:scheduled
   ```

3. **Check logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Verify results**:
   - Go to Admin → Scrape Jobs
   - Check which articles were scraped
   - Look at publish dates on scraped content

## Troubleshooting

### No Articles Being Saved?

**Possible Causes:**
1. Website doesn't include publish dates in articles
2. Time window is too narrow (try increasing to 14 or 30 days)
3. Website's articles are older than your configured limit

**Solution:**
- Check logs for "Skipping old article" messages
- Temporarily set `SCRAPER_MAX_CONTENT_AGE_DAYS=0` to test
- Verify the website has recent content

### Too Much Old Content?

**Solution:**
- Decrease the time window: `SCRAPER_MAX_CONTENT_AGE_DAYS=3`
- Check if the website has proper publish date metadata

### Mixed Results?

Some articles may not have detectable publish dates. The scraper will still process these to avoid missing breaking news. If you want stricter filtering, you can modify the logic in `ScraperService.php` line 98-108.

## Advanced: Custom Time Windows Per Website

If you need different time windows for different websites, you can extend the `Website` model's `settings` field:

```php
// In website settings
[
    'max_content_age_days' => 3  // Custom per website
]
```

Then modify `ScraperService.php` to check website-specific settings before the global config.

---

**Last Updated**: 2025-11-04  
**Current Configuration**: 7 days (current week)
