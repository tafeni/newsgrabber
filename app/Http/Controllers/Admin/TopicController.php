<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TopicController extends Controller
{
    /**
     * Display a listing of topics.
     */
    public function index(): Response
    {
        $topics = Topic::withCount('keywords')
            ->latest()
            ->paginate(20)
            ->through(fn($topic) => [
                'id' => $topic->id,
                'name' => $topic->name,
                'description' => $topic->description,
                'keywords_count' => $topic->keywords_count,
                'created_at' => $topic->created_at->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Admin/Topics/Index', [
            'topics' => $topics,
        ]);
    }

    /**
     * Show the form for creating a new topic.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Topics/Create');
    }

    /**
     * Store a newly created topic.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:topics,name',
            'description' => 'nullable|string',
        ]);

        $topic = Topic::create($validated);

        return redirect()
            ->route('admin.topics.index')
            ->with('success', "Topic '{$topic->name}' created successfully.");
    }

    /**
     * Show the form for editing a topic.
     */
    public function edit(Topic $topic): Response
    {
        $topic->load('keywords');

        return Inertia::render('Admin/Topics/Edit', [
            'topic' => [
                'id' => $topic->id,
                'name' => $topic->name,
                'description' => $topic->description,
                'keywords' => $topic->keywords->map(fn($keyword) => [
                    'id' => $keyword->id,
                    'keyword' => $keyword->keyword,
                    'match_type' => $keyword->match_type,
                ]),
            ],
        ]);
    }

    /**
     * Update the specified topic.
     */
    public function update(Request $request, Topic $topic): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:topics,name,' . $topic->id,
            'description' => 'nullable|string',
        ]);

        $topic->update($validated);

        return redirect()
            ->route('admin.topics.index')
            ->with('success', "Topic '{$topic->name}' updated successfully.");
    }

    /**
     * Remove the specified topic.
     */
    public function destroy(Topic $topic): RedirectResponse
    {
        $name = $topic->name;
        $topic->delete();

        return redirect()
            ->route('admin.topics.index')
            ->with('success', "Topic '{$name}' deleted successfully.");
    }
}
