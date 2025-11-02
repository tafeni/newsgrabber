<?php

namespace App\Services;

use Symfony\Component\DomCrawler\Crawler;

class ContentExtractor
{
    private const REMOVAL_SELECTORS = [
        'nav', 'header', 'footer', 'aside', 'script', 'style', 'iframe', 'noscript',
        '.navigation', '.nav', '.header', '.footer', '.sidebar', '.menu',
        '.advertisement', '.ad', '.ads', '.social', '.share', '.comments', '.related',
        '#nav', '#header', '#footer', '#sidebar', '#menu',
        '.wp-caption-text', '.gallery', '.attachment', '.byline', '.author-box',
        '.tags', '.post-tags', '.share-buttons', '.social-share', '.newsletter',
        '.popup', '.modal', '.cookie', '.gdpr', '.promo', '.sponsor',
        '[class*="ad-"]', '[id*="ad-"]', '[class*="banner"]', '[class*="widget"]',
        '.related-posts', '.you-may-like', '.recommended', '.trending',
    ];

    /**
     * Extract main content from HTML.
     */
    public function extractContent(string $html, string $url): array
    {
        $crawler = new Crawler($html, $url);

        return [
            'title' => $this->extractTitle($crawler),
            'meta_description' => $this->extractMetaDescription($crawler),
            'canonical_url' => $this->extractCanonicalUrl($crawler, $url),
            'publish_date' => $this->extractPublishDate($crawler),
            'content_text' => $this->extractMainText($crawler),
            'content_html' => $this->extractMainHtml($crawler),
            'images' => $this->extractImages($crawler, $url),
            'language' => $this->extractLanguage($crawler),
        ];
    }

    /**
     * Extract article links from homepage.
     */
    public function extractArticleLinks(string $html, string $baseUrl): array
    {
        $crawler = new Crawler($html, $baseUrl);
        $links = [];
        $seen = [];

        try {
            // Find all article links - common patterns for news sites
            $crawler->filter('a[href]')->each(function (Crawler $node) use (&$links, &$seen, $baseUrl) {
                try {
                    $href = $node->attr('href');
                    
                    // Convert relative URLs to absolute
                    $absoluteUrl = $this->normalizeUrl($href, $baseUrl);
                    
                    // Filter out unwanted URLs
                    if ($this->isValidArticleUrl($absoluteUrl, $baseUrl) && !isset($seen[$absoluteUrl])) {
                        $links[] = $absoluteUrl;
                        $seen[$absoluteUrl] = true;
                    }
                } catch (\Exception $e) {
                    // Skip invalid links
                }
            });
        } catch (\Exception $e) {
            // Return empty array if extraction fails
        }

        return array_unique($links);
    }

    /**
     * Check if URL is likely an article URL.
     */
    private function isValidArticleUrl(string $url, string $baseUrl): bool
    {
        $parsed = parse_url($url);
        $baseParsed = parse_url($baseUrl);

        // Must have same domain
        if (!isset($parsed['host']) || $parsed['host'] !== $baseParsed['host']) {
            return false;
        }

        // Must have a path
        if (!isset($parsed['path']) || $parsed['path'] === '/' || $parsed['path'] === '') {
            return false;
        }

        $path = strtolower($parsed['path']);

        // Exclude common non-article URLs
        $excludePatterns = [
            '/tag/', '/category/', '/author/', '/page/', '/search/',
            '/login', '/register', '/cart', '/checkout', '/account',
            '/wp-admin', '/wp-content', '/wp-includes',
            '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip',
            '/feed', '/rss', '/sitemap', '/privacy', '/terms',
            '/contact', '/about', '/advertise',
        ];

        foreach ($excludePatterns as $pattern) {
            if (strpos($path, $pattern) !== false) {
                return false;
            }
        }

        // Must have reasonable path depth (typically articles have /year/month/slug or /category/slug)
        $pathParts = explode('/', trim($path, '/'));
        if (count($pathParts) < 1 || count($pathParts) > 6) {
            return false;
        }

        return true;
    }

    /**
     * Normalize URL to absolute.
     */
    private function normalizeUrl(string $url, string $baseUrl): string
    {
        // Already absolute
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        $base = parse_url($baseUrl);
        $scheme = $base['scheme'] ?? 'https';
        $host = $base['host'] ?? '';

        // Protocol-relative URL
        if (strpos($url, '//') === 0) {
            return $scheme . ':' . $url;
        }

        // Absolute path
        if (strpos($url, '/') === 0) {
            return $scheme . '://' . $host . $url;
        }

        // Relative path
        $basePath = isset($base['path']) ? dirname($base['path']) : '';
        return $scheme . '://' . $host . $basePath . '/' . $url;
    }

