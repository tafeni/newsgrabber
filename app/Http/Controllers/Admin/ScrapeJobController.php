<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ScrapeJob;
use Inertia\Inertia;
use Inertia\Response;

class ScrapeJobController extends Controller
{
    /**
     * Display a listing of scrape jobs.
     */
    public function index(): Response
    {
        $jobs = ScrapeJob::with('website')
            ->latest()
            ->paginate(50)
            ->through(fn($job) => [
                'id' => $job->id,
                'website' => [
                    'id' => $job->website->id,
                    'label' => $job->website->label,
                    'url' => $job->website->url,
                ],
                'status' => $job->status,
                'pages_scraped' => $job->pages_scraped,
                'pages_matched' => $job->pages_matched,
                'started_at' => $job->started_at?->format('Y-m-d H:i:s'),
                'finished_at' => $job->finished_at?->format('Y-m-d H:i:s'),
                'duration' => $job->duration,
                'log' => $job->log,
                'created_at' => $job->created_at->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/ScrapeJobs/Index', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Display the specified scrape job.
     */
    public function show(ScrapeJob $scrapeJob): Response
    {
        $scrapeJob->load('website');

        return Inertia::render('Admin/ScrapeJobs/Show', [
            'job' => [
                'id' => $scrapeJob->id,
                'website' => [
                    'id' => $scrapeJob->website->id,
                    'label' => $scrapeJob->website->label,
                    'url' => $scrapeJob->website->url,
                ],
                'status' => $scrapeJob->status,
                'pages_scraped' => $scrapeJob->pages_scraped,
                'pages_matched' => $scrapeJob->pages_matched,
                'started_at' => $scrapeJob->started_at?->format('Y-m-d H:i:s'),
                'finished_at' => $scrapeJob->finished_at?->format('Y-m-d H:i:s'),
                'duration' => $scrapeJob->duration,
                'log' => $scrapeJob->log,
                'created_at' => $scrapeJob->created_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }
}
