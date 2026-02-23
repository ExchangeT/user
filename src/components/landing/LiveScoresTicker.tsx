'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';

interface LiveScore {
    id: string;
    name: string;
    status: string;
    teamInfo?: Array<{ name: string; shortname: string; img?: string }>;
    score?: Array<{ r: number; w: number; o: number; inning: string }>;
    matchStarted?: boolean;
}

export default function LiveScoresTicker() {
    const [scores, setScores] = useState<LiveScore[]>([]);
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadScores() {
            try {
                const res = await fetch('/api/landing/live-scores');
                const data = await res.json();
                if (data.success && data.data) {
                    setScores(data.data);
                }
            } catch { /* fallback handled by API */ }
        }
        loadScores();
        // Poll every 60 seconds
        const interval = setInterval(loadScores, 60000);
        return () => clearInterval(interval);
    }, []);

    if (scores.length === 0) return null;

    // Double scores for infinite scroll effect
    const displayScores = [...scores, ...scores];

    return (
        <section id="live-scores" className="relative bg-cc-bg-secondary/40 backdrop-blur-md border-y border-cc-border-subtle overflow-hidden h-[52px] flex items-center">
            {/* Live indicator */}
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 lg:px-8 bg-gradient-to-r from-cc-bg-primary via-cc-bg-primary/90 to-transparent">
                <div className="flex items-center gap-2 px-3 py-1 bg-cc-red/10 border border-cc-red/20 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)] backdrop-blur-sm">
                    <Radio className="w-3.5 h-3.5 text-cc-red animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <span className="text-[10px] font-bold text-cc-red uppercase tracking-widest">Live Markets</span>
                </div>
            </div>

            {/* Scrolling Ticker */}
            <div className="pl-40 lg:pl-56 overflow-hidden flex-1 flex items-center h-full">
                <div
                    ref={tickerRef}
                    className="flex gap-4 animate-ticker whitespace-nowrap items-center h-full"
                >
                    {displayScores.map((match, i) => (
                        <div
                            key={`${match.id}-${i}`}
                            className="inline-flex items-center gap-3 px-4 h-8 bg-cc-bg-card/40 rounded-lg border border-cc-border-subtle hover:border-cc-gold hover:bg-cc-bg-card hover:shadow-[0_0_15px_rgba(244,196,48,0.15)] transition-all cursor-pointer group backdrop-blur-sm"
                        >
                            {match.teamInfo && match.teamInfo.length >= 2 ? (
                                <>
                                    <span className="text-sm font-extrabold text-white group-hover:text-cc-gold transition-colors tracking-tight">
                                        {match.teamInfo[0].shortname}
                                    </span>
                                    {match.score && match.score[0] && (
                                        <span className="text-xs font-mono font-semibold text-cc-gold">
                                            {match.score[0].r}/{match.score[0].w} <span className="text-cc-text-muted opacity-70">({match.score[0].o})</span>
                                        </span>
                                    )}
                                    <span className="text-[10px] text-cc-text-subtle font-black italic px-1 opacity-50">VS</span>
                                    <span className="text-sm font-extrabold text-white group-hover:text-cc-gold transition-colors tracking-tight">
                                        {match.teamInfo[1].shortname}
                                    </span>
                                    {match.score && match.score[1] && (
                                        <span className="text-xs font-mono font-semibold text-cc-text-secondary group-hover:text-white transition-colors">
                                            {match.score[1].r}/{match.score[1].w} <span className="text-cc-text-muted opacity-70">({match.score[1].o})</span>
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-sm font-bold text-white tracking-tight">{match.name}</span>
                            )}
                            {match.matchStarted && (
                                <span className="w-1.5 h-1.5 bg-cc-red rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)] ml-1" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cc-bg-primary via-cc-bg-primary/80 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
