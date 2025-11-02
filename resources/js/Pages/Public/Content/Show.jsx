import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Globe, ExternalLink, Tag } from 'lucide-react';

export default function Show({ page }) {
    return (
        <PublicLayout>
            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Articles
                    </Link>

                    {/* Article Header */}
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center">
                                    <Globe className="h-4 w-4 mr-2" />
                                    <span className="font-medium">{page.website.label}</span>
                                </div>
                                {page.publish_date && (
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>{page.publish_date}</span>
                                    </div>
                                )}
                                <a
                                    href={page.canonical_url || page.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View Original
                                </a>
                            </div>

                            {/* Meta Description */}
                            {page.meta_description && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 italic">{page.meta_description}</p>
                                </div>
                            )}

                            {/* Topics */}
                            {page.topics && page.topics.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                        <Tag className="h-4 w-4 mr-2" />
                                        Topics & Keywords
                                    </h3>
                                    <div className="space-y-3">
                                        {page.topics.map((topic, index) => (
                                            <div key={index} className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {topic.name}
                                                </span>
                                                {topic.keywords.map((keyword, keyIndex) => (
                                                    <span
                                                        key={keyIndex}
                                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images */}
                            {page.images && page.images.length > 0 && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {page.images.slice(0, 4).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Article image ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="prose prose-lg max-w-none">
                                {page.content_html ? (
                                    <div dangerouslySetInnerHTML={{ __html: page.content_html }} />
                                ) : (
                                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                        {page.content_text}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Source:</span>{' '}
                                        <a
                                            href={page.website.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {page.website.domain}
                                        </a>
                                    </div>
                                    <div>Scraped on {page.scraped_at}</div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Related Articles CTA */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                        >
                            Browse More Articles
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
