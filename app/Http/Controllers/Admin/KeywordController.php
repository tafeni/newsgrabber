<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Keyword;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class KeywordController extends Controller
{
    /**
     * Store a newly created keyword.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'keyword' => 'required|string|max:255',
            'match_type' => 'required|in:exact,phrase,regex',
        ]);

        Keyword::create($validated);

        return back()->with('success', 'Keyword added successfully.');
    }

    /**
     * Update the specified keyword.
     */
    public function update(Request $request, Keyword $keyword): RedirectResponse
    {
        $validated = $request->validate([
            'keyword' => 'required|string|max:255',
            'match_type' => 'required|in:exact,phrase,regex',
        ]);

        $keyword->update($validated);

        return back()->with('success', 'Keyword updated successfully.');
    }

    /**
     * Remove the specified keyword.
     */
    public function destroy(Keyword $keyword): RedirectResponse
    {
        $keyword->delete();

        return back()->with('success', 'Keyword deleted successfully.');
    }
}
