<?php

namespace Tests\Feature;

use App\Models\Website;
use App\Models\ScrapedPage;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentDisplayTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_content_index(): void
    {
        $response = $this->get('/');
        
        $response->assertStatus(200);
    }

    public function test_public_can_view_single_content(): void
    {
        $website = Website::factory()->create();
        $page = ScrapedPage::factory()->create([
            'website_id' => $website->id,
        ]);

        $response = $this->get("/content/{$page->id}");
        
        $response->assertStatus(200);
    }

    public function test_content_index_shows_scraped_pages(): void
    {
        $website = Website::factory()->create();
        ScrapedPage::factory()->count(3)->create([
            'website_id' => $website->id,
        ]);

        $response = $this->get('/');
        
        $response->assertStatus(200);
    }

    public function test_search_filters_content(): void
    {
        $website = Website::factory()->create();
        ScrapedPage::factory()->create([
            'website_id' => $website->id,
            'title' => 'Unique Search Term Article',
        ]);

        $response = $this->get('/?search=Unique');
        
        $response->assertStatus(200);
    }
}
