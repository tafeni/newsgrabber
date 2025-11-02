import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Trash2, Search, Filter } from 'lucide-react';

export default function Index({ pages, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedPages, setSelectedPages] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/scraped-pages', { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/scraped-pages/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedPages.length === 0) {
            alert('Please select articles to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedPages.length} article(s)?`)) {
            router.post('/admin/scraped-pages/bulk-delete', { ids: selectedPages }, {
                preserveScroll: true,
                onSuccess: () => setSelectedPages([]),
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedPages.length === pages.data.length) {
            setSelectedPages([]);
        } else {
            setSelectedPages(pages.data.map(page => page.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedPages.includes(id)) {
            setSelectedPages(selectedPages.filter(pageId => pageId !== id));
        } else {
            setSelectedPages([...selectedPages, id]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Scraped Content" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800">Scraped Content</h2>
                                
                                {selectedPages.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Selected ({selectedPages.length})
                                    </button>
                                )}
                            </div>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search articles..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Search
                                    </button>
                                    {filters.search && (
                                        <Link
                                            href="/admin/scraped-pages"
                                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Clear
                                        </Link>
                                    )}
                                </div>
                            </form>

                            {/* Articles Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPages.length === pages.data.length && pages.data.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Source
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Scraped Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Keywords
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pages.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    No articles found. Start scraping to see content here.
                                                </td>
                                            </tr>
                                        ) : (
                                            pages.data.map((page) => (
                                                <tr key={page.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPages.includes(page.id)}
                                                            onChange={() => toggleSelect(page.id)}
                                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {page.title || 'Untitled'}
                                                        </div>
                                                        {page.meta_description && (
                                                            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                                                                {page.meta_description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">{page.website?.label}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(page.scraped_at).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(page.scraped_at).toLocaleTimeString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {page.matched_keywords && page.matched_keywords.length > 0 ? (
                                                                page.matched_keywords.slice(0, 3).map((match, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded"
                                                                    >
                                                                        {match.keyword}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-400">None</span>
                                                            )}
                                                            {page.matched_keywords && page.matched_keywords.length > 3 && (
                                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                                    +{page.matched_keywords.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={`/content/${page.id}`}
                                                                target="_blank"
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(page.id)}
                                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pages.last_page > 1 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Showing {pages.from} to {pages.to} of {pages.total} articles
                                    </div>
                                    <div className="flex gap-2">
                                        {pages.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 border rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
