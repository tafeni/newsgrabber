<?php

namespace Database\Factories;

use App\Models\Website;
use Illuminate\Database\Eloquent\Factories\Factory;

class WebsiteFactory extends Factory
{
    protected $model = Website::class;

    public function definition(): array
    {
        return [
            'url' => $this->faker->url(),
            'label' => $this->faker->company(),
            'rate_limit_per_minute' => $this->faker->numberBetween(5, 20),
            'active' => $this->faker->boolean(80),
            'last_scraped_at' => $this->faker->optional()->dateTimeBetween('-1 week'),
        ];
    }
}
