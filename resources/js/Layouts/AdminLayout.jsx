import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Home, Globe, Tag, Clock, LogOut, FileText } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Websites', href: '/admin/websites', icon: Globe },
        { name: 'Topics', href: '/admin/topics', icon: Tag },
        { name: 'Scrape Jobs', href: '/admin/scrape-jobs', icon: Clock },
        { name: 'Scraped Content', href: '/admin/scraped-pages', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                            <div className="flex flex-shrink-0 items-center px-4">
                                <h1 className="text-xl font-bold text-gray-900">News Grabber Admin</h1>
                            </div>
                            <nav className="mt-5 space-y-1 px-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <item.icon className="mr-4 h-6 w-6" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Static sidebar for desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h1 className="text-xl font-bold text-gray-900">News Grabber</h1>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{auth.user?.name}</p>
                                <p className="text-xs text-gray-500">{auth.user?.email}</p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col md:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-white shadow md:hidden">
                    <div className="flex h-16 items-center justify-between px-4">
                        <button
                            type="button"
                            className="text-gray-500 focus:outline-none"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-lg font-semibold">News Grabber</h1>
                        <div className="w-6" />
                    </div>
                </div>

                <main className="flex-1">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                            <div className="rounded-md bg-green-50 p-4">
                                <p className="text-sm font-medium text-green-800">{flash.success}</p>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-800">{flash.error}</p>
                            </div>
                        </div>
                    )}

                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
