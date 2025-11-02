<?php

namespace App\Console\Commands;

use App\Models\Website;
use App\Models\ScrapeJob;
use App\Jobs\ScrapeWebsiteJob;
use Illuminate\Console\Command;

class ScrapeScheduledWebsites extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'scraper:scheduled';

    /**
     * The console command description.
     */
    protected $description = 'Scrape websites that are due for scheduled scraping';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $websites = Website::where('active', true)->get();

        $this->info("Found {$websites->count()} active websites");

        foreach ($websites as $website) {
            // Create scrape job
            $scrapeJob = ScrapeJob::create([
                'website_id' => $website->id,
                'status' => 'pending',
            ]);

            // Dispatch to queue
            ScrapeWebsiteJob::dispatch($website, $scrapeJob);

            $this->info("Queued scrape job for: {$website->label}");
        }

        return Command::SUCCESS;
    }
}
