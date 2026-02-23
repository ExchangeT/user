'use client';

import { useState, useCallback } from 'react';
import { useRealtime } from '@/hooks/useRealtime';
import { formatRelativeTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User } from 'lucide-react';

interface PredictionEvent {
    id: string;
    user: string;
    userImage?: string;
    amount: number;
    match: string;
    outcome: string;
    time: string;
}

export function LiveBetFeed() {
    const [events, setEvents] = useState<PredictionEvent[]>([]);

    const handleNewPrediction = useCallback((data: PredictionEvent) => {
        setEvents((prev) => [data, ...prev].slice(0, 10));
    }, []);

    useRealtime('global-activity', 'new-prediction', handleNewPrediction);

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Activity</h3>
                </div>
                <Zap className="w-4 h-4 text-amber-400" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {events.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-10">
                            <ActivityIcon className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-tighter italic">Awaiting predictions...</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-3 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-xs font-bold text-slate-300">
                                        {event.userImage ? (
                                            <img src={event.userImage} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-black text-white truncate">{event.user}</p>
                                            <span className="text-[10px] font-bold text-slate-500 shrink-0">
                                                {formatRelativeTime(new Date(event.time))}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            Bet <span className="text-amber-400 font-bold">{event.amount} USDT</span> on
                                            <span className="text-blue-400 font-bold ml-1">{event.outcome}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 text-[9px] font-bold text-slate-500 flex items-center gap-1.5 overflow-hidden">
                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                    <span className="truncate opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                                        {event.match}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
    );
}
