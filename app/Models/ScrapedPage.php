<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class ScrapedPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'website_id',
        'url',
        'canonical_url',
        'title',
        'meta_description',
        'publish_date',
        'content_text',
        'content_html',
        'content_hash',
        'language',
        'scraped_at',
        'matched_keywords',
        'images',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
        'scraped_at' => 'datetime',
        'matched_keywords' => 'array',
        'images' => 'array',
    ];

    /**
     * Get the website that owns this scraped page.
     */
    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }

    /**
     * Full-text search scope.
     */
    public function scopeFullTextSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->whereRaw(
            "content_tsv @@ plainto_tsquery('english', ?)",
            [$searchTerm]
        );
    }

    /**
     * Filter by topic.
     */
    public function scopeByTopic(Builder $query, int $topicId): Builder
    {
        return $query->whereJsonContains('matched_keywords', ['topic_id' => $topicId]);
    }

    /**
     * Filter by keyword.
     */
    public function scopeByKeyword(Builder $query, string $keyword): Builder
    {
        return $query->whereJsonContains('matched_keywords', ['keyword' => $keyword]);
    }

    /**
     * Filter by date range.
     */
    public function scopeDateRange(Builder $query, ?string $from, ?string $to): Builder
    {
        if ($from) {
            $query->where('publish_date', '>=', $from);
        }
        if ($to) {
            $query->where('publish_date', '<=', $to);
        }
        return $query;
    }

    /**
     * Get excerpt of content.
     */
    public function getExcerptAttribute(): string
    {
        return str($this->content_text)->limit(200);
    }

    /**
     * Get thumbnail image.
     */
    public function getThumbnailAttribute(): ?string
    {
        if (empty($this->images)) {
            return null;
        }
        return $this->images[0] ?? null;
    }
}
