<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Website;
use App\Models\ScrapeJob;
use App\Jobs\ScrapeWebsiteJob;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    /**
     * Display a listing of websites.
     */
    public function index(): Response
    {
        $websites = Website::withCount('scrapedPages')
            ->latest()
            ->paginate(20)
            ->through(fn($website) => [
                'id' => $website->id,
                'url' => $website->url,
                'label' => $website->label,
                'domain' => $website->domain,
                'active' => $website->active,
                'rate_limit_per_minute' => $website->rate_limit_per_minute,
                'last_scraped_at' => $website->last_scraped_at?->format('Y-m-d H:i:s'),
                'scraped_pages_count' => $website->scraped_pages_count,
            ]);

        return Inertia::render('Admin/Websites/Index', [
            'websites' => $websites,
        ]);
    }

    /**
     * Show the form for creating a new website.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Websites/Create');
    }

    /**
     * Store a newly created website.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'url' => 'required|url|unique:websites,url',
            'label' => 'required|string|max:255',
            'rate_limit_per_minute' => 'nullable|integer|min:1|max:100',
            'active' => 'boolean',
        ]);

        $website = Website::create($validated);

        return redirect()
            ->route('admin.websites.index')
            ->with('success', "Website '{$website->label}' created successfully.");
    }

    /**
     * Show the form for editing a website.
     */
    public function edit(Website $website): Response
    {
        return Inertia::render('Admin/Websites/Edit', [
            'website' => [
                'id' => $website->id,
                'url' => $website->url,
                'label' => $website->label,
                'rate_limit_per_minute' => $website->rate_limit_per_minute,
                'active' => $website->active,
                'settings' => $website->settings,
            ],
        ]);
    }

    /**
     * Update the specified website.
     */
    public function update(Request $request, Website $website): RedirectResponse
    {
        $validated = $request->validate([
            'url' => 'required|url|unique:websites,url,' . $website->id,
            'label' => 'required|string|max:255',
            'rate_limit_per_minute' => 'nullable|integer|min:1|max:100',
            'active' => 'boolean',
        ]);

        $website->update($validated);

        return redirect()
            ->route('admin.websites.index')
            ->with('success', "Website '{$website->label}' updated successfully.");
    }

    /**
     * Remove the specified website.
     */
    public function destroy(Website $website): RedirectResponse
    {
        $label = $website->label;
        $website->delete();

        return redirect()
            ->route('admin.websites.index')
            ->with('success', "Website '{$label}' deleted successfully.");
    }

    /**
     * Trigger manual scrape for a website.
     */
    public function scrape(Website $website): RedirectResponse
    {
        // Create scrape job
        $scrapeJob = ScrapeJob::create([
            'website_id' => $website->id,
            'status' => 'pending',
        ]);

        // Dispatch to queue
        ScrapeWebsiteJob::dispatch($website, $scrapeJob);

        return back()->with('success', "Scrape job queued for '{$website->label}'.");
    }

    /**
     * Trigger bulk scrape for multiple websites.
     */
    public function bulkScrape(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'website_ids' => 'required|array',
            'website_ids.*' => 'exists:websites,id',
        ]);

        $count = 0;
        foreach ($validated['website_ids'] as $websiteId) {
            $website = Website::find($websiteId);
            
            if ($website && $website->active) {
                $scrapeJob = ScrapeJob::create([
                    'website_id' => $website->id,
                    'status' => 'pending',
                ]);

                ScrapeWebsiteJob::dispatch($website, $scrapeJob);
                $count++;
            }
        }

        return back()->with('success', "Queued {$count} scrape jobs.");
    }
}
