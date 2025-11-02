<?php

namespace App\Services;

use App\Models\Keyword;
use Illuminate\Support\Collection;

class KeywordMatcher
{
    /**
     * Match content against keywords and return matches.
     */
    public function matchKeywords(string $content, string $title = ''): array
    {
        $keywords = Keyword::with('topic')->get();
        $matches = [];

        $normalizedContent = $this->normalizeText($content);
        $normalizedTitle = $this->normalizeText($title);
        $fullText = $normalizedTitle . ' ' . $normalizedContent;

        foreach ($keywords as $keyword) {
            if ($this->matchKeyword($fullText, $keyword)) {
                $matches[] = [
                    'keyword_id' => $keyword->id,
                    'keyword' => $keyword->keyword,
                    'topic_id' => $keyword->topic_id,
                    'topic_name' => $keyword->topic->name,
                    'match_type' => $keyword->match_type,
                ];
            }
        }

        return $matches;
    }

    /**
     * Check if keyword matches content.
     */
    private function matchKeyword(string $content, Keyword $keyword): bool
    {
        $normalizedKeyword = $this->normalizeText($keyword->keyword);

        return match ($keyword->match_type) {
            'exact' => $this->matchExact($content, $normalizedKeyword),
            'phrase' => $this->matchPhrase($content, $normalizedKeyword),
            'regex' => $this->matchRegex($content, $keyword->keyword),
            default => false,
        };
    }

    /**
     * Match exact word.
     */
    private function matchExact(string $content, string $keyword): bool
    {
        return preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $content) === 1;
    }

    /**
     * Match phrase (case-insensitive substring).
     */
    private function matchPhrase(string $content, string $keyword): bool
    {
        return stripos($content, $keyword) !== false;
    }

    /**
     * Match using regex.
     */
    private function matchRegex(string $content, string $pattern): bool
    {
        try {
            return @preg_match('/' . $pattern . '/i', $content) === 1;
        } catch (\Exception $e) {
            // Invalid regex
            return false;
        }
    }

    /**
     * Normalize text for matching.
     */
    private function normalizeText(string $text): string
    {
        // Convert to lowercase
        $text = mb_strtolower($text, 'UTF-8');
        
        // Remove extra whitespace
        $text = preg_replace('/\s+/', ' ', $text);
        
        // Remove punctuation except spaces
        $text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);
        
        return trim($text);
    }

    /**
     * Get unique topics from matches.
     */
    public function getUniqueTopics(array $matches): array
    {
        $topics = [];
        
        foreach ($matches as $match) {
            if (!isset($topics[$match['topic_id']])) {
                $topics[$match['topic_id']] = $match['topic_name'];
            }
        }

        return $topics;
    }
}
