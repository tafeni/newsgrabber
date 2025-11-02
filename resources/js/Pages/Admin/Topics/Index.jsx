import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

export default function Index({ topics }) {
    const handleDelete = (topicId, name) => {
        if (confirm(`Are you sure you want to delete "${name}"? This will also delete all associated keywords.`)) {
            router.delete(`/admin/topics/${topicId}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Topics & Keywords</h1>
                        <p className="mt-1 text-sm text-gray-500">Organize keywords by topic for content matching</p>
                    </div>
                    <Link
                        href="/admin/topics/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Topic
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {topics.data.map((topic) => (
                            <li key={topic.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                <Tag className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                                                    {topic.description && (
                                                        <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                {topic.keywords_count} {topic.keywords_count === 1 ? 'keyword' : 'keywords'}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/admin/topics/${topic.id}/edit`}
                                                className="p-2 text-gray-600 hover:text-gray-900"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(topic.id, topic.name)}
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
                {topics.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{topics.from}</span> to{' '}
                                    <span className="font-medium">{topics.to}</span> of{' '}
                                    <span className="font-medium">{topics.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    {topics.links.map((link, index) => (
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
