<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Website extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'label',
        'rate_limit_per_minute',
        'active',
        'last_scraped_at',
        'settings',
    ];

    protected $casts = [
        'active' => 'boolean',
        'last_scraped_at' => 'datetime',
        'settings' => 'array',
        'rate_limit_per_minute' => 'integer',
    ];

    /**
     * Get the scraped pages for this website.
     */
    public function scrapedPages(): HasMany
    {
        return $this->hasMany(ScrapedPage::class);
    }

    /**
     * Get the scrape jobs for this website.
     */
    public function scrapeJobs(): HasMany
    {
        return $this->hasMany(ScrapeJob::class);
    }

    /**
     * Get the domain from the URL.
     */
    public function getDomainAttribute(): string
    {
        $parsed = parse_url($this->url);
        return $parsed['host'] ?? $this->url;
    }
}
