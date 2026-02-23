'use client';

import Link from 'next/link';
import { Zap, Twitter, Github, Send, MessageCircle, Lock } from 'lucide-react';

const footerLinks = {
    Platform: [
        { label: 'Live Scores', href: '#live-scores' },
        { label: 'Matches', href: '/matches' },
        { label: 'Predictions', href: '/predictions' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Campaigns', href: '/campaigns' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/press' },
        { label: 'Contact', href: '/contact' },
    ],
    Support: [
        { label: 'Help Center', href: '/help' },
        { label: 'FAQ', href: '/help#faq' },
        { label: 'Responsible Gaming', href: '/responsible-gaming' },
        { label: 'Grievance Redressal', href: '/grievance' },
    ],
    Legal: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Disclaimer', href: '/disclaimer' },
    ],
};

const socials = [
    { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
    { icon: <Send className="w-4 h-4" />, href: '#', label: 'Telegram' },
    { icon: <MessageCircle className="w-4 h-4" />, href: '#', label: 'Discord' },
    { icon: <Github className="w-4 h-4" />, href: '#', label: 'GitHub' },
];

export default function LandingFooter() {
    return (
        <footer className="bg-[#020408] border-t border-white/5 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                {/* Main Footer */}
                <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 flex flex-col items-start">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] transition-all duration-300">
                                <Zap className="w-5 h-5 text-black fill-black" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
                                Cric<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Chain</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
                            The world&apos;s first decentralized cricket prediction market. Blockchain-powered. Global coverage.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-10 h-10 rounded-xl bg-[#111827]/50 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all border border-white/5 hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-xs font-black text-white mb-5 uppercase tracking-widest">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-medium text-slate-400 hover:text-amber-500 transition-colors block w-fit"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-slate-500">
                        © 2026 CricChain. All rights reserved. Trade responsibly.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-[#111827]/50 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-amber-500" /> SECURE BLOCKCHAIN
                        </span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-[#111827]/50 border border-white/5 px-3 py-1.5 rounded-lg">
                            18+ ONLY
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
