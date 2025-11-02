<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Topic;
use App\Models\Keyword;
use App\Models\Website;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@newsgrabber.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'Regular User',
            'email' => 'user@newsgrabber.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create sample topics
        $techTopic = Topic::create([
            'name' => 'Technology',
            'description' => 'News about technology, software, and innovation',
        ]);

        $businessTopic = Topic::create([
            'name' => 'Business',
            'description' => 'Business news and market updates',
        ]);

        $scienceTopic = Topic::create([
            'name' => 'Science',
            'description' => 'Scientific discoveries and research',
        ]);

        // Create sample keywords
        Keyword::create([
            'topic_id' => $techTopic->id,
            'keyword' => 'artificial intelligence',
            'match_type' => 'phrase',
        ]);

        Keyword::create([
            'topic_id' => $techTopic->id,
            'keyword' => 'machine learning',
            'match_type' => 'phrase',
        ]);

        Keyword::create([
            'topic_id' => $techTopic->id,
            'keyword' => 'software',
            'match_type' => 'exact',
        ]);

        Keyword::create([
            'topic_id' => $businessTopic->id,
            'keyword' => 'stock market',
            'match_type' => 'phrase',
        ]);

        Keyword::create([
            'topic_id' => $businessTopic->id,
            'keyword' => 'economy',
            'match_type' => 'exact',
        ]);

        Keyword::create([
            'topic_id' => $scienceTopic->id,
            'keyword' => 'research',
            'match_type' => 'exact',
        ]);

        // Create sample websites (commented out - add real websites)
        // Website::create([
        //     'url' => 'https://techcrunch.com',
        //     'label' => 'TechCrunch',
        //     'rate_limit_per_minute' => 10,
        //     'active' => true,
        // ]);
    }
}
