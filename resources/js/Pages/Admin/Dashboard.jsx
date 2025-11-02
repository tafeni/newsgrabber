import AdminLayout from '@/Layouts/AdminLayout';
import { Globe, Tag, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard({ stats }) {
    const statCards = [
        { name: 'Total Websites', value: stats.total_websites, icon: Globe, color: 'bg-blue-500' },
        { name: 'Active Websites', value: stats.active_websites, icon: TrendingUp, color: 'bg-green-500' },
        { name: 'Topics', value: stats.total_topics, icon: Tag, color: 'bg-purple-500' },
        { name: 'Total Pages', value: stats.total_pages, icon: FileText, color: 'bg-orange-500' },
    ];

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
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Overview of your news aggregation system</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                            <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pages scraped today */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Today's Activity</h2>
                    <p className="text-3xl font-bold text-gray-900">{stats.pages_today}</p>
                    <p className="text-sm text-gray-500">Pages scraped today</p>
                </div>

                {/* Recent Jobs */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">Recent Scrape Jobs</h2>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {stats.recent_jobs.map((job) => (
                                <li key={job.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{job.website}</p>
                                            <p className="text-sm text-gray-500">
                                                {job.pages_scraped} scraped, {job.pages_matched} matched
                                                {job.duration && ` • ${job.duration}s`}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                                    job.status
                                                )}`}
                                            >
                                                {job.status}
                                            </span>
                                            <span className="text-xs text-gray-500">{job.started_at}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
