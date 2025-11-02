import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function Index({ jobs }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'running':
                return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
            default:
                return <Clock className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'running':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Scrape Jobs</h1>
                    <p className="mt-1 text-sm text-gray-500">Monitor scraping activity and job status</p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {jobs.data.map((job) => (
                            <li key={job.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(job.status)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {job.website.label}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{job.website.url}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-500 sm:grid-cols-4">
                                                <div>
                                                    <span className="font-medium">Pages Scraped:</span> {job.pages_scraped}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Matched:</span> {job.pages_matched}
                                                </div>
                                                {job.duration && (
                                                    <div>
                                                        <span className="font-medium">Duration:</span> {job.duration}s
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-medium">Started:</span> {job.started_at || 'Not started'}
                                                </div>
                                            </div>
                                            {job.log && (
                                                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                    {job.log}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                                    job.status
                                                )}`}
                                            >
                                                {job.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pagination */}
                {jobs.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{jobs.from}</span> to{' '}
                                    <span className="font-medium">{jobs.to}</span> of{' '}
                                    <span className="font-medium">{jobs.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    {jobs.links.map((link, index) => (
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
