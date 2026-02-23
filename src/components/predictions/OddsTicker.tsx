'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OddsTickerProps {
    odds: number;
}

export function OddsTicker({ odds }: OddsTickerProps) {
    const previousOddsRef = useRef(odds);
    const [direction, setDirection] = useState<'up' | 'down' | 'none'>('none');

    useEffect(() => {
        if (odds > previousOddsRef.current) {
            setDirection('up');
        } else if (odds < previousOddsRef.current) {
            setDirection('down');
        } else {
            setDirection('none');
        }

        previousOddsRef.current = odds;

        // Reset the flash after 2 seconds
        if (odds !== previousOddsRef.current) {
            const timer = setTimeout(() => {
                setDirection('none');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [odds]);

    const getColor = () => {
        if (direction === 'up') return 'text-cc-green';
        if (direction === 'down') return 'text-cc-red';
        return 'text-white';
    };

    const getBgColor = () => {
        if (direction === 'up') return 'bg-cc-green/20 border border-cc-green/30';
        if (direction === 'down') return 'bg-cc-red/20 border border-cc-red/30';
        return 'bg-transparent border border-transparent';
    };

    return (
        <motion.div
            className={`flex flex-col items-end px-3 py-1.5 rounded-lg transition-all duration-300 ${getBgColor()}`}
            key={`${odds}-${direction}`} // Force re-render animation safely
            initial={direction !== 'none' ? { scale: 1.15 } : false}
            animate={{ scale: 1 }}
        >
            <span className={`font-mono font-black text-xl md:text-2xl ${getColor()} transition-colors duration-300 flex items-center gap-1.5 drop-shadow-md`}>
                {(Number(odds) || 0).toFixed(2)}x
            </span>
            {direction === 'up' && (
                <span className="flex items-center text-[10px] text-cc-green font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> UP
                </span>
            )}
            {direction === 'down' && (
                <span className="flex items-center text-[10px] text-cc-red font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] mt-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> DOWN
                </span>
            )}
        </motion.div>
    );
}
