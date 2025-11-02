import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">News Grabber</h1>
                            </Link>
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Browse
                            </Link>
                            {auth.user ? (
                                <>
                                    {auth.user.is_admin && (
                                        <Link
                                            href="/admin"
                                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-3 pt-2 space-y-1">
                            <Link
                                href="/"
                                className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                            >
                                Browse
                            </Link>
                            {auth.user ? (
                                <>
                                    {auth.user.is_admin && (
                                        <Link
                                            href="/admin"
                                            className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full text-left text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            {/* Main content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} News Grabber. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
