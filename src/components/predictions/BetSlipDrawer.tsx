'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';
import { X, Wallet, TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';
import { useCricMarket } from '@/hooks/useCricMarket';

interface BetSlipDrawerProps {
    matchId: string;
    market: any;
    outcome: any;
    onClose: () => void;
}

export function BetSlipDrawer({ matchId, market, outcome, onClose }: BetSlipDrawerProps) {
    const { data: session } = useSession();
    const { isConnected } = useAccount();
    const [stake, setStake] = useState<string>('');
    const [txState, setTxState] = useState<'idle' | 'approving' | 'placing' | 'success'>('idle');
    const { approveTokens, placePrediction, isWriting } = useCricMarket(market.id || 'market-test-1'); // Fallback for dev

    const numericStake = parseFloat(stake) || 0;

    // In a Parimutuel system, the frontend odds are merely an *estimate* based on the last poll.
    // The true execution price is calculated atomically by the backend at transaction time.
    const estimatedPayout = numericStake * outcome.currentOdds;

    const handleVirtualSubmit = async () => {
        if (!numericStake || numericStake <= 0) return;
        try {
            setTxState('placing');
            const res = await fetch('/api/predictions/place', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    marketId: market.id,
                    outcomeId: outcome.id,
                    amount: numericStake
                })
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to place prediction');
            }

            setTxState('success');
            toast(`Success! Wagered ${formatCurrency(numericStake)} on ${outcome.title}`, 'success');
            onClose();
        } catch (error: any) {
            console.error(error);
            setTxState('idle');
            toast('Failed: ' + error.message, 'error');
        }
    };

    const isSubmitting = txState === 'approving' || txState === 'placing';

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out md:left-auto md:right-8 md:bottom-8 md:w-96">
            <div className="bg-[#1e273c] border-t border-x md:border border-amber-500/30 rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 opacity-90" />
                        <h3 className="font-bold whitespace-nowrap">Bet Slip</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Selection Details */}
                <div className="p-5 flex flex-col gap-4">
                    <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                        <p className="text-xs font-bold text-slate-400 mb-1">{market.title}</p>
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-white line-clamp-2 pr-4">{outcome.title}</h4>
                            <div className="text-right whitespace-nowrap">
                                <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Est. Odds</span>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <span className="text-lg font-black text-amber-500">{outcome.currentOdds || outcome.odds}x</span>
                                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-bold uppercase tracking-wider mix-blend-screen animate-pulse">Live</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stake Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stake Amount</label>
                            <span className="text-xs font-medium text-slate-500">Min: 1 USDT</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                value={stake}
                                onChange={(e) => setStake(e.target.value)}
                                placeholder="0.00"
                                min="1"
                                className="w-full bg-[#111827] border border-white/10 rounded-xl py-3 pl-8 pr-16 text-white text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">USDT</span>
                        </div>

                        {/* Quick Amounts */}
                        <div className="flex gap-2 mt-2">
                            {[10, 50, 100, 'MAX'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setStake(val === 'MAX' ? '1000' : val.toString())}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors border border-white/5"
                                >
                                    {val === 'MAX' ? 'MAX' : `+$${val}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payout & Action */}
                <div className="p-5 bg-[#111827] border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">Estimated Payout</span>
                        <div className="text-right">
                            <span className="text-base font-black text-emerald-400">{formatCurrency(estimatedPayout)}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5 max-w-[150px] leading-tight">Parimutuel Odds fluctuate with market liquidity.</p>
                        </div>
                    </div>

                    {!session?.user ? (
                        <div className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700 transition" onClick={() => window.location.href = '/login'}>
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-white">Sign In to Predict</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleVirtualSubmit}
                            disabled={!numericStake || numericStake <= 0 || isSubmitting}
                            className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${!numericStake || numericStake <= 0 || isSubmitting
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border outline-none'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 cursor-pointer hover:shadow-amber-500/25'
                                }`}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</>
                            ) : (
                                <><Wallet className="w-5 h-5" /> Place Prediction</>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
