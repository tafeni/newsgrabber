<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScrapeJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'website_id',
        'status',
        'started_at',
        'finished_at',
        'log',
        'pages_scraped',
        'pages_matched',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'pages_scraped' => 'integer',
        'pages_matched' => 'integer',
    ];

    /**
     * Get the website that owns this scrape job.
     */
    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }

    /**
     * Get duration in seconds.
     */
    public function getDurationAttribute(): ?int
    {
        if (!$this->started_at || !$this->finished_at) {
            return null;
        }
        return $this->finished_at->diffInSeconds($this->started_at);
    }

    /**
     * Check if job is complete.
     */
    public function isComplete(): bool
    {
        return in_array($this->status, ['completed', 'failed']);
    }

    /**
     * Mark job as running.
     */
    public function markAsRunning(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    /**
     * Mark job as completed.
     */
    public function markAsCompleted(int $pagesScraped, int $pagesMatched, ?string $log = null): void
    {
        $this->update([
            'status' => 'completed',
            'finished_at' => now(),
            'pages_scraped' => $pagesScraped,
            'pages_matched' => $pagesMatched,
            'log' => $log,
        ]);
    }

    /**
     * Mark job as failed.
     */
    public function markAsFailed(string $reason): void
    {
        $this->update([
            'status' => 'failed',
            'finished_at' => now(),
            'log' => $reason,
        ]);
    }
}
