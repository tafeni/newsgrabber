<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Scraper Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration settings for the web scraper.
    |
    */

    'user_agent' => env('SCRAPER_USER_AGENT', 'NewsGrabber/1.0 (Mozilla/5.0 compatible)'),
    
    'timeout' => env('SCRAPER_TIMEOUT', 30),
    
    'max_retries' => env('SCRAPER_MAX_RETRIES', 3),
    
    'global_rate_limit' => env('SCRAPER_GLOBAL_RATE_LIMIT', 10),
    
    'max_articles_per_run' => env('SCRAPER_MAX_ARTICLES_PER_RUN', 3),
    
    'store_raw_html' => env('SCRAPER_STORE_RAW_HTML', false),
    
    'max_content_size' => env('SCRAPER_MAX_CONTENT_SIZE', 5000000),
];
