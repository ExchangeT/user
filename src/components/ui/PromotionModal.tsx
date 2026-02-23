'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useActivePromotions } from '@/lib/hooks';
import Link from 'next/link';

export function PromotionModal() {
    const { data: promotions, isLoading } = useActivePromotions();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Only show if we have promotions and haven't dismissed today
        if (promotions && promotions.length > 0) {
            const lastDismissed = localStorage.getItem('promotion_dismissed');
            if (!lastDismissed || new Date(lastDismissed).getTime() < new Date().getTime() - 24 * 60 * 60 * 1000) {
                setIsOpen(true);
            }
        }
    }, [promotions]);

    if (!mounted || !isOpen || isLoading || !promotions || promotions.length === 0) {
        return null;
    }

    const banner = promotions[0]; // Show the highest priority/order active banner

    const dismissModal = () => {
        setIsOpen(false);
        localStorage.setItem('promotion_dismissed', new Date().toISOString());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#1a2235] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <button
                    onClick={dismissModal}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/80 text-white/70 hover:text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {banner.linkUrl ? (
                    <Link href={banner.linkUrl} onClick={dismissModal} className="block group">
                        <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-[#111827]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={banner.imageUrl}
                                alt={banner.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#0f1729] via-[#0f1729]/80 to-transparent">
                                <h3 className="text-xl font-bold text-white mb-2">{banner.title}</h3>
                                <div className="text-[#f4c430] text-sm font-semibold flex items-center gap-2">
                                    Click to learn more <span>→</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-[#111827]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#0f1729] via-[#0f1729]/80 to-transparent">
                            <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