    /**
     * Extract title from HTML.
     */
    private function extractTitle(Crawler $crawler): ?string
    {
        // Try Open Graph title
        try {
            $ogTitle = $crawler->filterXPath('//meta[@property="og:title"]')->attr('content');
            if ($ogTitle) {
                return $this->sanitize($ogTitle);
            }
        } catch (\Exception $e) {
            // Continue to next method
        }

        // Try <title> tag
        try {
            $title = $crawler->filter('title')->text();
            if ($title) {
                return $this->sanitize($title);
            }
        } catch (\Exception $e) {
            // Continue
        }

        // Try h1
        try {
            $h1 = $crawler->filter('h1')->first()->text();
            if ($h1) {
                return $this->sanitize($h1);
            }
        } catch (\Exception $e) {
            // No title found
        }

        return null;
    }

    /**
     * Extract meta description.
     */
    private function extractMetaDescription(Crawler $crawler): ?string
    {
        try {
            // Try Open Graph description
            $ogDesc = $crawler->filterXPath('//meta[@property="og:description"]')->attr('content');
            if ($ogDesc) {
                return $this->sanitize($ogDesc);
            }
        } catch (\Exception $e) {
            // Continue
        }

        try {
            // Try meta description
            $desc = $crawler->filterXPath('//meta[@name="description"]')->attr('content');
            if ($desc) {
                return $this->sanitize($desc);
            }
        } catch (\Exception $e) {
            // No description found
        }

        return null;
    }

    /**
     * Extract canonical URL.
     */
    private function extractCanonicalUrl(Crawler $crawler, string $fallbackUrl): string
    {
        try {
            $canonical = $crawler->filterXPath('//link[@rel="canonical"]')->attr('href');
            if ($canonical) {
                return $this->absoluteUrl($canonical, $fallbackUrl);
            }
        } catch (\Exception $e) {
            // Use fallback
        }

        try {
            $ogUrl = $crawler->filterXPath('//meta[@property="og:url"]')->attr('content');
            if ($ogUrl) {
                return $ogUrl;
            }
        } catch (\Exception $e) {
            // Use fallback
        }

        return $fallbackUrl;
    }

