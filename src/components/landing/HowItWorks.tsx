'use client';

import { Wallet, Target, Trophy, ArrowRight, Shield } from 'lucide-react';

const steps = [
    {
        icon: <Wallet className="w-8 h-8" />,
        title: 'Connect & Fund',
        description: 'Sign up in seconds. Deposit via 9+ blockchains or fiat. Control your own liquidity.',
        color: '#f59e0b', // Amber
        step: '01',
    },
    {
        icon: <Target className="w-8 h-8" />,
        title: 'Make Predictions',
        description: 'Browse global cricket tournaments. Choose your market and predict the outcome.',
        color: '#3b82f6', // Blue
        step: '02',
    },
    {
        icon: <Trophy className="w-8 h-8" />,
        title: 'Win & Withdraw',
        description: 'Settled instantly via smart contracts. Withdraw winnings securely to any wallet.',
        color: '#10b981', // Emerald
        step: '03',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 sm:py-32 bg-[#020408] relative overflow-hidden border-t border-white/5">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
                <div className="text-center mb-24 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-300">Simple & Secure</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Works</span>
                    </h2>
                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Start making predictions and earning rewards in under two minutes with our decentralized infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    {/* Background Desktop Line connecting cards */}
                    <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                    {steps.map((step, i) => (
                        <div key={i} className="relative group flex flex-col items-center">

                            {/* Step Indicator */}
                            <div className="w-16 h-16 rounded-full bg-[#111827] border-4 border-[#020408] flex items-center justify-center -mb-8 z-10 shadow-xl group-hover:scale-110 transition-transform duration-500"
                                style={{
                                    boxShadow: `0 0 20px ${step.color}20`
                                }}
                            >
                                <span className="font-black text-xl" style={{ color: step.color }}>{step.step}</span>
                            </div>

                            {/* Card Content */}
                            <div className="bg-[#111827] border border-white/5 rounded-[2rem] p-10 pt-16 text-center w-full hover:border-white/10 hover:bg-[#1f2937] transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">

                                {/* Background Glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                                    style={{ backgroundColor: step.color }}
                                />

                                <div
                                    className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500 relative z-10"
                                    style={{
                                        background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                                        border: `1px solid ${step.color}40`,
                                        color: step.color,
                                    }}
                                >
                                    {step.icon}
                                </div>

                                <h3 className="text-2xl font-black text-white mb-4 tracking-tight relative z-10">{step.title}</h3>
                                <p className="text-slate-400 text-base leading-relaxed font-medium relative z-10">{step.description}</p>
                            </div>

                            {/* Mobile Arrow */}
                            {i < steps.length - 1 && (
                                <div className="md:hidden flex justify-center mt-8 -mb-4">
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-slate-500 rotate-90" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
