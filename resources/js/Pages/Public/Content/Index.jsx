import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Globe, Tag } from 'lucide-react';
import { useState } from 'react';

export default function Index({ pages, topics, websites, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/', { ...filters, search: searchTerm }, { preserveState: true });
    };

    const handleFilterChange = (key, value) => {
        router.get('/', { ...filters, [key]: value }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/', {}, { preserveState: true });
    };

    return (
        <PublicLayout>
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Aggregated News Content</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Discover curated articles from trusted sources
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center"
                            >
                                <Filter className="h-5 w-5 mr-2" />
                                Filters
                            </button>
                        </form>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Topic Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="inline h-4 w-4 mr-1" />
                                        Topic
                                    </label>
                                    <select
                                        value={filters.topic || ''}
                                        onChange={(e) => handleFilterChange('topic', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                    >
                                        <option value="">All Topics</option>
                                        {topics.map((topic) => (
                                            <option key={topic.id} value={topic.id}>
                                                {topic.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Website Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Globe className="inline h-4 w-4 mr-1" />
                                        Source
                                    </label>
                                    <select
                                        value={filters.website || ''}
                                        onChange={(e) => handleFilterChange('website', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                    >
                                        <option value="">All Sources</option>
                                        {websites.map((website) => (
                                            <option key={website.id} value={website.id}>
                                                {website.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="inline h-4 w-4 mr-1" />
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.from || ''}
                                        onChange={(e) => handleFilterChange('from', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Active Filters */}
                    {(filters.search || filters.topic || filters.website || filters.from) && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {filters.search && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    Search: {filters.search}
                                </span>
                            )}
                            {filters.topic && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Topic Filter Active
                                </span>
                            )}
                            {filters.website && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Source Filter Active
                                </span>
                            )}
                        </div>
                    )}

                    {/* Articles Grid */}
                    {pages.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {pages.data.map((page) => (
                                    <Link
                                        key={page.id}
                                        href={`/content/${page.id}`}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {page.thumbnail && (
                                            <img
                                                src={page.thumbnail}
                                                alt={page.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {page.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{page.excerpt}</p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {page.topics.slice(0, 3).map((topic, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <Globe className="h-3 w-3 mr-1" />
                                                    {page.website.label}
                                                </span>
                                                <span>{page.publish_date}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pages.links.length > 3 && (
                                <div className="flex items-center justify-center">
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        {pages.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveState
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-gray-900 text-white'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                                } ${!link.url && 'cursor-not-allowed opacity-50'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No articles found. Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
