<?php

namespace App\Services;

use App\Models\Website;
use App\Models\ScrapedPage;
use App\Models\ScrapeJob;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class ScraperService
{
    private Client $client;
    private ContentExtractor $contentExtractor;
    private KeywordMatcher $keywordMatcher;

    public function __construct(
        ContentExtractor $contentExtractor,
        KeywordMatcher $keywordMatcher
    ) {
        $this->contentExtractor = $contentExtractor;
        $this->keywordMatcher = $keywordMatcher;
        $this->client = new Client([
            'timeout' => config('scraper.timeout', 30),
            'verify' => false,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'en-US,en;q=0.9',
                'Accept-Encoding' => 'gzip, deflate',
                'DNT' => '1',
                'Connection' => 'keep-alive',
                'Upgrade-Insecure-Requests' => '1',
                'Cache-Control' => 'max-age=0',
            ],
        ]);
    }

    /**
     * Scrape a website.
     */
    public function scrape(Website $website, ?ScrapeJob $scrapeJob = null): array
    {
        $startTime = microtime(true);
        $pagesScraped = 0;
        $pagesMatched = 0;
        $errors = [];
        $maxArticles = config('scraper.max_articles_per_run', 10);

        try {
            Log::info("Starting scrape for website: {$website->label}");

            // Fetch the main page to find article links
            $response = $this->fetchUrl($website->url);

            if (!$response['success']) {
                $errors[] = $response['error'];
                throw new \Exception($response['error']);
            }

            // Discover article links from homepage
            $articleUrls = $this->contentExtractor->extractArticleLinks(
                $response['html'],
                $website->url
            );

            Log::info("Found " . count($articleUrls) . " article links on {$website->label}");

            // Limit the number of articles to scrape
            $articleUrls = array_slice($articleUrls, 0, $maxArticles);

            // Scrape each article
            foreach ($articleUrls as $articleUrl) {
                // Respect rate limiting
                $this->respectRateLimit($website);

                try {
                    // Fetch article
                    $articleResponse = $this->fetchUrl($articleUrl);

                    if (!$articleResponse['success']) {
                        $errors[] = "Failed to fetch {$articleUrl}: {$articleResponse['error']}";
                        continue;
                    }

                    // Extract content
                    $extractedData = $this->contentExtractor->extractContent(
                        $articleResponse['html'],
                        $articleUrl
                    );

                    $pagesScraped++;

                    // Check if content is within the allowed age range
                    $maxAgeDays = config('scraper.max_content_age_days', 7);
                    if ($maxAgeDays > 0) {
                        $publishDate = $extractedData['publish_date'];
                        
                        if ($publishDate) {
                            $contentAge = now()->diffInDays($publishDate);
                            
                            if ($contentAge > $maxAgeDays) {
                                Log::debug("Skipping old article ({$contentAge} days old): {$extractedData['title']}");
                                continue;
                            }
                        }
                    }

                    // Match keywords
                    $matches = $this->keywordMatcher->matchKeywords(
                        $extractedData['content_text'],
                        $extractedData['title'] ?? ''
                    );

                    // Only save if there are keyword matches
                    if (!empty($matches)) {
                        $saved = $this->savePage($website, $extractedData, $matches, $articleUrl);
                        if ($saved) {
                            $pagesMatched++;
                            Log::info("Saved article: {$extractedData['title']} (Published: {$extractedData['publish_date']})");
                        }
                    } else {
                        Log::debug("No keyword matches for: {$extractedData['title']}");
                    }

                } catch (\Exception $e) {
                    $errors[] = "Error scraping {$articleUrl}: {$e->getMessage()}";
                    Log::error("Error scraping article: {$e->getMessage()}");
                }
            }

            // Update website last scraped timestamp
            $website->update(['last_scraped_at' => now()]);

            $duration = round(microtime(true) - $startTime, 2);
            $log = "Scraped {$pagesScraped} pages, {$pagesMatched} matched. Duration: {$duration}s";

            Log::info($log);

            if ($scrapeJob) {
                $scrapeJob->markAsCompleted($pagesScraped, $pagesMatched, $log);
            }

            return [
                'success' => true,
                'pages_scraped' => $pagesScraped,
                'pages_matched' => $pagesMatched,
                'duration' => $duration,
                'errors' => $errors,
            ];

        } catch (\Exception $e) {
            $error = "Scrape failed: {$e->getMessage()}";
            Log::error($error);

            if ($scrapeJob) {
                $scrapeJob->markAsFailed($error);
            }

            return [
                'success' => false,
                'error' => $error,
                'pages_scraped' => $pagesScraped,
                'pages_matched' => $pagesMatched,
                'errors' => array_merge($errors, [$error]),
            ];
        }
    }

    /**
     * Respect rate limiting between requests.
     */
    private function respectRateLimit(Website $website): void
    {
        // Calculate delay in milliseconds for faster scraping
        $delayMs = (60 / $website->rate_limit_per_minute) * 1000000; // microseconds
        
        // Minimum 0.5 second delay, maximum 3 seconds
        $delayMs = max(500000, min($delayMs, 3000000));
        
        usleep((int)$delayMs);
    }

    /**
     * Fetch URL content.
     */
    private function fetchUrl(string $url): array
    {
        try {
            $response = $this->client->get($url);
            $statusCode = $response->getStatusCode();

            if ($statusCode !== 200) {
                return [
                    'success' => false,
                    'error' => "HTTP {$statusCode}",
                ];
            }

            $html = (string) $response->getBody();

            // Check content size
            $maxSize = config('scraper.max_content_size', 5000000);
            if (strlen($html) > $maxSize) {
                return [
                    'success' => false,
                    'error' => 'Content too large',
                ];
            }

            return [
                'success' => true,
                'html' => $html,
                'status_code' => $statusCode,
            ];

        } catch (GuzzleException $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Save scraped page to database.
     */
    private function savePage(Website $website, array $data, array $matches, string $url): ?ScrapedPage
    {
        // Calculate content hash for deduplication
        $contentHash = hash('sha256', $data['content_text']);

        // Check if page already exists
        $existing = ScrapedPage::where('content_hash', $contentHash)
            ->where('canonical_url', $data['canonical_url'])
            ->first();

        if ($existing) {
            Log::info("Duplicate page detected: {$url}");
            
            // Update matched keywords if new matches found
            $existingMatches = $existing->matched_keywords ?? [];
            $newMatches = array_merge($existingMatches, $matches);
            $existing->update(['matched_keywords' => $newMatches]);
            
            return $existing;
        }

        // Create new page
        try {
            return ScrapedPage::create([
                'website_id' => $website->id,
                'url' => $url,
                'canonical_url' => $data['canonical_url'],
                'title' => $data['title'],
                'meta_description' => $data['meta_description'],
                'publish_date' => $data['publish_date'] ?? now(),
                'content_text' => $data['content_text'],
                'content_html' => $data['content_html'],
                'content_hash' => $contentHash,
                'language' => $data['language'],
                'scraped_at' => now(),
                'matched_keywords' => $matches,
                'images' => $data['images'],
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to save page: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Scrape multiple websites.
     */
    public function scrapeMultiple(array $websiteIds): array
    {
        $results = [];

        foreach ($websiteIds as $websiteId) {
            $website = Website::find($websiteId);
            
            if (!$website || !$website->active) {
                continue;
            }

            $results[$websiteId] = $this->scrape($website);
        }

        return $results;
    }
}
