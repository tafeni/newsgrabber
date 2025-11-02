import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/topics');
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/topics" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Topic</h1>
                        <p className="mt-1 text-sm text-gray-500">Create a topic to organize keywords</p>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                                placeholder="e.g., Technology"
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
                                placeholder="Brief description of this topic..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                href="/admin/topics"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Topic'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
