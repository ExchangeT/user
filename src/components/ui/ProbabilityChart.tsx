'use client';

import { useState, useMemo } from 'react';

interface ProbabilityChartProps {
    data?: { time: string; value: number }[];
    color?: string;
    height?: number;
    label?: string;
}

export default function ProbabilityChart({ data, color = '#f4c430', height = 200, label = 'Probability' }: ProbabilityChartProps) {
    const [timeframe, setTimeframe] = useState('1W');
    const timeframes = ['1H', '6H', '1D', '1W', 'ALL'];

    // Generate mock chart data based on timeframe
    const chartData = useMemo(() => {
        if (data) return data;
        const points = timeframe === '1H' ? 12 : timeframe === '6H' ? 36 : timeframe === '1D' ? 48 : timeframe === '1W' ? 56 : 90;
        let v = 45 + Math.random() * 20;
        return Array.from({ length: points }, (_, i) => {
            v += (Math.random() - 0.48) * 4;
            v = Math.max(10, Math.min(90, v));
            return { time: String(i), value: v };
        });
    }, [timeframe, data]);

    const maxVal = Math.max(...chartData.map(d => d.value));
    const minVal = Math.min(...chartData.map(d => d.value));
    const range = maxVal - minVal || 1;

    const padTop = 20;
    const padBottom = 30;
    const padLeft = 40;
    const padRight = 10;
    const chartW = 600;
    const chartH = height;
    const innerW = chartW - padLeft - padRight;
    const innerH = chartH - padTop - padBottom;

    const points = chartData.map((d, i) => {
        const x = padLeft + (i / (chartData.length - 1)) * innerW;
        const y = padTop + innerH - ((d.value - minVal) / range) * innerH;
        return { x, y, value: d.value };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaD = `${pathD} L${points[points.length - 1].x},${padTop + innerH} L${points[0].x},${padTop + innerH} Z`;

    // Grid lines
    const gridLines = 5;
    const gridVals = Array.from({ length: gridLines }, (_, i) => minVal + (range * i) / (gridLines - 1));

    const currentValue = chartData[chartData.length - 1]?.value || 50;
    const prevValue = chartData.length > 1 ? chartData[chartData.length - 2].value : currentValue;
    const change = currentValue - chartData[0]?.value;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold" style={{ color }}>{currentValue.toFixed(0)}%</span>
                    <span className="text-sm" style={{ color: change >= 0 ? '#10b981' : '#ef4444' }}>
                        {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="text-xs text-[#64748b]">{label}</span>
                </div>
                <div className="flex bg-[#111827] rounded-lg p-0.5">
                    {timeframes.map((tf) => (
                        <button key={tf} onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${timeframe === tf ? 'bg-[#243049] text-white' : 'text-[#64748b] hover:text-white'}`}>
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ height }}>
                {/* Grid lines */}
                {gridVals.map((gv, i) => {
                    const y = padTop + innerH - ((gv - minVal) / range) * innerH;
                    return (
                        <g key={i}>
                            <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
                            <text x={padLeft - 5} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">{gv.toFixed(0)}%</text>
                        </g>
                    );
                })}
                {/* Area fill */}
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill="url(#chartGrad)" />
                {/* Line */}
                <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                {/* Current dot */}
                <circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="4" fill={color} />
                <circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="8" fill={color} opacity="0.2" />
            </svg>
        </div>
    );
}
