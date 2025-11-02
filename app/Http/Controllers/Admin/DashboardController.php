<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Website;
use App\Models\Topic;
use App\Models\ScrapedPage;
use App\Models\ScrapeJob;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'total_websites' => Website::count(),
            'active_websites' => Website::where('active', true)->count(),
            'total_topics' => Topic::count(),
            'total_pages' => ScrapedPage::count(),
            'pages_today' => ScrapedPage::whereDate('created_at', today())->count(),
            'recent_jobs' => ScrapeJob::with('website')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn($job) => [
                    'id' => $job->id,
                    'website' => $job->website->label,
                    'status' => $job->status,
                    'pages_scraped' => $job->pages_scraped,
                    'pages_matched' => $job->pages_matched,
                    'started_at' => $job->started_at?->format('Y-m-d H:i:s'),
                    'finished_at' => $job->finished_at?->format('Y-m-d H:i:s'),
                    'duration' => $job->duration,
                ]),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
