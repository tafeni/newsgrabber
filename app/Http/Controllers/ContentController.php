<?php

namespace App\Http\Controllers;

use App\Models\ScrapedPage;
use App\Models\Topic;
use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    /**
     * Display a listing of aggregated content.
     */
    public function index(Request $request): Response
    {
        $query = ScrapedPage::with('website')
            ->latest('publish_date');

        // Full-text search
        if ($search = $request->input('search')) {
            $query->fullTextSearch($search);
        }

        // Filter by topic
        if ($topicId = $request->input('topic')) {
            // Use raw PostgreSQL JSON query for better compatibility
            $query->whereRaw("matched_keywords::jsonb @> ?::jsonb", [
                json_encode([['topic_id' => (int)$topicId]])
            ]);
        }

        // Filter by keyword
        if ($keyword = $request->input('keyword')) {
            $query->where(function($q) use ($keyword) {
                $q->whereJsonContains('matched_keywords', ['keyword' => $keyword])
                  ->orWhere('title', 'ILIKE', "%{$keyword}%")
                  ->orWhere('content_text', 'ILIKE', "%{$keyword}%");
            });
        }

        // Filter by source domain
        if ($websiteId = $request->input('website')) {
            $query->where('website_id', $websiteId);
        }

        // Filter by date range
        if ($from = $request->input('from')) {
            $query->where('publish_date', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->where('publish_date', '<=', $to);
        }

        $pages = $query->paginate(24)->through(fn($page) => [
            'id' => $page->id,
            'title' => $page->title,
            'excerpt' => $page->excerpt ?? ($page->meta_description ? substr($page->meta_description, 0, 200) : substr($page->content_text, 0, 200)),
            'thumbnail' => $page->thumbnail ?? ($page->images[0] ?? null),
            'publish_date' => $page->publish_date?->format('M d, Y'),
            'website' => [
                'label' => $page->website->label,
                'domain' => $page->website->domain,
            ],
            'topics' => collect($page->matched_keywords ?? [])
                ->pluck('topic_name')
                ->unique()
                ->values()
                ->all(),
        ]);

        // Get filters data
        $topics = Topic::select('id', 'name')->get();
        $websites = Website::select('id', 'label', 'url')->where('active', true)->get();

        return Inertia::render('Public/Content/Index', [
            'pages' => $pages,
            'topics' => $topics,
            'websites' => $websites,
            'filters' => $request->only(['search', 'topic', 'keyword', 'website', 'from', 'to']),
        ]);
    }

    /**
     * Display a single content item.
     */
    public function show(ScrapedPage $page): Response
    {
        $page->load('website');

        return Inertia::render('Public/Content/Show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'meta_description' => $page->meta_description,
                'content_text' => $page->content_text,
                'content_html' => $page->content_html,
                'images' => $page->images,
                'publish_date' => $page->publish_date?->format('F d, Y \a\t h:i A'),
                'scraped_at' => $page->scraped_at->format('F d, Y'),
                'url' => $page->url,
                'canonical_url' => $page->canonical_url,
                'website' => [
                    'id' => $page->website->id,
                    'label' => $page->website->label,
                    'url' => $page->website->url,
                    'domain' => $page->website->domain,
                ],
                'topics' => collect($page->matched_keywords ?? [])
                    ->groupBy('topic_name')
                    ->map(fn($items, $topicName) => [
                        'name' => $topicName,
                        'keywords' => $items->pluck('keyword')->unique()->values()->all(),
                    ])
                    ->values()
                    ->all(),
            ],
        ]);
    }
}