    /**
     * Extract publish date.
     */
    private function extractPublishDate(Crawler $crawler): ?string
    {
        $selectors = [
            '//meta[@property="article:published_time"]',
            '//meta[@name="publish_date"]',
            '//meta[@name="date"]',
            '//time[@datetime]',
            '//meta[@property="og:published_time"]',
        ];

        foreach ($selectors as $selector) {
            try {
                $node = $crawler->filterXPath($selector);
                if ($node->count() > 0) {
                    $date = $selector === '//time[@datetime]' 
                        ? $node->attr('datetime')
                        : $node->attr('content');
                    
                    if ($date && $this->isValidDate($date)) {
                        return date('Y-m-d H:i:s', strtotime($date));
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    /**
     * Extract main text content.
     */
    private function extractMainText(Crawler $crawler): string
    {
        $content = $this->getMainContentNode($crawler);
        
        if (!$content) {
            return '';
        }

        // Clone the content to avoid modifying original
        $clonedContent = clone $content;

        // Remove unwanted elements
        foreach (self::REMOVAL_SELECTORS as $selector) {
            try {
                $clonedContent->filter($selector)->each(function (Crawler $node) {
                    foreach ($node as $domNode) {
                        if ($domNode->parentNode) {
                            $domNode->parentNode->removeChild($domNode);
                        }
                    }
                });
            } catch (\Exception $e) {
                // Continue
            }
        }

        // Extract text from paragraphs to preserve structure
        try {
            $paragraphs = [];
            
            // Try to get paragraph text
            $clonedContent->filter('p')->each(function (Crawler $p) use (&$paragraphs) {
                try {
                    $text = trim($p->text());
                    if (!empty($text) && strlen($text) > 20) { // Skip very short paragraphs
                        $paragraphs[] = $text;
                    }
                } catch (\Exception $e) {
                    // Skip
                }
            });

            // If we have paragraphs, join them
            if (!empty($paragraphs)) {
                return $this->normalizeWhitespace(implode("\n\n", $paragraphs));
            }

            // Fallback to getting all text
            $text = $clonedContent->text();
            return $this->normalizeWhitespace($text);
        } catch (\Exception $e) {
            return '';
        }
    }

    /**
     * Extract main HTML content.
     */
    private function extractMainHtml(Crawler $crawler): ?string
    {
        if (!config('scraper.store_raw_html', false)) {
            return null;
        }

        $content = $this->getMainContentNode($crawler);
        
        if (!$content) {
            return null;
        }

        try {
            return $this->sanitizeHtml($content->html());
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get main content node using heuristics.
     */
    private function getMainContentNode(Crawler $crawler): ?Crawler
    {
        // Try common article content selectors (WordPress and common CMS patterns)
        $articleSelectors = [
            '.entry-content',          // WordPress default
            '.post-content',           // Common alternative
            '.article-content',        // News sites
            '.story-content',          // News sites
            '.content-body',           // Generic
            'article .content',        // Semantic
            '.article-body',           // News sites
            '[itemprop="articleBody"]', // Schema.org
            '.post-body',              // Blogs
            '#content article',        // Common pattern
        ];
        
        foreach ($articleSelectors as $selector) {
            try {
                $node = $crawler->filter($selector);
                if ($node->count() > 0) {
                    $text = $node->first()->text();
                    // Must have substantial content (at least 100 characters)
                    if (strlen($text) > 100) {
                        return $node->first();
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        // Try semantic HTML5 elements
        $semanticSelectors = ['article', 'main', '[role="main"]'];
        
        foreach ($semanticSelectors as $selector) {
            try {
                $node = $crawler->filter($selector);
                if ($node->count() > 0) {
                    $text = $node->first()->text();
                    // Must have substantial content
                    if (strlen($text) > 100) {
                        return $node->first();
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        // Find largest text-containing node with paragraph content
        try {
            $maxLength = 0;
            $bestNode = null;

            $crawler->filter('div, section, article')->each(function (Crawler $node) use (&$maxLength, &$bestNode) {
                try {
                    // Count paragraphs to ensure it's actual article content
                    $paragraphCount = $node->filter('p')->count();
                    $text = $node->text();
                    $length = strlen($text);
                    
                    // Must have multiple paragraphs and substantial length
                    if ($paragraphCount >= 2 && $length > $maxLength && $length > 200) {
                        $maxLength = $length;
                        $bestNode = $node;
                    }
                } catch (\Exception $e) {
                    // Skip
                }
            });

            return $bestNode;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Extract images from content.
     */
    private function extractImages(Crawler $crawler, string $baseUrl): array
    {
        $images = [];

        try {
            // Try Open Graph image
            $ogImage = $crawler->filterXPath('//meta[@property="og:image"]')->attr('content');
            if ($ogImage) {
                $images[] = $this->absoluteUrl($ogImage, $baseUrl);
            }
        } catch (\Exception $e) {
            // Continue
        }

        // Extract from main content
        $content = $this->getMainContentNode($crawler);
        
        if ($content) {
            try {
                $content->filter('img')->each(function (Crawler $img) use (&$images, $baseUrl) {
                    try {
                        $src = $img->attr('src');
                        if ($src && !$this->isDataUrl($src)) {
                            $absoluteUrl = $this->absoluteUrl($src, $baseUrl);
                            if (!in_array($absoluteUrl, $images)) {
                                $images[] = $absoluteUrl;
                            }
                        }
                    } catch (\Exception $e) {
                        // Skip
                    }
                });
            } catch (\Exception $e) {
                // No images
            }
        }

        return array_slice($images, 0, 10); // Limit to 10 images
    }

    /**
     * Extract language.
     */
    private function extractLanguage(Crawler $crawler): ?string
    {
        try {
            return $crawler->filterXPath('//html')->attr('lang');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Sanitize text content.
     */
    private function sanitize(string $text): string
    {
        return strip_tags(html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }

    /**
     * Sanitize HTML content (remove scripts, event handlers).
     */
    private function sanitizeHtml(string $html): string
    {
        // Remove script tags
        $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
        
        // Remove inline event handlers
        $html = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $html);
        
        // Remove javascript: URLs
        $html = preg_replace('/href\s*=\s*["\']javascript:[^"\']*["\']/i', '', $html);
        
        return $html;
    }

    /**
     * Normalize whitespace in text.
     */
    private function normalizeWhitespace(string $text): string
    {
        // Replace multiple spaces with single space
        $text = preg_replace('/\s+/', ' ', $text);
        
        // Trim
        return trim($text);
    }

    /**
     * Convert relative URL to absolute.
     */
    private function absoluteUrl(string $url, string $baseUrl): string
    {
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        $base = parse_url($baseUrl);
        
        // Handle protocol-relative URLs
        if (substr($url, 0, 2) === '//') {
            return ($base['scheme'] ?? 'https') . ':' . $url;
        }

        // Handle absolute paths
        if (substr($url, 0, 1) === '/') {
            return ($base['scheme'] ?? 'https') . '://' . ($base['host'] ?? '') . $url;
        }

        // Handle relative paths
        $path = $base['path'] ?? '';
        $path = substr($path, 0, strrpos($path, '/') + 1);
        
        return ($base['scheme'] ?? 'https') . '://' . ($base['host'] ?? '') . $path . $url;
    }

    /**
     * Check if URL is a data URL.
     */
    private function isDataUrl(string $url): bool
    {
        return strpos($url, 'data:') === 0;
    }

    /**
     * Check if date is valid.
     */
    private function isValidDate(string $date): bool
    {
        try {
            $timestamp = strtotime($date);
            return $timestamp !== false && $timestamp > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
}
