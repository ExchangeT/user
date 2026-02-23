'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, Trophy, Globe, Zap, TrendingUp, Shield } from 'lucide-react';

const stats = [
    { icon: <Users className="w-6 h-6" />, label: 'Global Users', value: 100000, suffix: '+', color: '#3b82f6' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Total Volume', value: 50, suffix: 'Cr+', prefix: '₹', color: '#10b981' },
    { icon: <Trophy className="w-6 h-6" />, label: 'Matches Covered', value: 5000, suffix: '+', color: '#f59e0b' },
    { icon: <Globe className="w-6 h-6" />, label: 'Countries', value: 45, suffix: '+', color: '#8b5cf6' },
    { icon: <Zap className="w-6 h-6" />, label: 'Predictions', value: 2500000, suffix: '+', color: '#f97316' },
    { icon: <Shield className="w-6 h-6" />, label: 'Verified', value: 100, suffix: '%', color: '#06b6d4' },
];

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let startTime: number;
        let animFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * end));
            if (progress < 1) {
                animFrame = requestAnimationFrame(animate);
            }
        };

        animFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrame);
    }, [end, duration, start]);

    return count;
}

function formatStatValue(value: number) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
}

export default function PlatformStats() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 sm:py-32 bg-[#06080c] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay pointer-events-none"></div>

            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter">
                        The Numbers <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Speak</span>
                    </h2>
                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                        Trusted by top cricket traders across the globe
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {stats.map((stat, i) => (
                        <StatCard key={i} stat={stat} isVisible={isVisible} delay={i * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatCard({ stat, isVisible, delay }: {
    stat: typeof stats[0];
    isVisible: boolean;
    delay: number;
}) {
    const count = useCountUp(stat.value, 2000 + delay, isVisible);

    return (
        <div
            className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-center hover:bg-[#1f2937]/90 hover:border-white/10 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all transform group hover:-translate-y-2 duration-500 relative overflow-hidden"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease-out ${delay}ms`,
            }}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: stat.color }} />
            <div
                className="w-14 h-14 rounded-[1.2rem] mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500 shadow-xl relative z-10"
                style={{
                    background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)`,
                    color: stat.color,
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 10px 20px ${stat.color}15`
                }}
            >
                {stat.icon}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono mb-2 tracking-tighter drop-shadow-md relative z-10">
                {stat.prefix || ''}{formatStatValue(count)}{stat.suffix}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-widest leading-tight relative z-10">
                {stat.label}
            </div>
        </div>
    );
}
