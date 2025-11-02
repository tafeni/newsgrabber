# News Grabber - Production-Ready News Aggregation Platform

A full-stack web application for scraping, aggregating, and displaying news content from multiple sources. Built with Laravel 10, React 18, Inertia.js, and PostgreSQL with full-text search capabilities.

## Features

### Admin Dashboard
- **Website Management**: Add, edit, and manage news sources with rate limiting
- **Topic & Keyword Configuration**: Organize keywords by topics for intelligent content matching
- **Scraping Jobs**: Monitor scraping activity with detailed logs and status tracking
- **Manual & Scheduled Scraping**: Trigger scrapes on-demand or via Laravel scheduler
- **Queue System**: Background job processing with automatic retries and failure handling

### Content Scraper
- **Intelligent Content Extraction**: Uses DOM parsing with readability heuristics
- **Metadata Extraction**: Titles, descriptions, publish dates, canonical URLs, and images
- **Keyword Matching**: Supports exact, phrase, and regex matching
- **Deduplication**: SHA256 content hashing prevents duplicate articles
- **HTML Sanitization**: Removes scripts and dangerous content

### Public Interface
- **Professional Content Display**: Responsive grid layout with card-based design
- **Advanced Filtering**: By topic, keyword, source, date range
- **Full-Text Search**: PostgreSQL tsvector with GIN indexing
- **Pagination**: Efficient data loading
- **SEO-Friendly**: Proper meta tags and semantic HTML

## Tech Stack

### Backend
- **Laravel 10**: PHP framework with Eloquent ORM
- **PostgreSQL**: Database with full-text search (tsvector + GIN index)
- **Queue System**: Database-backed job queue with worker processes
- **Symfony DomCrawler**: HTML parsing and content extraction

### Frontend
- **React 18**: Modern UI library
- **Inertia.js**: SPA without API complexity
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icon set
- **Headless UI**: Accessible components

## Installation

### Prerequisites
- PHP 8.1+, PostgreSQL 13+, Composer, Node.js 18+, npm

### Quick Start

```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env, then:
php artisan migrate
php artisan db:seed

# Build assets and start
npm run dev
php artisan serve
php artisan queue:work
```

**Default Credentials:**
- Admin: `admin@newsgrabber.com` / `password`
- User: `user@newsgrabber.com` / `password`

## Usage

1. **Add Websites**: Admin → Websites → Add Website
2. **Configure Topics**: Admin → Topics → Create topics and add keywords
3. **Run Scrapes**: Click play icon or use bulk scrape
4. **Monitor**: Check Admin → Scrape Jobs for status
5. **View Content**: Public homepage displays aggregated articles

## Documentation

See full documentation in `/docs` folder (run `php artisan make:docs` to generate).

## Testing

```bash
php artisan test      # Backend tests
npm test             # Frontend tests
```

## License

MIT License
