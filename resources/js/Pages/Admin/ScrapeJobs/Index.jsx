import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, Loader, Trash2, AlertCircle } from 'lucide-react';

export default function Index({ jobs }) {
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [clearDays, setClearDays] = useState(30);

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

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this scrape job?')) {
            router.delete(`/admin/scrape-jobs/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedJobs.length === 0) {
            alert('Please select jobs to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedJobs.length} scrape job(s)?`)) {
            router.post('/admin/scrape-jobs/bulk-delete', { ids: selectedJobs }, {
                preserveScroll: true,
                onSuccess: () => setSelectedJobs([]),
            });
        }
    };

    const handleClearOld = () => {
        if (confirm(`Are you sure you want to delete all scrape jobs older than ${clearDays} days?`)) {
            router.post('/admin/scrape-jobs/clear-old', { days: clearDays }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowClearDialog(false);
                    setClearDays(30);
                },
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedJobs.length === jobs.data.length) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(jobs.data.map(job => job.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedJobs.includes(id)) {
            setSelectedJobs(selectedJobs.filter(jobId => jobId !== id));
        } else {
            setSelectedJobs([...selectedJobs, id]);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Scrape Jobs</h1>
                        <p className="mt-1 text-sm text-gray-500">Monitor scraping activity and job status</p>
                    </div>
                    <div className="flex gap-2">
                        {selectedJobs.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Selected ({selectedJobs.length})
                            </button>
                        )}
                        <button
                            onClick={() => setShowClearDialog(true)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Clear Old Jobs
                        </button>
                    </div>
                </div>

                {/* Clear Old Jobs Dialog */}
                {showClearDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Clear Old Scrape Jobs</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Delete all scrape jobs older than a specified number of days.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Days to keep:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={clearDays}
                                    onChange={(e) => setClearDays(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowClearDialog(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearOld}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Clear Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {/* Select All Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedJobs.length === jobs.data.length && jobs.data.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Select All</span>
                        </label>
                    </div>

                    <ul className="divide-y divide-gray-200">
                        {jobs.data.length === 0 ? (
                            <li className="px-4 py-12 text-center text-gray-500">
                                No scrape jobs found.
                            </li>
                        ) : (
                            jobs.data.map((job) => (
                                <li key={job.id}>
                                    <div className="px-4 py-4 sm:px-6 flex items-start gap-4">
                                        {/* Checkbox */}
                                        <div className="pt-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedJobs.includes(job.id)}
                                                onChange={() => toggleSelect(job.id)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Content */}
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

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${getStatusColor(
                                                    job.status
                                                )}`}
                                            >
                                                {job.status}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Delete job"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
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
