'use client';

import { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
    id: string;
    title: string;
    summary?: string;
    imageUrl?: string;
    publishedAt: string | Date;
    category?: string;
    sourceName?: string;
}

export default function CricketNewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadNews() {
            try {
                const res = await fetch('/api/landing/news');
                const data = await res.json();
                if (data.success && data.data) {
                    setNews(data.data.slice(0, 6));
                }
            } catch { /* handled by API fallback */ }
            finally { setIsLoading(false); }
        }
        loadNews();
    }, []);

    function formatDate(date: string | Date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return (
        <section id="news" className="py-20 sm:py-32 bg-cc-bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cc-blue/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6 animate-slide-up">
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Market <span className="gradient-text">Insights</span>
                        </h2>
                        <p className="text-cc-text-muted text-lg sm:text-xl font-medium">
                            Latest news and analysis to inform your trading strategy
                        </p>
                    </div>
                    <Link
                        href="#news"
                        className="group hidden sm:inline-flex items-center gap-3 px-6 py-3 bg-cc-bg-card/50 backdrop-blur-md border border-cc-border-light text-white font-bold text-sm rounded-xl hover:bg-cc-bg-card hover:border-cc-gold/50 hover:text-cc-gold transition-all duration-300"
                    >
                        View All Intel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-cc-bg-card/40 rounded-3xl overflow-hidden animate-pulse border border-cc-border-subtle">
                                <div className="h-56 bg-cc-bg-card" />
                                <div className="p-6 space-y-4">
                                    <div className="h-5 bg-cc-bg-card rounded w-3/4" />
                                    <div className="h-4 bg-cc-bg-card rounded w-full" />
                                    <div className="h-4 bg-cc-bg-card rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {news.map((item, i) => (
                            <article
                                key={item.id || i}
                                className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl overflow-hidden hover:bg-cc-bg-card/60 hover:border-cc-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(244,196,48,0.1)] transition-all duration-500 group cursor-pointer flex flex-col h-full"
                            >
                                {/* Image Overlaying Title inside Image Container */}
                                <div className="relative h-56 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                        style={{
                                            backgroundImage: item.imageUrl
                                                ? `url(${item.imageUrl})`
                                                : 'linear-gradient(135deg, #1a2235, #243049)',
                                        }}
                                    />
                                    {/* Double Gradient for readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-cc-bg-card via-cc-bg-card/40 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-cc-bg-card/90 via-transparent to-transparent" />

                                    {item.category && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="text-[10px] font-black text-cc-gold tracking-widest uppercase bg-cc-bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cc-gold/20 shadow-lg">
                                                {item.category}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title floating on image */}
                                    <div className="absolute bottom-4 left-6 right-6 z-10">
                                        <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-2 group-hover:text-cc-gold transition-colors duration-300 drop-shadow-md">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    {item.summary && (
                                        <p className="text-cc-text-muted text-sm line-clamp-3 mb-6 leading-relaxed font-medium">
                                            {item.summary}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-cc-text-subtle font-bold tracking-wider uppercase mt-auto pt-4 border-t border-cc-border-subtle/50">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-cc-text-muted" />
                                            {formatDate(item.publishedAt)}
                                        </div>
                                        {item.sourceName && (
                                            <span className="text-cc-text-muted">{item.sourceName}</span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10 sm:hidden">
                    <Link
                        href="#news"
                        className="group inline-flex items-center gap-3 px-6 py-3 bg-cc-bg-card/50 backdrop-blur-md border border-cc-border-light text-white font-bold text-sm rounded-xl hover:bg-cc-bg-card hover:border-cc-gold/50 hover:text-cc-gold transition-all duration-300"
                    >
                        View All Intel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
