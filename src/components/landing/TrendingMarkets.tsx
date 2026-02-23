'use client';

import { TrendingUp, Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const markets = [
    {
        id: 'tm-1',
        match: 'MI vs CSK',
        tournament: 'IPL 2026',
        question: 'Who will win the match?',
        type: 'MATCH_WINNER',
        options: [
            { name: 'Mumbai Indians', odds: 1.85, trend: 'up' },
            { name: 'Chennai Super Kings', odds: 2.10, trend: 'down' },
        ],
        volume: 1250000,
        isHot: true,
    },
    {
        id: 'tm-2',
        match: 'IND vs AUS',
        tournament: 'T20 World Cup',
        question: 'Total runs in 1st innings?',
        type: 'TOTAL_RUNS',
        options: [
            { name: 'Over 160.5', odds: 1.92, trend: 'up' },
            { name: 'Under 160.5', odds: 1.88, trend: 'stable' },
        ],
        volume: 3200000,
        isHot: true,
    },
    {
        id: 'tm-3',
        match: 'RCB vs KKR',
        tournament: 'IPL 2026',
        question: 'Highest scorer of the match?',
        type: 'HIGHEST_SCORER',
        options: [
            { name: 'Virat Kohli', odds: 4.50, trend: 'up' },
            { name: 'Sunil Narine', odds: 6.00, trend: 'stable' },
            { name: 'Phil Salt', odds: 5.25, trend: 'down' },
        ],
        volume: 890000,
        isHot: false,
    },
    {
        id: 'tm-4',
        match: 'SRH vs RR',
        tournament: 'IPL 2026',
        question: 'Who will win?',
        type: 'MATCH_WINNER',
        options: [
            { name: 'Sunrisers Hyderabad', odds: 1.75, trend: 'up' },
            { name: 'Rajasthan Royals', odds: 2.20, trend: 'down' },
        ],
        volume: 720000,
        isHot: false,
    },
];

function formatCurrency(amount: number) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
}

export default function TrendingMarkets() {
    return (
        <section className="py-20 sm:py-32 bg-cc-bg-secondary relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cc-orange/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cc-gold/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#f4c430 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Trending <span className="gradient-text">Markets</span>
                    </h2>
                    <p className="text-cc-text-muted text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                        The hottest prediction liquidity pools right now
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {markets.map((market, index) => (
                        <div
                            key={market.id}
                            className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl overflow-hidden hover:bg-cc-bg-card/60 hover:border-cc-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(244,196,48,0.1)] transition-all duration-500 group"
                        >
                            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-cc-border-subtle/50 bg-black/20">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-cc-gold bg-cc-gold/10 border border-cc-gold/20 px-3 py-1.5 rounded-lg tracking-wide uppercase">
                                        {market.tournament}
                                    </span>
                                    {market.isHot && (
                                        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-cc-orange bg-cc-orange/10 border border-cc-orange/20 px-3 py-1.5 rounded-lg tracking-wider shadow-[0_0_10px_rgba(255,107,53,0.2)]">
                                            <Flame className="w-3.5 h-3.5 animate-pulse drop-shadow-[0_0_5px_rgba(255,107,53,0.8)]" /> HOT
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-cc-text-muted font-bold tracking-wider px-3 py-1.5 bg-cc-bg-primary/50 border border-cc-border-subtle/50 rounded-lg">{market.match}</span>
                            </div>

                            <div className="px-6 py-5">
                                <h3 className="text-white font-extrabold text-lg sm:text-xl mb-4 leading-tight tracking-tight">{market.question}</h3>

                                <div className="space-y-3">
                                    {market.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className="w-full relative overflow-hidden flex items-center justify-between px-5 py-3 sm:py-4 bg-cc-bg-primary/50 rounded-2xl hover:bg-cc-bg-primary border border-cc-border-subtle hover:border-cc-gold/50 transition-all duration-300 group/btn shadow-inner"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-cc-gold/0 via-cc-gold/0 to-cc-gold/0 group-hover/btn:from-cc-gold/5 group-hover/btn:via-transparent group-hover/btn:to-transparent transition-all duration-500" />
                                            <span className="text-sm sm:text-base text-white font-bold relative z-10">{opt.name}</span>
                                            <div className="flex items-center gap-3 relative z-10">
                                                {opt.trend === 'up' && <TrendingUp className="w-4 h-4 text-cc-green drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                                                {opt.trend === 'down' && <TrendingUp className="w-4 h-4 text-cc-red rotate-180 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />}
                                                {opt.trend === 'stable' && <div className="w-2 h-0.5 bg-cc-text-muted rounded flex-shrink-0" />}
                                                <span className="text-base sm:text-lg font-mono font-black text-cc-gold drop-shadow-md">{opt.odds.toFixed(2)}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-cc-bg-secondary/60 border-t border-cc-border-subtle flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-cc-text-muted tracking-wider mb-0.5">Pool Volume</span>
                                    <span className="font-mono font-bold text-white leading-none">{formatCurrency(market.volume)}</span>
                                </div>
                                <Link href={`/matches`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-cc-gold hover:text-cc-bg-primary hover:border-cc-gold hover:shadow-[0_0_15px_rgba(244,196,48,0.3)] transition-all duration-300">
                                    Trade <ArrowRight className="w-4 h-4 origin-left group-hover:scale-110 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
