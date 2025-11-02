<?php

namespace Database\Factories;

use App\Models\ScrapedPage;
use App\Models\Website;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScrapedPageFactory extends Factory
{
    protected $model = ScrapedPage::class;

    public function definition(): array
    {
        $content = $this->faker->paragraphs(5, true);
        
        return [
            'website_id' => Website::factory(),
            'url' => $this->faker->url(),
            'canonical_url' => $this->faker->url(),
            'title' => $this->faker->sentence(),
            'meta_description' => $this->faker->sentence(),
            'publish_date' => $this->faker->dateTimeBetween('-1 month'),
            'content_text' => $content,
            'content_html' => '<p>' . implode('</p><p>', $this->faker->paragraphs(5)) . '</p>',
            'content_hash' => hash('sha256', $content),
            'language' => 'en',
            'scraped_at' => now(),
            'matched_keywords' => [],
            'images' => [$this->faker->imageUrl()],
        ];
    }
}
