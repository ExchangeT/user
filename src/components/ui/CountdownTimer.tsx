'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string | Date;
    onComplete?: () => void;
    className?: string;
    dangerThresholdSeconds?: number; // When to turn red (e.g., 300 = 5 mins)
}

export function CountdownTimer({
    targetDate,
    onComplete,
    className = "",
    dangerThresholdSeconds = 300
}: CountdownTimerProps) {

    // Internal state to hold the remaining time
    const [timeLeft, setTimeLeft] = useState<{
        hasEnded: boolean;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        totalSeconds: number;
    }>({
        hasEnded: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0
    });

    useEffect(() => {
        const targetTime = new Date(targetDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference <= 0) {
                return {
                    hasEnded: true,
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    totalSeconds: 0
                };
            }

            return {
                hasEnded: false,
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                totalSeconds: Math.floor(difference / 1000)
            };
        };

        // Initial calculation
        const initialTime = calculateTimeLeft();
        setTimeLeft(initialTime);

        if (initialTime.hasEnded) {
            if (onComplete) onComplete();
            return;
        }

        // Set up the interval
        const intervalId = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.hasEnded) {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetDate, onComplete]);

    if (timeLeft.hasEnded) {
        return <span className={`font-mono font-bold text-red-500 ${className}`}>00:00:00:00</span>;
    }

    const pad = (num: number) => num.toString().padStart(2, '0');

    const isDanger = timeLeft.totalSeconds <= dangerThresholdSeconds;
    const colorClass = isDanger ? 'text-red-400 animate-pulse' : 'text-slate-300';

    return (
        <span className={`font-mono font-bold tracking-wider ${colorClass} ${className}`}>
            {timeLeft.days > 0 && `${pad(timeLeft.days)}d `}
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
    );
}
