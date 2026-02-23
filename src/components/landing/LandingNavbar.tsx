'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, ChevronRight, LogIn } from 'lucide-react';

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Markets', href: '/matches' },
        { label: 'Leaderboard', href: '#leaderboard' },
        { label: 'How it Works', href: '#how-it-works' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[#0a0e17]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                : 'bg-transparent pt-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] transition-all duration-300 group-hover:scale-105">
                            <Zap className="w-5 h-5 text-black fill-black" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            Cric<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Chain</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-md">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-5 py-2 text-sm font-bold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all rounded-full"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
                        >
                            <LogIn className="w-4 h-4" /> Log In
                        </Link>
                        <Link
                            href="/matches"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-white text-black rounded-xl hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                        >
                            Trade Now <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#0a0e17]/95 backdrop-blur-3xl border-b border-white/10 absolute top-full left-0 right-0 shadow-2xl">
                    <div className="px-4 py-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="block px-4 py-4 text-base font-bold text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-6 mt-2 border-t border-white/10 flex flex-col gap-3">
                            <Link href="/login" className="flex justify-center items-center gap-2 w-full px-4 py-4 text-sm font-bold text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <LogIn className="w-4 h-4" /> Client Login
                            </Link>
                            <Link href="/matches" className="flex justify-center items-center gap-2 w-full px-4 py-4 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                Enter App <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
