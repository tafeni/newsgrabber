import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ website }) {
    const { data, setData, put, processing, errors } = useForm({
        url: website.url || '',
        label: website.label || '',
        rate_limit_per_minute: website.rate_limit_per_minute || 10,
        active: website.active || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/websites/${website.id}`);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/websites"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Website</h1>
                        <p className="mt-1 text-sm text-gray-500">Update website configuration</p>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                Website URL *
                            </label>
                            <input
                                type="url"
                                id="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                            />
                            {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                        </div>

                        <div>
                            <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                                Label *
                            </label>
                            <input
                                type="text"
                                id="label"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                            />
                            {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
                        </div>

                        <div>
                            <label htmlFor="rate_limit" className="block text-sm font-medium text-gray-700">
                                Rate Limit (requests per minute)
                            </label>
                            <input
                                type="number"
                                id="rate_limit"
                                value={data.rate_limit_per_minute}
                                onChange={(e) => setData('rate_limit_per_minute', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                min="1"
                                max="100"
                            />
                            {errors.rate_limit_per_minute && (
                                <p className="mt-1 text-sm text-red-600">{errors.rate_limit_per_minute}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                checked={data.active}
                                onChange={(e) => setData('active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Active (enable scraping for this website)
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                href="/admin/websites"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Website'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
