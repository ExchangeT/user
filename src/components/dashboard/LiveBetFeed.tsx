'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Activity, Coins } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface LiveBet {
    id: string;
    user: string;
    userImage?: string | null;
    amount: number;
    match: string;
    outcome: string;
    time: string; // ISO string from backend
}

export function LiveBetFeed() {
    const [bets, setBets] = useState<LiveBet[]>([]);

    // We fetch a highly simplified initial state or just start empty.
    // For a real prod app, you might fetch the last 10 from an API on mount.
    // Here we'll just hydrate as real-time events come in to demonstrate the WebSocket speed.

    useRealtime('global-activity', 'new-prediction', (data: LiveBet) => {
        setBets((prevBets) => {
            // Add new bet to top, keep only the latest 10
            const newArray = [data, ...prevBets];
            return newArray.slice(0, 10);
        });
    });

    return (
        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 flex flex-col h-full hidden xl:flex">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <h3 className="text-sm font-semibold flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </div>
                    <span>Global Feed</span>
                </h3>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden flex-1 relative">
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {bets.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-sm text-slate-500 py-8 flex flex-col items-center justify-center space-y-2"
                            >
                                <Activity className="h-6 w-6 text-slate-300" />
                                <span>Waiting for live predictions...</span>
                            </motion.div>
                        ) : (
                            bets.map((bet) => (
                                <motion.div
                                    key={bet.id}
                                    initial={{ opacity: 0, x: 20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                                    className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700 shadow-sm flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0">
                                        {bet.userImage ? (
                                            <Image
                                                src={bet.userImage}
                                                alt={bet.user}
                                                width={32}
                                                height={32}
                                                className="rounded-full bg-slate-100"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                {bet.user.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 dark:text-slate-200 truncate font-medium">
                                            {bet.user} <span className="text-slate-500 dark:text-slate-400 font-normal">predicted</span> {bet.outcome}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            {bet.match}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1.5 text-xs">
                                            <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                                {bet.amount} USDT
                                            </span>
                                            <span className="text-slate-400 text-[10px]">
                                                {formatDistanceToNow(new Date(bet.time), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
