'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MatchCard } from '@/components/predictions/MatchCard';
import { Flame, Calendar, CheckCircle2, Search, Trophy } from 'lucide-react';

export default function MatchesPage() {
    const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: matchesData, isLoading } = useQuery({
        queryKey: ['public-matches'],
        queryFn: async () => {
            const res = await fetch('/api/matches');
            if (!res.ok) throw new Error('Failed to fetch matches');
            return res.json();
        },
        refetchInterval: 30000, // Refresh every 30s for live status updates
    });

    const matches = matchesData?.data || [];

    const filteredMatches = matches.filter((match: any) => {
        // Filter by Status Tab
        if (filter !== 'ALL' && match.status !== filter) return false;

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                match.team1.name.toLowerCase().includes(query) ||
                match.team2.name.toLowerCase().includes(query) ||
                match.team1.code.toLowerCase().includes(query) ||
                match.team2.code.toLowerCase().includes(query) ||
                match.tournament.name.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-cc-bg-primary">
            {/* Header Hero Section */}
            <div className="bg-cc-bg-secondary border-b border-cc-border-subtle pt-24 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cc-gold/5 to-cc-orange/5 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cc-gold/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center animate-slide-up">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-gold shadow-[0_10px_30px_rgba(244,196,48,0.3)]">
                        <Trophy className="w-8 h-8 text-cc-bg-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                        Prediction <span className="gradient-text">Markets</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-cc-text-muted max-w-2xl mx-auto font-medium">
                        Trade on your favorite cricket outcomes. Best odds. Zero counterparty risk.
                    </p>
                </div>
            </div>

            {/* Controls Section */}
            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Tabs */}
                    <div className="flex p-1.5 bg-cc-bg-card/50 backdrop-blur-sm rounded-2xl border border-cc-border-subtle w-full md:w-auto overflow-x-auto no-scrollbar shadow-inner">
                        {[
                            { id: 'ALL', label: 'All Matches' },
                            { id: 'LIVE', label: 'Live Now', icon: Flame, color: 'text-cc-red shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
                            { id: 'UPCOMING', label: 'Upcoming', icon: Calendar },
                            { id: 'COMPLETED', label: 'Completed', icon: CheckCircle2 }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as any)}
                                className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex-1 md:flex-none ${filter === tab.id
                                    ? 'bg-cc-bg-elevated text-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] border border-cc-border-light'
                                    : 'text-cc-text-muted hover:text-white hover:bg-cc-bg-card'
                                    }`}
                            >
                                {tab.icon && <tab.icon className={`w-4 h-4 ${filter === tab.id ? tab.color : 'text-cc-text-subtle'}`} />}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-cc-text-subtle group-focus-within:text-cc-gold transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search teams or tournaments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-cc-bg-card/50 backdrop-blur-sm border border-cc-border-subtle rounded-2xl py-3 pl-11 pr-4 text-white text-sm font-medium placeholder:text-cc-text-muted focus:outline-none focus:ring-1 focus:ring-cc-gold focus:border-cc-gold transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Match Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[340px] bg-cc-bg-card/40 rounded-3xl border border-cc-border-subtle" />
                        ))}
                    </div>
                ) : filteredMatches.length === 0 ? (
                    <div className="text-center py-24 bg-cc-bg-card/30 border border-cc-border-subtle rounded-3xl mt-8 animate-slide-up backdrop-blur-sm">
                        <div className="w-20 h-20 bg-cc-bg-elevated rounded-2xl mx-auto mb-6 flex items-center justify-center border border-cc-border-light shadow-inner">
                            <Trophy className="w-10 h-10 text-cc-text-muted" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">No Matches Found</h3>
                        <p className="text-cc-text-muted max-w-md mx-auto font-medium">We couldn't find any active matches matching your current filters. Try changing your search query or view all upcoming matches.</p>
                        <button
                            onClick={() => { setFilter('ALL'); setSearchQuery(''); }}
                            className="mt-8 px-8 py-3 bg-cc-bg-elevated hover:bg-white/10 border border-cc-border-light text-white rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 duration-300"
                        >
                            View All Matches
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {filteredMatches.map((match: any) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
