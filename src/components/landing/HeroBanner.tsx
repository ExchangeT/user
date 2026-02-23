'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HeroBanner() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">

            {/* Extremely bold background effects */}
            <div className="absolute inset-0 bg-[#06080c]" />

            {/* Glowing Orbs */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" style={{ animation: 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center mt-10">

                {/* Launch Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-slide-up">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">The Future of Cricket is Live</span>
                </div>

                {/* Massive Headline */}
                <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tighter text-white mb-8 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Trade Cricket Predictions on <br className="hidden md:block" />
                    <span className="relative inline-block mt-2">
                        <span className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-600 blur-2xl opacity-40"></span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 drop-shadow-sm">
                            Blockchain Speed
                        </span>
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed tracking-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    Instant payouts. Zero counterparty risk. The world's first decentralized liquidity protocol for global cricket events.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Link href="/matches" className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-extrabold text-lg rounded-2xl hover:bg-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                        Explore Markets <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-colors">
                        How it Works
                    </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Powered by Web3 Technology</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-bold text-lg text-white">
                            <Zap className="w-5 h-5 text-amber-500" /> Instant Settlement
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg text-white">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Transparent Pools
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg text-white">
                            <Trophy className="w-5 h-5 text-blue-400" /> Highest Liquidity
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
