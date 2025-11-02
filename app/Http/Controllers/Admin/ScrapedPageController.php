<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ScrapedPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScrapedPageController extends Controller
{
    /**
     * Display a listing of scraped pages.
     */
    public function index(Request $request): Response
    {
        $query = ScrapedPage::with('website')
            ->orderBy('scraped_at', 'desc');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content_text', 'like', "%{$search}%");
            });
        }

        // Filter by website
        if ($request->has('website_id')) {
            $query->where('website_id', $request->website_id);
        }

        $pages = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/ScrapedPages/Index', [
            'pages' => $pages,
            'filters' => $request->only(['search', 'website_id']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScrapedPage $scrapedPage)
    {
        $scrapedPage->delete();

        return redirect()->back()->with('success', 'Article deleted successfully.');
    }

    /**
     * Remove multiple scraped pages.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:scraped_pages,id',
        ]);

        ScrapedPage::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', count($request->ids) . ' articles deleted successfully.');
    }
}
