import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Play, Trash2, Edit, Globe } from 'lucide-react';

export default function Index({ websites }) {
    const handleScrape = (websiteId) => {
        if (confirm('Start scraping this website now?')) {
            router.post(`/admin/websites/${websiteId}/scrape`);
        }
    };

    const handleDelete = (websiteId, label) => {
        if (confirm(`Are you sure you want to delete "${label}"? This will also delete all scraped pages.`)) {
            router.delete(`/admin/websites/${websiteId}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Websites</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage websites to scrape for content</p>
                    </div>
                    <Link
                        href="/admin/websites/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Website
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {websites.data.map((website) => (
                            <li key={website.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                <Globe className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {website.label}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{website.domain}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                <span>
                                                    Rate: {website.rate_limit_per_minute}/min
                                                </span>
                                                <span>
                                                    Pages: {website.scraped_pages_count}
                                                </span>
                                                {website.last_scraped_at && (
                                                    <span>
                                                        Last scraped: {website.last_scraped_at}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    website.active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {website.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleScrape(website.id)}
                                                className="p-2 text-blue-600 hover:text-blue-900"
                                                title="Scrape now"
                                            >
                                                <Play className="h-4 w-4" />
                                            </button>
                                            <Link
                                                href={`/admin/websites/${website.id}/edit`}
                                                className="p-2 text-gray-600 hover:text-gray-900"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(website.id, website.label)}
                                                className="p-2 text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pagination */}
                {websites.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md">
                        <div className="flex flex-1 justify-between sm:hidden">
                            {websites.links[0].url && (
                                <Link
                                    href={websites.links[0].url}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {websites.links[websites.links.length - 1].url && (
                                <Link
                                    href={websites.links[websites.links.length - 1].url}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{websites.from}</span> to{' '}
                                    <span className="font-medium">{websites.to}</span> of{' '}
                                    <span className="font-medium">{websites.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    {websites.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
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
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
