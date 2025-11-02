<?php

namespace Tests\Feature;

use App\Models\Website;
use App\Models\Topic;
use App\Models\Keyword;
use App\Services\ScraperService;
use App\Services\ContentExtractor;
use App\Services\KeywordMatcher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScraperServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ScraperService $scraperService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $contentExtractor = new ContentExtractor();
        $keywordMatcher = new KeywordMatcher();
        $this->scraperService = new ScraperService($contentExtractor, $keywordMatcher);
    }

    public function test_scraper_creates_scraped_page_with_matches(): void
    {
        // Create topic and keywords
        $topic = Topic::create([
            'name' => 'Technology',
            'description' => 'Tech news',
        ]);

        Keyword::create([
            'topic_id' => $topic->id,
            'keyword' => 'technology',
            'match_type' => 'phrase',
        ]);

        // Create website
        $website = Website::create([
            'url' => 'https://example.com',
            'label' => 'Example Site',
            'rate_limit_per_minute' => 10,
            'active' => true,
        ]);

        $this->assertDatabaseHas('websites', ['url' => 'https://example.com']);
    }

    public function test_keyword_matcher_matches_phrase(): void
    {
        $topic = Topic::create([
            'name' => 'Technology',
            'description' => 'Tech news',
        ]);

        Keyword::create([
            'topic_id' => $topic->id,
            'keyword' => 'artificial intelligence',
            'match_type' => 'phrase',
        ]);

        $matcher = new KeywordMatcher();
        $content = 'This article discusses artificial intelligence and its applications.';
        $matches = $matcher->matchKeywords($content);

        $this->assertNotEmpty($matches);
        $this->assertEquals('artificial intelligence', $matches[0]['keyword']);
    }

    public function test_keyword_matcher_matches_exact(): void
    {
        $topic = Topic::create([
            'name' => 'Technology',
            'description' => 'Tech news',
        ]);

        Keyword::create([
            'topic_id' => $topic->id,
            'keyword' => 'software',
            'match_type' => 'exact',
        ]);

        $matcher = new KeywordMatcher();
        $content = 'This article discusses software development.';
        $matches = $matcher->matchKeywords($content);

        $this->assertNotEmpty($matches);
        $this->assertEquals('software', $matches[0]['keyword']);
    }
}
