import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ topic }) {
    const { data, setData, put, processing, errors } = useForm({
        name: topic.name || '',
        description: topic.description || '',
    });

    const [newKeyword, setNewKeyword] = useState({ keyword: '', match_type: 'phrase' });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/topics/${topic.id}`);
    };

    const handleAddKeyword = (e) => {
        e.preventDefault();
        router.post('/admin/keywords', {
            topic_id: topic.id,
            ...newKeyword,
        }, {
            onSuccess: () => setNewKeyword({ keyword: '', match_type: 'phrase' }),
        });
    };

    const handleDeleteKeyword = (keywordId) => {
        if (confirm('Are you sure you want to delete this keyword?')) {
            router.delete(`/admin/keywords/${keywordId}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/topics" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Topic</h1>
                        <p className="mt-1 text-sm text-gray-500">Update topic and manage keywords</p>
                    </div>
                </div>

                {/* Topic Details */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Topic Details</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Topic Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Topic'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Keywords */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Keywords</h3>
                        
                        {/* Add Keyword Form */}
                        <form onSubmit={handleAddKeyword} className="mb-6 p-4 bg-gray-50 rounded-md">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="sm:col-span-1">
                                    <input
                                        type="text"
                                        value={newKeyword.keyword}
                                        onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                                        placeholder="Enter keyword"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-1">
                                    <select
                                        value={newKeyword.match_type}
                                        onChange={(e) => setNewKeyword({ ...newKeyword, match_type: e.target.value })}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                    >
                                        <option value="phrase">Phrase Match</option>
                                        <option value="exact">Exact Match</option>
                                        <option value="regex">Regex</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-1">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Keyword
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Keywords List */}
                        <div className="space-y-2">
                            {topic.keywords && topic.keywords.length > 0 ? (
                                topic.keywords.map((keyword) => (
                                    <div
                                        key={keyword.id}
                                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{keyword.keyword}</p>
                                            <p className="text-xs text-gray-500 capitalize">{keyword.match_type} match</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteKeyword(keyword.id)}
                                            className="p-2 text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No keywords added yet. Add keywords to match content for this topic.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
