'use client';

import { Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const featuredMatches = [
    {
        id: 'fm-1',
        team1: { name: 'Mumbai Indians', short: 'MI', color: '#004BA0' },
        team2: { name: 'Chennai Super Kings', short: 'CSK', color: '#FFCB05' },
        tournament: 'IPL 2026',
        venue: 'Wankhede Stadium, Mumbai',
        startTime: '2026-03-20T19:30:00+05:30',
        poolSize: 2500000,
        predictions: 12847,
        status: 'upcoming',
    },
    {
        id: 'fm-2',
        team1: { name: 'Royal Challengers Bengaluru', short: 'RCB', color: '#EC1C24' },
        team2: { name: 'Kolkata Knight Riders', short: 'KKR', color: '#3A225D' },
        tournament: 'IPL 2026',
        venue: 'M. Chinnaswamy Stadium, Bengaluru',
        startTime: '2026-03-21T19:30:00+05:30',
        poolSize: 1800000,
        predictions: 9563,
        status: 'upcoming',
    },
];

function formatCurrency(amount: number) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
}

function getCountdown(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Starting soon';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${mins}m`;
}

export default function FeaturedMatches() {
    return (
        <section id="matches" className="py-24 sm:py-32 bg-[#06080c] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="animate-slide-up">
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Markets</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl font-medium">
                            Trade on the highest volume liquidity pools across global cricket events.
                        </p>
                    </div>
                    <Link
                        href="/matches"
                        className="hidden md:flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors group"
                    >
                        View All Markets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Match Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {featuredMatches.map((match, i) => (
                        <Link
                            key={match.id}
                            href={`/matches/${match.id}`}
                            className="group block bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:bg-[#1f2937]/80 hover:border-amber-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 animate-slide-up"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Tournament Badge & Time */}
                            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg tracking-wide uppercase">
                                    {match.tournament}
                                </span>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 text-xs font-semibold text-slate-300 rounded-lg border border-white/5">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    {getCountdown(match.startTime)}
                                </div>
                            </div>

                            {/* Teams Area */}
                            <div className="px-6 py-10 relative">
                                {/* VS Background Graphic */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                                    <span className="text-[140px] font-black italic tracking-tighter">VS</span>
                                </div>

                                <div className="flex items-center justify-between relative z-10">
                                    {/* Team 1 */}
                                    <div className="flex flex-col items-center gap-4 w-[40%] text-center">
                                        <div
                                            className="w-20 h-20 rounded-[20px] flex items-center justify-center text-2xl font-black text-white shadow-2xl z-10 group-hover:scale-105 transition-transform duration-500"
                                            style={{
                                                background: `linear-gradient(135deg, ${match.team1.color}, ${match.team1.color}99)`,
                                                boxShadow: `0 10px 30px ${match.team1.color}40, inset 0 2px 0 ${match.team1.color}60`
                                            }}
                                        >
                                            {match.team1.short}
                                        </div>
                                        <div>
                                            <p className="text-white font-extrabold text-lg leading-tight tracking-tight line-clamp-2">{match.team1.name}</p>
                                        </div>
                                    </div>

                                    {/* VS Divider */}
                                    <div className="flex flex-col items-center justify-center w-[20%]">
                                        <div className="w-12 h-12 rounded-full bg-[#0a0e17] border border-white/10 flex items-center justify-center z-10 group-hover:border-amber-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors">
                                            <span className="text-sm font-black italic text-slate-500 group-hover:text-amber-500 transition-colors">VS</span>
                                        </div>
                                    </div>

                                    {/* Team 2 */}
                                    <div className="flex flex-col items-center gap-4 w-[40%] text-center">
                                        <div
                                            className="w-20 h-20 rounded-[20px] flex items-center justify-center text-2xl font-black text-white shadow-2xl z-10 group-hover:scale-105 transition-transform duration-500"
                                            style={{
                                                background: `linear-gradient(135deg, ${match.team2.color}, ${match.team2.color}99)`,
                                                boxShadow: `0 10px 30px ${match.team2.color}40, inset 0 2px 0 ${match.team2.color}60`
                                            }}
                                        >
                                            {match.team2.short}
                                        </div>
                                        <div>
                                            <p className="text-white font-extrabold text-lg leading-tight tracking-tight line-clamp-2">{match.team2.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Footer */}
                            <div className="px-6 py-5 bg-[#0a0e17]/50 border-t border-white/5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-bold tracking-widest uppercase">Pool Volume</span>
                                        </div>
                                        <span className="font-mono font-black text-lg text-white leading-tight">{formatCurrency(match.poolSize)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all">
                                    Trade Now
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="md:hidden mt-8 flex justify-center">
                    <Link
                        href="/matches"
                        className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors"
                    >
                        Explore All Markets <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
