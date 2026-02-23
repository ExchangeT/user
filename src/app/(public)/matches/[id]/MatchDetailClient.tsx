'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui';
import { Trophy, Clock, Users, AlertCircle, Share2, Twitter, MessageCircle } from 'lucide-react';
import { BetSlipDrawer } from '@/components/predictions/BetSlipDrawer';
import { useRealtime } from '@/hooks/useRealtime';
import { MatchChat } from '@/components/predictions/MatchChat';
import { OddsTicker } from '@/components/predictions/OddsTicker';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

interface MatchDetailClientProps {
    initialData: any;
    matchId: string;
}

export default function MatchDetailClient({ initialData, matchId }: MatchDetailClientProps) {
    const [selectedOutcome, setSelectedOutcome] = useState<any | null>(null);
    const [selectedMarket, setSelectedMarket] = useState<any | null>(null);

    const queryClient = useQueryClient();
    const { data: qData, isLoading } = useQuery({
        queryKey: ['match-details', matchId],
        queryFn: async () => {
            const res = await fetch(`/api/matches/${matchId}`);
            if (!res.ok) throw new Error('Failed to fetch match');
            return res.json();
        },
        initialData: { data: initialData },
        refetchInterval: 30000,
    });

    const match = qData?.data || initialData;

    // Social Share Links
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out the prediction markets for ${match.team1.name} vs ${match.team2.name} on CricChain! 🏏🏆`;

    const shareActions = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:text-[#1DA1F2]'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
            color: 'hover:text-[#25D366]'
        },
        {
            name: 'Telegram',
            icon: Share2,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            color: 'hover:text-[#0088cc]'
        }
    ];

    // Real-time scores subscription
    useRealtime(`match-${matchId}`, 'score-update', (data: any) => {
        queryClient.setQueryData(['match-details', matchId], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                status: data.status.includes('Live') ? 'LIVE' : old.status,
                score: data.score
            };
        });
    });

    // Real-time odds subscription
    useRealtime(`match-${matchId}`, 'odds-update', (data: any) => {
        queryClient.setQueryData(['match-details', matchId], (old: any) => {
            if (!old?.data?.markets) return old;

            const updatedMarkets = old.data.markets.map((m: any) => {
                if (m.id === data.marketId) {
                    const updatedOutcomes = m.outcomes.map((o: any) => {
                        const newOutcome = data.outcomes.find((no: any) => no.id === o.id);
                        if (newOutcome) {
                            return { ...o, currentOdds: newOutcome.odds };
                        }
                        return o;
                    });
                    return { ...m, outcomes: updatedOutcomes };
                }
                return m;
            });

            return { ...old, data: { ...old.data, markets: updatedMarkets } };
        });
    });

    const isLive = match.status === 'LIVE';

    const handleSelectOutcome = (market: any, outcome: any) => {
        if (match.status !== 'LIVE' && match.status !== 'UPCOMING') return;
        if (market.status !== 'OPEN') return;
        setSelectedMarket(market);
        setSelectedOutcome(outcome);
    };

    return (
        <div className="min-h-screen bg-cc-bg-primary pb-24">
            {/* Match Header Hero */}
            <div className="bg-cc-bg-secondary border-b border-cc-border-subtle pt-24 pb-8 md:pb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cc-gold/5 via-cc-bg-primary to-cc-blue/5 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cc-gold/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center animate-slide-up">
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <Badge variant={isLive ? 'red' : match.status === 'COMPLETED' ? 'purple' : 'gold'} className={`text-[10px] font-black tracking-widest uppercase py-1.5 px-5 shadow-inner ${isLive ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}`}>
                            {match.status}
                        </Badge>

                        {/* Social Shares */}
                        <div className="flex items-center gap-3 md:gap-4 ml-4 md:ml-6 border-l border-cc-border-subtle pl-4 md:pl-6">
                            <span className="text-[10px] text-cc-text-subtle uppercase font-black tracking-[0.2em] hidden sm:inline">Share</span>
                            <div className="flex bg-cc-bg-card/50 backdrop-blur-sm p-1.5 rounded-full border border-cc-border-subtle gap-1 shadow-inner">
                                {shareActions.map((action) => (
                                    <a
                                        key={action.name}
                                        href={action.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-cc-text-muted transition-all hover:bg-cc-bg-elevated hover:shadow-md ${action.color}`}
                                        title={`Share on ${action.name}`}
                                    >
                                        <action.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-5 w-full md:w-auto">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-cc-bg-primary/80 backdrop-blur-md border border-cc-border-subtle p-5 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cc-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {match.team1.logoUrl ? (
                                    <Image src={match.team1.logoUrl} alt={match.team1.name} fill className="object-contain p-5 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <span className="text-3xl font-black text-cc-text-muted tracking-wider">{match.team1.code}</span>
                                )}
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">{match.team1.name}</h2>
                                <p className="text-cc-text-muted font-bold text-xs uppercase tracking-widest mt-1">Home</p>
                            </div>
                        </div>

                        {/* VS Divider */}
                        <div className="flex flex-col items-center justify-center my-4 md:my-0">
                            <span className="text-sm font-black text-cc-text-subtle mb-3 tracking-[0.3em] uppercase bg-cc-bg-primary/50 px-4 py-1.5 rounded-full border border-cc-border-subtle shadow-inner">VS</span>
                            <div className="px-6 py-2.5 bg-cc-bg-card/80 rounded-2xl border border-cc-border-subtle backdrop-blur-md shadow-lg flex flex-col items-center">
                                {match.status === 'UPCOMING' ? (
                                    <>
                                        <span className="text-[10px] text-cc-gold uppercase font-black tracking-widest mb-1 drop-shadow-sm">Starts In</span>
                                        <CountdownTimer targetDate={match.startTime} className="font-mono font-bold text-lg text-white" />
                                    </>
                                ) : (
                                    <span className="text-sm font-mono font-bold text-cc-text-secondary">
                                        {format(new Date(match.startTime), 'MMM do, yyyy • h:mm a')}
                                    </span>
                                )}
                            </div>
                            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-cc-text-muted uppercase tracking-wider bg-cc-bg-primary/40 px-3 py-1.5 rounded-lg border border-cc-border-subtle">
                                📍 {match.venue || 'TBA'}
                            </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-5 w-full md:w-auto">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-cc-bg-primary/80 backdrop-blur-md border border-cc-border-subtle p-5 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cc-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {match.team2.logoUrl ? (
                                    <Image src={match.team2.logoUrl} alt={match.team2.name} fill className="object-contain p-5 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <span className="text-3xl font-black text-cc-text-muted tracking-wider">{match.team2.code}</span>
                                )}
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">{match.team2.name}</h2>
                                <p className="text-cc-text-muted font-bold text-xs uppercase tracking-widest mt-1">Away</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Markets + Chat */}
            <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left: Markets (8 Cols) */}
                    <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-cc-border-subtle">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                                <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_0_15px_rgba(244,196,48,0.3)]">
                                    <Trophy className="w-5 h-5 text-cc-bg-primary" />
                                </div>
                                Prediction Markets
                            </h3>
                            <div className="text-xs font-bold text-cc-text-muted tracking-widest uppercase bg-cc-bg-card/50 px-4 py-2 rounded-lg border border-cc-border-subtle backdrop-blur-sm">
                                <span className="text-cc-gold mr-1">{match.markets?.length || 0}</span> Markets
                            </div>
                        </div>

                        {match.markets?.length === 0 ? (
                            <div className="text-center py-20 bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl shadow-inner">
                                <div className="w-20 h-20 bg-cc-bg-elevated rounded-2xl mx-auto mb-6 flex items-center justify-center border border-cc-border-light shadow-inner">
                                    <Clock className="w-10 h-10 text-cc-text-muted" />
                                </div>
                                <h4 className="text-xl font-extrabold text-white mb-3">No Markets Open Yet</h4>
                                <p className="text-cc-text-muted max-w-sm mx-auto font-medium leading-relaxed">Check back closer to the match start time to place your predictions on various outcomes.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {match.markets?.map((market: any, index: number) => (
                                    <div key={market.id} className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl overflow-hidden shadow-lg animate-slide-up" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                                        {/* Market Header */}
                                        <div className="p-5 md:p-6 border-b border-cc-border-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cc-bg-elevated/40">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-extrabold text-white tracking-tight">{market.title}</h4>
                                                <Badge variant={market.status === 'OPEN' ? 'green' : 'purple'} className="text-[10px] font-black px-2.5 py-1 tracking-widest uppercase shadow-sm">
                                                    {market.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs font-bold uppercase tracking-wider">
                                                <span className="text-cc-text-muted flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> <span className="text-white">${market.totalVolume?.toLocaleString() || 0}</span> Vol</span>
                                                <span className="text-cc-text-subtle flex items-center gap-1.5">
                                                    Closes:
                                                    {market.status === 'OPEN' && market.closeTime ? (
                                                        <CountdownTimer targetDate={market.closeTime} className="font-mono text-white bg-cc-bg-primary/50 px-2 py-0.5 rounded border border-cc-border-subtle" dangerThresholdSeconds={300} />
                                                    ) : market.closeTime ? (
                                                        <span className="text-white bg-cc-bg-primary/50 px-2 py-0.5 rounded border border-cc-border-subtle font-mono">{format(new Date(market.closeTime), 'h:mm a')}</span>
                                                    ) : 'TBD'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Outcomes Grid */}
                                        <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {market.outcomes?.map((outcome: any) => (
                                                <button
                                                    key={outcome.id}
                                                    onClick={() => handleSelectOutcome(market, outcome)}
                                                    disabled={market.status !== 'OPEN'}
                                                    className={`
                                                        relative p-5 rounded-2xl border flex flex-col gap-3 transition-all text-left group overflow-hidden
                                                        ${market.status !== 'OPEN'
                                                            ? 'bg-cc-bg-primary/40 border-cc-border-subtle/50 opacity-50 cursor-not-allowed'
                                                            : selectedOutcome?.id === outcome.id
                                                                ? 'bg-cc-gold/10 border-cc-gold shadow-[0_0_20px_rgba(244,196,48,0.15)] transform -translate-y-1'
                                                                : 'bg-cc-bg-elevated/50 border-cc-border-subtle hover:border-cc-gold/50 hover:bg-cc-bg-elevated hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5'
                                                        }
                                                    `}
                                                >
                                                    {/* Selection Glow */}
                                                    {selectedOutcome?.id === outcome.id && (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-cc-gold/5 to-transparent pointer-events-none" />
                                                    )}

                                                    <div className="flex justify-between items-start w-full gap-3 relative z-10">
                                                        <span className={`font-extrabold line-clamp-2 leading-tight ${selectedOutcome?.id === outcome.id ? 'text-cc-gold drop-shadow-sm' : 'text-white'}`}>
                                                            {outcome.title}
                                                        </span>
                                                        <OddsTicker odds={outcome.currentOdds || outcome.odds} />
                                                    </div>
                                                    <div className="mt-auto flex justify-between items-center w-full pt-3 border-t border-cc-border-subtle/50 relative z-10">
                                                        <span className="text-[10px] text-cc-text-muted font-bold tracking-widest uppercase">
                                                            <span className="text-white mr-1">{(outcome.probability * 100).toFixed(0)}%</span> Implied
                                                        </span>
                                                        {market.status === 'OPEN' && (
                                                            <span className="flex items-center text-[9px] text-cc-green font-black uppercase tracking-widest bg-cc-green/10 px-2 py-0.5 rounded border border-cc-green/20">
                                                                Live
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Social/Chat (4 Cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-[calc(100vh-140px)]">
                        <MatchChat matchId={matchId} />
                    </div>
                </div>
            </div>

            {/* Bet Slip Drawer Component */}
            {selectedOutcome && selectedMarket && (
                <BetSlipDrawer
                    matchId={matchId}
                    market={selectedMarket}
                    outcome={selectedOutcome}
                    onClose={() => setSelectedOutcome(null)}
                />
            )}
        </div>
    );
}
