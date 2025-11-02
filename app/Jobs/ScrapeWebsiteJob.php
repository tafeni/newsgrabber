<?php

namespace App\Jobs;

use App\Models\Website;
use App\Models\ScrapeJob;
use App\Services\ScraperService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ScrapeWebsiteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 900]; // 1min, 5min, 15min
    public $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Website $website,
        public ?ScrapeJob $scrapeJob = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ScraperService $scraperService): void
    {
        Log::info("Processing scrape job for website: {$this->website->label}");

        if ($this->scrapeJob) {
            $this->scrapeJob->markAsRunning();
        }

        $scraperService->scrape($this->website, $this->scrapeJob);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Scrape job failed for website {$this->website->label}: {$exception->getMessage()}");

        if ($this->scrapeJob) {
            $this->scrapeJob->markAsFailed($exception->getMessage());
        }
    }
}
